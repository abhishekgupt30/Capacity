"""Profile (user) model with role-based access."""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserRole(str, enum.Enum):
    EMPLOYEE = "employee"
    MANAGER = "manager"


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"usr_{uuid.uuid4().hex[:8]}",
    )
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role", create_constraint=True),
        nullable=False,
        default=UserRole.EMPLOYEE,
    )
    team_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("teams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    weekly_capacity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=40.0,
    )
    title: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    avatar_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    team: Mapped["Team"] = relationship(  # noqa: F821
        back_populates="profiles",
    )
    tasks: Mapped[list["Task"]] = relationship(  # noqa: F821
        back_populates="assignee",
        lazy="selectin",
    )
    overtime_requests: Mapped[list["OvertimeRequest"]] = relationship(  # noqa: F821
        back_populates="user",
        foreign_keys="OvertimeRequest.user_id",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Profile {self.name!r} role={self.role.value}>"
