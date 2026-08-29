"""Task schemas."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskPriority, TaskStatus


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: str | None = Field(default=None)
    estimated_hours: float = Field(..., gt=0, le=200)
    deadline: date
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    tags: list[str] = Field(default_factory=list)


class TaskCreate(TaskBase):
    assignee_id: str
    team_id: str
    project_key: str | None = None


class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: TaskStatus
    created_at: datetime
    completed_hours: float
    team_id: str
    project_key: str | None = None
    assignee_id: str = Field(validation_alias="assigned_to")
    assignee_name: str | None = None
    assignee_avatar: str | None = None
    blocker_risk: bool = False


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=300)
    description: str | None = None
    estimated_hours: float | None = Field(default=None, gt=0, le=200)
    completed_hours: float | None = None
    deadline: date | None = None
    priority: TaskPriority | None = None
    status: TaskStatus | None = None
    assignee_id: str | None = None
    project_key: str | None = None
    tags: list[str] | None = None
