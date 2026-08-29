"""Overtime request schemas."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.overtime import OvertimeStatus


class OvertimeRequestBase(BaseModel):
    reason: str = Field(..., min_length=1, max_length=1000)
    project_name: str = Field(..., min_length=1, max_length=150)
    date: date


class OvertimeRequestCreate(OvertimeRequestBase):
    employee_id: str
    requested_hours: float = Field(..., gt=0, le=40)


class OvertimeRequestRead(OvertimeRequestBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: OvertimeStatus
    created_at: datetime
    updated_at: datetime
    employee_id: str = Field(validation_alias="user_id")
    employee_name: str | None = None
    employee_title: str | None = None
    employee_avatar: str | None = None
    team_id: str
    team_name: str | None = None
    requested_hours: float = Field(validation_alias="extra_hours")
    current_capacity_hours: float = 40.0
    current_allocated_hours: float = 0.0
    reviewed_by: str | None = None
    reviewed_at: datetime | None = None
    manager_notes: str | None = None


class OvertimeRequestReview(BaseModel):
    status: OvertimeStatus
    manager_notes: str | None = None
    reviewer_name: str | None = None
