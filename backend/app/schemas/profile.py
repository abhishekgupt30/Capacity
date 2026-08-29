"""Profile schemas."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.profile import UserRole


class ProfileBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    email: str = Field(..., max_length=255)
    role: UserRole = Field(default=UserRole.EMPLOYEE)
    team_id: str
    weekly_capacity: float = Field(default=40.0, ge=0, le=168)
    title: str | None = Field(default=None, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=255)


class ProfileCreate(ProfileBase):
    password: str = Field(..., min_length=6)


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: UserRole
    team_id: str
    team_name: str | None = None
    title: str | None = None
    avatar_url: str | None = None
    weekly_capacity: float
    current_hours: float = 0.0


class MemberCapacityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: UserRole
    title: str | None = None
    avatar: str | None = None
    weekly_capacity: float
    allocated_hours: float = 0.0
    completed_hours: float = 0.0
    overtime_hours: float = 0.0
    efficiency_index: float = 100.0
    blockers_count: int = 0
    status: str = "balanced"
    skills: list[str] = Field(default_factory=list)
    active_task_count: int = 0
