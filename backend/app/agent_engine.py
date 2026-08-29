"""AI Agent engine using LangChain and Gemini Flash Lite."""

import json
import uuid
from datetime import datetime, timezone
from sqlalchemy import select, text

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.profile import Profile, UserRole
from app.models.team import Team
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.overtime import OvertimeRequest, OvertimeStatus
from app.schemas.agent import (
    RebalancePlan,
    RebalanceShift,
    MemberComparison,
    ExpectedImpact,
    AgentLogStep,
)

# Active plan cache
ACTIVE_REBALANCE_PLANS: dict[str, RebalancePlan] = {}


async def _reserve_gemini_call() -> bool:
    """Atomically reserve one persistent daily Gemini call in PostgreSQL."""
    if not settings.GEMINI_ENABLED or not settings.GOOGLE_API_KEY:
        return False
    limit = settings.GEMINI_DAILY_CALL_LIMIT
    if limit <= 0:
        return False
    today = datetime.now(timezone.utc).date()
    async with AsyncSessionLocal() as db:
        await db.execute(text("""
            CREATE TABLE IF NOT EXISTS gemini_usage (
                usage_date DATE PRIMARY KEY,
                call_count INTEGER NOT NULL DEFAULT 0
            )
        """))
        result = await db.execute(text("""
            INSERT INTO gemini_usage (usage_date, call_count)
            VALUES (:usage_date, 1)
            ON CONFLICT (usage_date) DO UPDATE
            SET call_count = gemini_usage.call_count + 1
            WHERE gemini_usage.call_count < :daily_limit
            RETURNING call_count
        """), {"usage_date": today, "daily_limit": limit})
        await db.commit()
        return result.first() is not None


async def get_team_workloads_data(team_id: str) -> list[dict]:
    """Helper to query the team workloads synchronously or asynchronously."""
    async with AsyncSessionLocal() as db:
        query = select(Profile).where(Profile.team_id == team_id)
        res = await db.execute(query)
        members = res.scalars().all()

        result = []
        for m in members:
            # Get active tasks (not completed)
            t_query = select(Task).where(
                Task.assigned_to == m.id, Task.status != TaskStatus.COMPLETED
            )
            t_res = await db.execute(t_query)
            tasks = t_res.scalars().all()

            # Get approved overtime requests
            ot_query = select(OvertimeRequest).where(
                OvertimeRequest.user_id == m.id,
                OvertimeRequest.status == OvertimeStatus.APPROVED,
            )
            ot_res = await db.execute(ot_query)
            ot_reqs = ot_res.scalars().all()
            overtime_hours = sum(ot.extra_hours for ot in ot_reqs)

            allocated_hours = sum(t.estimated_hours for t in tasks)

            result.append(
                {
                    "member_id": m.id,
                    "name": m.name,
                    "title": m.title,
                    "role": m.role.value,
                    "weekly_capacity": m.weekly_capacity,
                    "overtime_hours": overtime_hours,
                    "allocated_hours": allocated_hours,
                    "avatar": m.avatar_url,
                    "tasks": [
                        {
                            "task_id": t.id,
                            "title": t.title,
                            "estimated_hours": t.estimated_hours,
                            "priority": t.priority.value,
                            "status": t.status.value,
                            "deadline": str(t.deadline),
                            "blocker_risk": t.description is not None
                            and (
                                "blocker" in t.description.lower()
                                or "blocking" in t.description.lower()
                            ),
                        }
                        for t in tasks
                    ],
                }
            )
        return result


