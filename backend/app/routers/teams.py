"""Teams router for managing organizational structures."""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.profile import Profile, UserRole
from app.models.task import Task, TaskStatus
from app.models.team import Team
from app.models.overtime import OvertimeRequest, OvertimeStatus
from app.schemas.team import TeamRead
from app.schemas.profile import MemberCapacityRead

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[TeamRead])
async def get_teams(
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    query = select(Team)
    result = await db.execute(query)
    teams = result.scalars().all()

    response = []
    for team in teams:
        # Find lead (manager)
        lead = next((p for p in team.profiles if p.role == UserRole.MANAGER), None)
        members_count = sum(1 for p in team.profiles if p.role == UserRole.EMPLOYEE)

        team_read = TeamRead.model_validate(team)
        team_read.lead_name = lead.name if lead else None
        team_read.lead_id = lead.id if lead else None
        team_read.members_count = members_count
        response.append(team_read)

    return response


@router.get("/{team_id}/members", response_model=list[MemberCapacityRead])
async def get_team_members(
    team_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    # Verify team exists
    team_query = select(Team).where(Team.id == team_id)
    team_result = await db.execute(team_query)
    team = team_result.scalar_one_or_none()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    # Get profiles belonging to this team
    profile_query = select(Profile).where(Profile.team_id == team_id)
    profile_result = await db.execute(profile_query)
    profiles = profile_result.scalars().all()

    members = []
    for profile in profiles:
        # We only treat employees as active capacity members in the dashboard view
        if profile.role == UserRole.MANAGER:
            continue

        # Get tasks
        tasks = profile.tasks
        allocated_hours = sum(t.estimated_hours for t in tasks if t.status != TaskStatus.COMPLETED)
        completed_hours = sum(t.completed_hours for t in tasks if t.status == TaskStatus.COMPLETED)

        # Get overtime requests
        overtime_query = select(OvertimeRequest).where(
            OvertimeRequest.user_id == profile.id,
            OvertimeRequest.status == OvertimeStatus.APPROVED
        )
        overtime_result = await db.execute(overtime_query)
        approved_overtime = overtime_result.scalars().all()
        overtime_hours = sum(o.extra_hours for o in approved_overtime)

        # Compute status
        capacity = profile.weekly_capacity
        total_allowed = capacity + overtime_hours

        if allocated_hours > total_allowed:
            capacity_status = "overloaded"
        elif overtime_hours > 0:
            capacity_status = "overtime"
        elif allocated_hours >= 35.0:
            capacity_status = "approaching"
        elif allocated_hours >= 28.0:
            capacity_status = "balanced"
        else:
            capacity_status = "underutilized"

        # Count blockers (tasks with blockerRisk or description containing "blocker")
        blockers = sum(1 for t in tasks if t.status != TaskStatus.COMPLETED and t.description and "blocker" in t.description.lower())

        member_read = MemberCapacityRead(
            id=profile.id,
            name=profile.name,
            email=profile.email,
            role=profile.role,
            title=profile.title,
            avatar=profile.avatar_url,
            weekly_capacity=capacity,
            allocated_hours=allocated_hours,
            completed_hours=completed_hours,
            overtime_hours=overtime_hours,
            efficiency_index=94.0 if allocated_hours <= total_allowed else 78.0,
            blockers_count=blockers,
            status=capacity_status,
            skills=["Backend", "API"] if profile.title and "software" in profile.title.lower() else ["Design", "UI"],
            active_task_count=sum(1 for t in tasks if t.status != TaskStatus.COMPLETED)
        )
        members.append(member_read)

    return members


@router.get("/{team_id}/metrics")
async def get_team_metrics(
    team_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    team_query = select(Team).where(Team.id == team_id)
    team_result = await db.execute(team_query)
    team = team_result.scalar_one_or_none()

    members = await get_team_members(team_id=team_id, db=db, current_user=current_user)

    total_capacity = sum(m.weekly_capacity for m in members)
    total_allocated = sum(m.allocated_hours for m in members)
    utilization_rate = (total_allocated / total_capacity * 100) if total_capacity > 0 else 0.0
    blockers = sum(m.blockers_count for m in members)
    overloaded_count = sum(1 for m in members if m.status == "overloaded")

    # Team status
    if utilization_rate > 100:
        team_status = "overloaded"
    elif utilization_rate >= 85:
        team_status = "approaching"
    elif utilization_rate >= 70:
        team_status = "balanced"
    else:
        team_status = "underutilized"

    return {
        "teamId": str(team_id),
        "teamName": team.name if team else "Team",
        "department": (team.department if team else "Engineering") or "Engineering",
        "activeResources": len(members),
        "efficiencyIndex": sum(m.efficiency_index for m in members) / len(members) if members else 100.0,
        "totalCapacityHours": total_capacity,
        "totalAllocatedHours": total_allocated,
        "utilizationRate": round(utilization_rate, 1),
        "blockersIdentified": blockers,
        "avgCycleTimeDays": 3.5,
        "criticalDependencies": 2,
        "overloadedMembersCount": overloaded_count,
        "status": team_status
    }
