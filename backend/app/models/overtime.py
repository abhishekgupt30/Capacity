"""Overtime request model with approval workflow."""

import enum
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Float, Text, DateTime, Date, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class OvertimeStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class OvertimeRequest(Base):
    __tablename__ = "overtime_requests"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"ot_req_{uuid.uuid4().hex[:8]}",
    )
    user_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    team_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("teams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    extra_hours: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    project_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )
    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )
    status: Mapped[OvertimeStatus] = mapped_column(
        Enum(OvertimeStatus, name="overtime_status", create_constraint=True),
        nullable=False,
        default=OvertimeStatus.PENDING,
    )
    reviewed_by: Mapped[str | None] = mapped_column(
        String(50),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True,
    )
    manager_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["Profile"] = relationship(  # noqa: F821
        back_populates="overtime_requests",
        foreign_keys=[user_id],
    )
    team: Mapped["Team"] = relationship(  # noqa: F821
        back_populates="overtime_requests",
    )
    reviewer: Mapped["Profile | None"] = relationship(  # noqa: F821
        foreign_keys=[reviewed_by],
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<OvertimeRequest status={self.status.value}>"