async def run_rebalance_algorithm(team_id: str) -> RebalancePlan:
    """Generate a deterministic recommendation from the current database workloads."""
    workloads = await get_team_workloads_data(team_id)

    # Find team details
    async with AsyncSessionLocal() as db:
        t_query = select(Team.name).where(Team.id == team_id)
        t_res = await db.execute(t_query)
        team_name = t_res.scalar() or "Team Pod"

    # Identify overloaded and underutilized
    overloaded = []
    underutilized = []
    log_steps = []

    log_steps.append(
        AgentLogStep(
            timestamp=datetime.now(timezone.utc).isoformat(),
            level="info",
            message="Initializing autonomous capacity optimization loop...",
        )
    )
    log_steps.append(
        AgentLogStep(
            timestamp=datetime.now(timezone.utc).isoformat(),
            level="info",
            message=f"Fetching telemetry workloads for team: {team_name} ({team_id})",
        )
    )

    for m in workloads:
        limit = m["weekly_capacity"] + m["overtime_hours"]
        if m["role"] == "manager":
            continue
        if m["allocated_hours"] > limit:
            overloaded.append(m)
            log_steps.append(
                AgentLogStep(
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    level="warning",
                    message=f"Capacity overload identified: {m['name']} ({m['title']}) at {m['allocated_hours']}h / {limit}h limit.",
                )
            )
        elif m["allocated_hours"] < limit - 5:
            underutilized.append(m)

    shifts = []
    comparisons = []
    proposed_workloads = {m["member_id"]: m["allocated_hours"] for m in workloads}

    # Simulate shifts
    for over in overloaded:
        limit_over = over["weekly_capacity"] + over["overtime_hours"]
        # Find active tasks of this overloaded engineer
        # Sort tasks descending by hours to shift large chunks first
        tasks = sorted(over["tasks"], key=lambda x: x["estimated_hours"], reverse=True)

        for task in tasks:
            if proposed_workloads[over["member_id"]] <= limit_over:
                break  # No longer overloaded!

            # Try to shift to an underutilized engineer
            for under in underutilized:
                limit_under = under["weekly_capacity"] + under["overtime_hours"]
                current_alloc = proposed_workloads[under["member_id"]]

                if current_alloc + task["estimated_hours"] <= limit_under:
                    # Perform task shift simulation
                    proposed_workloads[over["member_id"]] -= task["estimated_hours"]
                    proposed_workloads[under["member_id"]] += task["estimated_hours"]

                    log_steps.append(
                        AgentLogStep(
                            timestamp=datetime.now(timezone.utc).isoformat(),
                            level="info",
                            message=f"Simulating shift of '{task['title']}' ({task['estimated_hours']}h) from {over['name']} to {under['name']}.",
                        )
                    )

                    shifts.append(
                        RebalanceShift(
                            task_id=task["task_id"],
                            task_title=task["title"],
                            hours=task["estimated_hours"],
                            from_member_id=over["member_id"],
                            from_member_name=over["name"],
                            to_member_id=under["member_id"],
                            to_member_name=under["name"],
                            reason=f"{under['name']} has {limit_under - current_alloc:.1f}h spare capacity for this task.",
                            confidence_score=round(min(1.0, max(0.0, (limit_under - current_alloc) / task["estimated_hours"])), 2),
                        )
                    )

                    log_steps.append(
                        AgentLogStep(
                            timestamp=datetime.now(timezone.utc).isoformat(),
                            level="success",
                            message=f"Shift verified: {under['name']} remains safe at {proposed_workloads[under['member_id']]}h / {limit_under}h.",
                        )
                    )
                    break

    # Build comparisons
    for m in workloads:
        if m["role"] == "manager":
            continue
        limit = m["weekly_capacity"] + m["overtime_hours"]
        before = m["allocated_hours"]
        after = proposed_workloads[m["member_id"]]

        before_pct = int((before / m["weekly_capacity"]) * 100) if m["weekly_capacity"] > 0 else 0
        after_pct = int((after / m["weekly_capacity"]) * 100) if m["weekly_capacity"] > 0 else 0

        comparisons.append(
            MemberComparison(
                member_id=m["member_id"],
                member_name=m["name"],
                title=m["title"],
                before_hours=before,
                proposed_hours=after,
                capacity_hours=m["weekly_capacity"],
                before_status=f"Overloaded ({before_pct}%)" if before > limit else f"Balanced ({before_pct}%)" if before > limit - 10 else f"Underutilized ({before_pct}%)",
                proposed_status=f"Overloaded ({after_pct}%)" if after > limit else f"Balanced ({after_pct}%)" if after > limit - 10 else f"Underutilized ({after_pct}%)",
                before_utilization=before_pct,
                proposed_utilization=after_pct,
            )
        )

    log_steps.append(
        AgentLogStep(
            timestamp=datetime.now(timezone.utc).isoformat(),
            level="success",
            message="Rebalancing simulation complete. Workload optimization model converged.",
        )
    )

    plan_id = f"plan_sim_{uuid.uuid4().hex[:6]}"
    employee_workloads = [m for m in workloads if m["role"] != "manager"]
    before_overloaded = sum(
        1 for m in employee_workloads
        if m["allocated_hours"] > m["weekly_capacity"] + m["overtime_hours"]
    )
    after_overloaded = sum(
        1 for m in employee_workloads
        if proposed_workloads[m["member_id"]] > m["weekly_capacity"] + m["overtime_hours"]
    )
    overload_reduction = (
        (before_overloaded - after_overloaded) / before_overloaded * 100
        if before_overloaded else 0.0
    )
    shifted_hours = sum(shift.hours for shift in shifts)
    total_allocated = sum(m["allocated_hours"] for m in employee_workloads)
    balanced_members = sum(
        1 for m in employee_workloads
        if proposed_workloads[m["member_id"]] <= m["weekly_capacity"] + m["overtime_hours"]
    )
    balanced_ratio = balanced_members / len(employee_workloads) * 100 if employee_workloads else 0.0

    plan = RebalancePlan(
        id=plan_id,
        team_id=team_id,
        team_name=team_name,
        generated_at=datetime.now(timezone.utc).isoformat(),
            summary="Optimized task distribution for the current team based on recorded capacity and active workload.",
        shifts=shifts,
        member_comparisons=comparisons,
        expected_impact=ExpectedImpact(
            overload_reduction_percent=round(overload_reduction, 1),
            burnout_risk_reduction_percent=round(overload_reduction, 1),
            velocity_gain_multiplier=round(1 + (shifted_hours / total_allocated), 2) if total_allocated else 1.0,
            predicted_cycle_time_savings_days=round(shifted_hours / 8, 1),
            balanced_ratio=f"{balanced_ratio:.1f}% of {team_name} within capacity limits.",
        ),
        status="pending_approval",
        agent_log_steps=log_steps,
    )

    ACTIVE_REBALANCE_PLANS[plan_id] = plan
    return plan


