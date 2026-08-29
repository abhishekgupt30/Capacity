"""Profile schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.profile import UserRole


class ProfileBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    email: str = Field(..., max_length=255)
    role: UserRole = Field(default=UserRole.EMPLOYEE)
    team_id: uuid.UUID
    weekly_capacity: float = Field(default=40.0, ge=0, le=168)


class ProfileCreate(ProfileBase):
    pass


class ProfileRead(ProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
