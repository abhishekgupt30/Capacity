"""Overtime request schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.overtime import OvertimeStatus


class OvertimeRequestBase(BaseModel):
    extra_hours: float = Field(..., gt=0, le=40)
    reason: str = Field(..., min_length=1, max_length=1000)


class OvertimeRequestCreate(OvertimeRequestBase):
    user_id: uuid.UUID
    team_id: uuid.UUID


class OvertimeRequestRead(OvertimeRequestBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    team_id: uuid.UUID
    status: OvertimeStatus
    reviewed_by: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class OvertimeRequestUpdate(BaseModel):
    status: OvertimeStatus
    reviewed_by: uuid.UUID
