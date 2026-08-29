"""Tasks router for handling task CRUD and reassignments."""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.profile import Profile, UserRole
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
async def get_tasks(
    assignee_id: str | None = None,
    team_id: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    if team_id and team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Team access denied")
    if assignee_id and assignee_id != current_user.id and current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Assignee access denied")
    query = select(Task)
    if assignee_id:
        query = query.where(Task.assigned_to == assignee_id)
    if team_id:
        query = query.where(Task.team_id == team_id)

    result = await db.execute(query)
    tasks = result.scalars().all()

    response = []
    for task in tasks:
        # Load assignee profile details (selectinloaded or query)
        assignee_query = select(Profile).where(Profile.id == task.assigned_to)
        assignee_result = await db.execute(assignee_query)
        assignee = assignee_result.scalar_one_or_none()

        task_read = TaskRead.model_validate(task)
        if assignee:
            task_read.assignee_name = assignee.name
            task_read.assignee_avatar = assignee.avatar_url

        # Compute blocker risk
        if task.description and ("blocker" in task.description.lower() or "blocking" in task.description.lower()):
            task_read.blocker_risk = True

        response.append(task_read)

    return response


@router.post("", response_model=TaskRead)
async def create_task(
    payload: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    if payload.team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Team access denied")
    if current_user.role != UserRole.MANAGER and payload.assignee_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only managers can assign another member")
    # Verify assignee exists
    assignee_query = select(Profile).where(Profile.id == payload.assignee_id)
    assignee_result = await db.execute(assignee_query)
    assignee = assignee_result.scalar_one_or_none()
    if not assignee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignee not found",
        )
    if assignee.team_id != payload.team_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assignee must belong to the selected team")

    # Autogenerate project key if not provided
    project_key = payload.project_key or f"CAP-{hash(payload.title) % 900 + 100}"

    new_task = Task(
        title=payload.title,
        description=payload.description,
        estimated_hours=payload.estimated_hours,
        completed_hours=0.0,
        deadline=payload.deadline,
        priority=payload.priority,
        assigned_to=payload.assignee_id,
        team_id=payload.team_id,
        status=payload.status,
        project_key=project_key,
        tags=payload.tags,
    )
    db.add(new_task)
    await db.flush()

    task_read = TaskRead.model_validate(new_task)
    task_read.assignee_name = assignee.name
    task_read.assignee_avatar = assignee.avatar_url

    return task_read


@router.put("/{task_id}/status", response_model=TaskRead)
async def update_task_status(
    task_id: str,
    payload: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if current_user.role != UserRole.MANAGER and task.assigned_to != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")

    if payload.status is not None:
        task.status = payload.status
        # Update completed hours if completed
        if payload.status == TaskStatus.COMPLETED:
            task.completed_hours = task.estimated_hours
        else:
            task.completed_hours = 0.0

    await db.flush()

    # Load assignee
    assignee_query = select(Profile).where(Profile.id == task.assigned_to)
    assignee_result = await db.execute(assignee_query)
    assignee = assignee_result.scalar_one_or_none()

    task_read = TaskRead.model_validate(task)
    if assignee:
        task_read.assignee_name = assignee.name
        task_read.assignee_avatar = assignee.avatar_url

    return task_read


@router.put("/{task_id}/reassign", response_model=TaskRead)
async def reassign_task(
    task_id: str,
    payload: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    if not payload.assignee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="assigneeId is required for reassignment",
        )

    # Get task
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if current_user.role != UserRole.MANAGER and task.assigned_to != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")

    # Verify new assignee exists
    assignee_query = select(Profile).where(Profile.id == payload.assignee_id)
    assignee_result = await db.execute(assignee_query)
    new_assignee = assignee_result.scalar_one_or_none()
    if not new_assignee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="New assignee not found",
        )
    if new_assignee.team_id != current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Assignee team access denied")
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only managers can reassign tasks")

    task.assigned_to = payload.assignee_id
    await db.flush()

    task_read = TaskRead.model_validate(task)
    task_read.assignee_name = new_assignee.name
    task_read.assignee_avatar = new_assignee.avatar_url

    return task_read


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if current_user.role != UserRole.MANAGER and task.assigned_to != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")

    await db.delete(task)
    return {"success": True}