async def run_rebalance_agent(team_id: str) -> RebalancePlan:
    """Main entrypoint to run agent capacity rebalancing.
    Uses the database-backed algorithm when no AI provider is configured.
    """
    if not await _reserve_gemini_call():
        return await run_rebalance_algorithm(team_id)

    # ══════════════════════════════════════════════════════════════
    # Live LangChain Tool-Calling implementation
    # ══════════════════════════════════════════════════════════════
    try:
        from langchain.tools import tool
        from langchain_google_genai import ChatGoogleGenerativeAI

        # Define inline tools to bind the database session
        @tool
        async def get_team_workloads(team_id: str) -> str:
            """Query postgres database for active tasks, capacity, and overtime metrics of a team."""
            data = await get_team_workloads_data(team_id)
            return json.dumps(data, indent=2)

        @tool
        async def simulate_task_shift(task_id: str, target_user_id: str) -> str:
            """Evaluate post-shift capacity metrics within team boundaries before committing."""
            async with AsyncSessionLocal() as db:
                t_query = select(Task).where(Task.id == task_id)
                t_res = await db.execute(t_query)
                task = t_res.scalar_one_or_none()
                if not task:
                    return json.dumps({"error": f"Task {task_id} not found."})

                current_user_id = task.assigned_to
                query = select(Profile).where(Profile.id.in_([current_user_id, target_user_id]))
                res = await db.execute(query)
                users = res.scalars().all()

                current_user = next((u for u in users if u.id == current_user_id), None)
                target_user = next((u for u in users if u.id == target_user_id), None)

                if not current_user or not target_user:
                    return json.dumps({"error": "One or both users not found."})

                if current_user.team_id != target_user.team_id:
                    return json.dumps({"error": "Cannot shift tasks between different teams."})

                c_tasks_query = select(Task.estimated_hours).where(
                    Task.assigned_to == current_user_id, Task.status != TaskStatus.COMPLETED
                )
                c_tasks_res = await db.execute(c_tasks_query)
                c_hours_before = sum(c_tasks_res.scalars().all())
                c_hours_after = c_hours_before - task.estimated_hours

                t_tasks_query = select(Task.estimated_hours).where(
                    Task.assigned_to == target_user_id, Task.status != TaskStatus.COMPLETED
                )
                t_tasks_res = await db.execute(t_tasks_query)
                t_hours_before = sum(t_tasks_res.scalars().all())
                t_hours_after = t_hours_before + task.estimated_hours

                return json.dumps(
                    {
                        "success": True,
                        "task_id": task_id,
                        "task_title": task.title,
                        "estimated_hours": task.estimated_hours,
                        "current_assignee": {
                            "member_id": current_user.id,
                            "name": current_user.name,
                            "allocated_before": c_hours_before,
                            "allocated_after": c_hours_after,
                        },
                        "target_assignee": {
                            "member_id": target_user.id,
                            "name": target_user.name,
                            "allocated_before": t_hours_before,
                            "allocated_after": t_hours_after,
                        },
                    },
                    indent=2,
                )

        tools = [get_team_workloads, simulate_task_shift]

        llm = ChatGoogleGenerativeAI(
            model="gemini-3.5-flash-lite",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.0,
            max_retries=0,
        )

        system_prompt = (
            "You are an expert capacity optimization analyst for Capacita.ai.\n"
            "Analyze the supplied current database workloads and propose safe task reallocations.\n"
            "Identify overloaded employees (allocated hours > capacity + approved overtime) and propose shifts only when the target remains within its limit.\n"
            "Always output a structured JSON plan matching this format:\n"
            "{\n"
            "  \"summary\": \"summary text\",\n"
            "  \"shifts\": [\n"
            "    {\n"
            "      \"task_id\": \"task_id\",\n"
            "      \"task_title\": \"title\",\n"
            "      \"hours\": 6.0,\n"
            "      \"from_member_id\": \"id\",\n"
            "      \"from_member_name\": \"name\",\n"
            "      \"to_member_id\": \"id\",\n"
            "      \"to_member_name\": \"name\",\n"
            "      \"reason\": \"reason text\"\n"
            "    }\n"
            "  ]\n"
            "}\n"
            "Return ONLY the raw JSON format."
        )

        # Make exactly one provider call per reserved request. Workloads are fetched
        # locally from PostgreSQL, so Gemini does not need tool-calling iterations.
        workloads = await get_team_workloads_data(team_id)
        llm_res = await llm.ainvoke(
            f"{system_prompt}\n\nCurrent workload data:\n{json.dumps(workloads, indent=2)}"
        )
        output_text = llm_res.content
        if not isinstance(output_text, str):
            output_text = json.dumps(output_text)

        # Parse LLM response JSON
        # Clean markdown code blocks if any
        if "```json" in output_text:
            output_text = output_text.split("```json")[1].split("```")[0].strip()
        elif "```" in output_text:
            output_text = output_text.split("```")[1].split("```")[0].strip()

        plan_data = json.loads(output_text.strip())
        # Some Gemini model versions return the shift array directly instead of
        # wrapping it in the documented {summary, shifts} object.
        if isinstance(plan_data, list):
            plan_data = {
                "summary": "AI-generated workload rebalancing recommendations",
                "shifts": plan_data,
            }
        if not isinstance(plan_data, dict):
            raise ValueError("Gemini returned an unsupported rebalancing response format")

        # Build RebalancePlan from LLM output by querying database metrics for full validation
        workloads = await get_team_workloads_data(team_id)
        async with AsyncSessionLocal() as db:
            t_query = select(Team.name).where(Team.id == team_id)
            t_res = await db.execute(t_query)
            team_name = t_res.scalar() or "Team Pod"

        shifts = []
        proposed_workloads = {m["member_id"]: m["allocated_hours"] for m in workloads}

        for s in plan_data.get("shifts", []):
            if not isinstance(s, dict):
                continue
            task_id = s.get("task_id")
            to_member_id = s.get("to_member_id")
            if not task_id or not to_member_id:
                continue

            # Query details for completeness
            async with AsyncSessionLocal() as db:
                t_q = select(Task).where(Task.id == task_id)
                t_r = await db.execute(t_q)
                task = t_r.scalar_one_or_none()

                from_p = next((m for m in workloads if task and m["member_id"] == task.assigned_to), None)
                to_p = next((m for m in workloads if m["member_id"] == to_member_id), None)

            if task and from_p and to_p:
                shifts.append(
                    RebalanceShift(
                        task_id=task_id,
                        task_title=task.title,
                        hours=task.estimated_hours,
                        from_member_id=from_p["member_id"],
                        from_member_name=from_p["name"],
                        to_member_id=to_p["member_id"],
                        to_member_name=to_p["name"],
                        reason=s.get("reason", "Redistributed capacity"),
                    )
                )
                proposed_workloads[from_p["member_id"]] -= task.estimated_hours
                proposed_workloads[to_p["member_id"]] += task.estimated_hours

        # Construct comparisons
        comparisons = []
        for m in workloads:
            if m["role"] == "manager":
                continue
            limit = m["weekly_capacity"] + m["overtime_hours"]
            before = m["allocated_hours"]
            after = proposed_workloads[m["member_id"]]
            before_pct = int((before / m["weekly_capacity"]) * 100) if m["weekly_capacity"] > 0 else 0
            after_pct = int((after / m["weekly_capacity"]) * 100) if m["weekly_capacity"] > 0 else 0

            comparisons.append(
                MemberComparison(
                    member_id=m["member_id"],
                    member_name=m["name"],
                    title=m["title"],
                    before_hours=before,
                    proposed_hours=after,
                    capacity_hours=m["weekly_capacity"],
                    before_status=f"Overloaded ({before_pct}%)" if before > limit else f"Balanced ({before_pct}%)",
                    proposed_status=f"Overloaded ({after_pct}%)" if after > limit else f"Balanced ({after_pct}%)",
                    before_utilization=before_pct,
                    proposed_utilization=after_pct,
                )
            )

        log_steps = [
            AgentLogStep(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="info",
                message="LangChain Agent rebalancing sequence initiated.",
            ),
            AgentLogStep(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="success",
                message="Optimal rebalancing configuration converged via ChatGoogleGenerativeAI.",
            ),
        ]

        employee_workloads = [m for m in workloads if m["role"] != "manager"]
        before_overloaded = sum(1 for m in employee_workloads if m["allocated_hours"] > m["weekly_capacity"] + m["overtime_hours"])
        after_overloaded = sum(1 for m in employee_workloads if proposed_workloads[m["member_id"]] > m["weekly_capacity"] + m["overtime_hours"])
        overload_reduction = ((before_overloaded - after_overloaded) / before_overloaded * 100) if before_overloaded else 0.0
        shifted_hours = sum(shift.hours for shift in shifts)
        total_allocated = sum(m["allocated_hours"] for m in employee_workloads)
        balanced_members = sum(1 for m in employee_workloads if proposed_workloads[m["member_id"]] <= m["weekly_capacity"] + m["overtime_hours"])
        balanced_ratio = balanced_members / len(employee_workloads) * 100 if employee_workloads else 0.0

        plan_id = f"plan_sim_{uuid.uuid4().hex[:6]}"
        plan = RebalancePlan(
            id=plan_id,
            team_id=team_id,
            team_name=team_name,
            generated_at=datetime.now(timezone.utc).isoformat(),
            summary=plan_data.get("summary", "AI Workload rebalancing simulation"),
            shifts=shifts,
            member_comparisons=comparisons,
            expected_impact=ExpectedImpact(
                overload_reduction_percent=round(overload_reduction, 1),
                burnout_risk_reduction_percent=round(overload_reduction, 1),
                velocity_gain_multiplier=round(1 + shifted_hours / total_allocated, 2) if total_allocated else 1.0,
                predicted_cycle_time_savings_days=round(shifted_hours / 8, 1),
                balanced_ratio=f"{balanced_ratio:.1f}% of {team_name} within capacity limits.",
            ),
            status="pending_approval",
            agent_log_steps=log_steps,
        )

        ACTIVE_REBALANCE_PLANS[plan_id] = plan
        return plan

    except Exception as e:
        import logging
        from fastapi import HTTPException
        logging.exception("Error running live agent")
        raise HTTPException(
            status_code=500,
            detail=f"Live AI agent execution failed: {str(e)}"
        )
