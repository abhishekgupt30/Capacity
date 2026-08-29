"""Team model."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    profiles: Mapped[list["Profile"]] = relationship(  # noqa: F821
        back_populates="team",
        lazy="selectin",
    )
    overtime_requests: Mapped[list["OvertimeRequest"]] = relationship(  # noqa: F821
        back_populates="team",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Team {self.name!r}>"
