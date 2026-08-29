"""AI Agent router implementing workload bottleneck checks and rebalancing."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth import get_current_user
from app.database import get_db
from app.models.profile import Profile, UserRole
from app.models.task import Task
from app.schemas.agent import (
    BottleneckReport,
    RebalancePlan,
    RebalanceShift,
)
from app.agent_engine import (
    run_rebalance_agent,
    get_team_workloads_data,
    ACTIVE_REBALANCE_PLANS,
)

router = APIRouter(prefix="/agent", tags=["agent"])





@router.get("/bottlenecks", response_model=list[BottleneckReport])
async def get_bottlenecks(
    team_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Scan team capacity telemetry and report workload bottleneck alerts."""
    workloads = await get_team_workloads_data(team_id)
    bottlenecks = []

    for m in workloads:
        limit = m["weekly_capacity"] + m["overtime_hours"]
        if m["role"] == "manager":
            continue

        if m["allocated_hours"] > limit:
            severity = "critical" if m["allocated_hours"] > limit + 5 else "warning"
            over_hours = m["allocated_hours"] - limit
            bottlenecks.append(
                BottleneckReport(
                    id=f"bn_{m['member_id']}_{uuid_str()}",
                    member_id=m["member_id"],
                    member_name=m["name"],
                    title=m["title"],
                    avatar=m["avatar"],
                    allocated_hours=m["allocated_hours"],
                    weekly_capacity=m["weekly_capacity"],
                    overtime_hours=m["overtime_hours"],
                    severity=severity,
                    metric_impact=f"Overloaded by {over_hours:.1f} hours above capacity limits.",
                    suggested_action=f"Execute AI Workload Rebalancing to redistribute active tasks.",
                )
            )
    return bottlenecks


@router.post("/rebalance", response_model=RebalancePlan)
async def run_rebalance_simulation(
    payload: dict,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Invoke AI agent to generate team rebalancing optimization model."""
    team_id = payload.get("team_id")
    if not team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="team_id is required.",
        )
    plan = await run_rebalance_agent(team_id)
    return plan


@router.post("/plans/{plan_id}/approve")
async def approve_plan(
    plan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Deploy proposed rebalancing shifts to active database records."""
    plan = ACTIVE_REBALANCE_PLANS.get(plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found or expired.",
        )

    # Shift each task assignment
    shifts_applied = 0
    for shift in plan.shifts:
        query = select(Task).where(Task.id == shift.task_id)
        res = await db.execute(query)
        task = res.scalar_one_or_none()
        if task:
            task.assigned_to = shift.to_member_id
            shifts_applied += 1

    await db.commit()
    plan.status = "approved"

    # Remove from cache
    ACTIVE_REBALANCE_PLANS.pop(plan_id, None)

    return {
        "success": True,
        "message": f"Plan successfully deployed. {shifts_applied} task reassignments committed to database.",
    }


@router.post("/plans/{plan_id}/reject")
async def reject_plan(
    plan_id: str,
    payload: dict | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Discard simulated workload rebalancing plan configuration."""
    ACTIVE_REBALANCE_PLANS.pop(plan_id, None)
    return {"success": True, "message": "Rebalancing plan successfully rejected."}


def uuid_str() -> str:
    import uuid

    return uuid.uuid4().hex[:6]
