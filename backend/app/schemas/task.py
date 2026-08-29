"""Task schemas."""

import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskPriority, TaskStatus


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: str | None = Field(default=None)
    estimated_hours: float = Field(..., gt=0, le=200)
    deadline: date
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)


class TaskCreate(TaskBase):
    assigned_to: uuid.UUID


class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    assigned_to: uuid.UUID
    status: TaskStatus
    created_at: datetime


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=300)
    description: str | None = None
    estimated_hours: float | None = Field(default=None, gt=0, le=200)
    deadline: date | None = None
    priority: TaskPriority | None = None
    status: TaskStatus | None = None
    assigned_to: uuid.UUID | None = None
