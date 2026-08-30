"""Task model with priority and status tracking."""

import enum
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import String, Float, Date, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"task_{uuid.uuid4().hex[:8]}",
    )
    title: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    estimated_hours: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    completed_hours: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    deadline: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, name="task_priority", create_constraint=True),
        nullable=False,
        default=TaskPriority.MEDIUM,
    )
    assigned_to: Mapped[str] = mapped_column(
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
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status", create_constraint=True),
        nullable=False,
        default=TaskStatus.TODO,
    )
    project_key: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    tags: Mapped[list[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    assignee: Mapped["Profile"] = relationship(  # noqa: F821
        back_populates="tasks",
    )

    def __repr__(self) -> str:
        return f"<Task {self.title!r}>"
