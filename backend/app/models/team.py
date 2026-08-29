"""Team model."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"team_{uuid.uuid4().hex[:8]}",
    )
    name: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False,
        index=True,
    )
    department: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    primary_focus: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
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
