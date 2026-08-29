"""AI Agent schemas."""

from datetime import datetime
from pydantic import BaseModel, Field


class AgentLogStep(BaseModel):
    timestamp: str
    level: str = "info"  # "info", "warning", "success", "error"
    message: str


class RebalanceShift(BaseModel):
    task_id: str
    task_title: str
    hours: float
    from_member_id: str
    from_member_name: str
    to_member_id: str
    to_member_name: str
    reason: str
    confidence_score: float = 1.0


class MemberComparison(BaseModel):
    member_id: str
    member_name: str
    title: str | None = None
    before_hours: float
    proposed_hours: float
    capacity_hours: float
    before_status: str
    proposed_status: str
    before_utilization: float
    proposed_utilization: float


class ExpectedImpact(BaseModel):
    overload_reduction_percent: float
    burnout_risk_reduction_percent: float
    velocity_gain_multiplier: float
    predicted_cycle_time_savings_days: float
    balanced_ratio: str


class RebalancePlan(BaseModel):
    id: str
    team_id: str
    team_name: str
    generated_at: str
    summary: str
    shifts: list[RebalanceShift] = Field(default_factory=list)
    member_comparisons: list[MemberComparison] = Field(default_factory=list)
    expected_impact: ExpectedImpact
    status: str = "pending_approval"
    agent_log_steps: list[AgentLogStep] = Field(default_factory=list)


class BottleneckReport(BaseModel):
    id: str
    member_id: str
    member_name: str
    title: str | None = None
    avatar: str | None = None
    allocated_hours: float
    weekly_capacity: float
    overtime_hours: float
    severity: str = "warning"  # "info", "warning", "critical"
    metric_impact: str
    suggested_action: str
