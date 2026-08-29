"""Team schemas."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    department: str | None = Field(default=None, max_length=120)
    description: str | None = Field(default=None, max_length=255)
    primary_focus: str | None = Field(default=None, max_length=120)


class TeamCreate(TeamBase):
    pass


class TeamRead(TeamBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    lead_name: str | None = None
    lead_id: str | None = None
    members_count: int = 0
    efficiency_index: float = 100.0
    blockers_count: int = 0
