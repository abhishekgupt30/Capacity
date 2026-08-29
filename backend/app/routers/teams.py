"""Teams router for managing organizational structures."""

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
    query = select(Team).where(Team.id == current_user.team_id)
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
    if team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Team access denied")
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
            efficiency_index=round(
                (sum(t.completed_hours for t in tasks) / sum(t.estimated_hours for t in tasks)) * 100,
                1,
            ) if tasks and sum(t.estimated_hours for t in tasks) > 0 else 0.0,
            blockers_count=blockers,
            status=capacity_status,
            skills=[],
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
    if team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Team access denied")
    team_query = select(Team).where(Team.id == team_id)
    team_result = await db.execute(team_query)
    team = team_result.scalar_one_or_none()

    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

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

    task_query = select(Task).where(Task.team_id == team_id)
    task_result = await db.execute(task_query)
    tasks = task_result.scalars().all()
    cycle_times = [
        max(0, (task.deadline - task.created_at.date()).days)
        for task in tasks
    ]
    critical_dependencies = sum(
        1 for task in tasks
        if task.status != TaskStatus.COMPLETED and task.priority.value == "critical"
    )

    return {
        "team_id": str(team_id),
        "team_name": team.name,
        "department": team.department or "",
        "active_resources": len(members),
        "efficiency_index": round(sum(m.efficiency_index for m in members) / len(members), 1) if members else 0.0,
        "total_capacity_hours": total_capacity,
        "total_allocated_hours": total_allocated,
        "utilization_rate": round(utilization_rate, 1),
        "blockers_identified": blockers,
        "avg_cycle_time_days": round(sum(cycle_times) / len(cycle_times), 1) if cycle_times else 0.0,
        "critical_dependencies": critical_dependencies,
        "overloaded_members_count": overloaded_count,
        "status": team_status
    }
