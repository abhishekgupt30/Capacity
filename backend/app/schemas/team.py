"""Team schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)


class TeamCreate(TeamBase):
    pass


class TeamRead(TeamBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
