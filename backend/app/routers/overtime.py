"""Overtime requests router."""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.profile import Profile, UserRole
from app.models.team import Team
from app.models.task import Task, TaskStatus
from app.models.overtime import OvertimeRequest, OvertimeStatus
from app.schemas.overtime import OvertimeRequestCreate, OvertimeRequestRead, OvertimeRequestReview

router = APIRouter(prefix="/overtime", tags=["overtime"])


@router.get("/requests", response_model=list[OvertimeRequestRead])
async def get_overtime_requests(
    team_id: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    if team_id and team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Team access denied")
    query = select(OvertimeRequest)
    if team_id:
        query = query.where(OvertimeRequest.team_id == team_id)
    if current_user.role != UserRole.MANAGER:
        query = query.where(OvertimeRequest.user_id == current_user.id)

    result = await db.execute(query)
    requests = result.scalars().all()

    response = []
    for req in requests:
        # Load user details
        user_query = select(Profile).where(Profile.id == req.user_id)
        user_result = await db.execute(user_query)
        user = user_result.scalar_one_or_none()

        # Load team details
        team_query = select(Team).where(Team.id == req.team_id)
        team_result = await db.execute(team_query)
        team = team_result.scalar_one_or_none()

        # Load manager reviewer details
        reviewer_name = None
        if req.reviewed_by:
            rev_query = select(Profile.name).where(Profile.id == req.reviewed_by)
            rev_result = await db.execute(rev_query)
            reviewer_name = rev_result.scalar()

        # Calculate current allocated task hours
        allocated_hours = 0.0
        if user:
            task_query = select(Task.estimated_hours).where(
                Task.assigned_to == user.id,
                Task.status != TaskStatus.COMPLETED
            )
            task_result = await db.execute(task_query)
            allocated_hours = sum(task_result.scalars().all())

        req_read = OvertimeRequestRead.model_validate(req)
        if user:
            req_read.employee_name = user.name
            req_read.employee_title = user.title
            req_read.employee_avatar = user.avatar_url
            req_read.current_capacity_hours = user.weekly_capacity

        if team:
            req_read.team_name = team.name

        req_read.current_allocated_hours = allocated_hours
        req_read.reviewed_by = reviewer_name
        if req.status != OvertimeStatus.PENDING:
            req_read.reviewed_at = req.updated_at

        response.append(req_read)

    return response


@router.post("/requests", response_model=OvertimeRequestRead)
async def submit_overtime_request(
    payload: OvertimeRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    if current_user.role != UserRole.MANAGER and payload.employee_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only submit your own request")
    # Verify employee exists
    user_query = select(Profile).where(Profile.id == payload.employee_id)
    user_result = await db.execute(user_query)
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found",
        )
    if user.team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Employee team access denied")

    # Submit request
    new_req = OvertimeRequest(
        user_id=payload.employee_id,
        team_id=user.team_id,  # Use employee's team
        extra_hours=payload.requested_hours,
        reason=payload.reason,
        project_name=payload.project_name,
        date=payload.date,
        status=OvertimeStatus.PENDING,
    )
    db.add(new_req)
    await db.flush()

    # Load team
    team_query = select(Team.name).where(Team.id == user.team_id)
    team_result = await db.execute(team_query)
    team_name = team_result.scalar()

    # Calculate current allocated task hours
    task_query = select(Task.estimated_hours).where(
        Task.assigned_to == user.id,
        Task.status != TaskStatus.COMPLETED
    )
    task_result = await db.execute(task_query)
    allocated_hours = sum(task_result.scalars().all())

    req_read = OvertimeRequestRead.model_validate(new_req)
    req_read.employee_name = user.name
    req_read.employee_title = user.title
    req_read.employee_avatar = user.avatar_url
    req_read.current_capacity_hours = user.weekly_capacity
    req_read.team_name = team_name
    req_read.current_allocated_hours = allocated_hours

    return req_read


@router.put("/requests/{id}/review", response_model=OvertimeRequestRead)
async def review_overtime_request(
    id: str,
    payload: OvertimeRequestReview,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    # Only managers can review overtime requests
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can review overtime requests",
        )

    query = select(OvertimeRequest).where(OvertimeRequest.id == id)
    result = await db.execute(query)
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Overtime request not found",
        )

    req.status = payload.status
    req.reviewed_by = current_user.id
    req.manager_notes = payload.manager_notes
    req.updated_at = datetime.now(timezone.utc)
    await db.flush()

    # Load user details
    user_query = select(Profile).where(Profile.id == req.user_id)
    user_result = await db.execute(user_query)
    user = user_result.scalar_one_or_none()

    # Load team details
    team_query = select(Team.name).where(Team.id == req.team_id)
    team_result = await db.execute(team_query)
    team_name = team_result.scalar()

    # Calculate allocated hours
    task_query = select(Task.estimated_hours).where(
        Task.assigned_to == req.user_id,
        Task.status != TaskStatus.COMPLETED
    )
    task_result = await db.execute(task_query)
    allocated_hours = sum(task_result.scalars().all())

    req_read = OvertimeRequestRead.model_validate(req)
    if user:
        req_read.employee_name = user.name
        req_read.employee_title = user.title
        req_read.employee_avatar = user.avatar_url
        req_read.current_capacity_hours = user.weekly_capacity

    req_read.team_name = team_name
    req_read.current_allocated_hours = allocated_hours
    req_read.reviewed_by = current_user.name
    req_read.reviewed_at = req.updated_at

    return req_read
