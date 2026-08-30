"""
Deterministic seeder for Capacita.ai.

Recreates all tables and populates the database with core demo data:
- Teams: Alpha Engineering, Beta Data Science, Gamma Infrastructure
- Profiles: Sarah Jenkins (Manager), Alex Rivera, Marcus Vance, Elena Rostova, Devyn Chen
- Tasks: task_01 to task_12 with realistic hours, deadlines, priorities
- Overtime: Marcus Vance (pending), Devyn Chen (approved by Sarah Jenkins)

All entities use the same UUIDs as the React UI components for seamless integration.
"""

import asyncio
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import select
from app.auth import get_password_hash
from app.database import engine, AsyncSessionLocal, Base
from app.models import (
    Team,
    Profile,
    UserRole,
    Task,
    TaskPriority,
    TaskStatus,
    OvertimeRequest,
    OvertimeStatus,
)

# ══════════════════════════════════════════════════════════════
# Standard UUID Mapping (Derived from UI mocks)
# ══════════════════════════════════════════════════════════════

# Teams
TEAM_ALPHA_ID = "team_alpha_01"
TEAM_BETA_ID  = "team_beta_01"
TEAM_GAMMA_ID = "team_gamma_01"

# Profiles
MGR_SARAH_ID  = "usr_sarah_01"
EMP_ALEX_ID   = "usr_alex_01"
EMP_MARCUS_ID = "usr_marcus_02"
EMP_ELENA_ID  = "usr_elena_03"
EMP_DEVYN_ID  = "usr_devyn_04"

# Tasks (12 items)
TASK_IDS = [f"task_{i:02d}" for i in range(1, 13)]

# Overtime
OT_REQ_1_ID = "ot_req_01"
OT_REQ_2_ID = "ot_req_02"

NOW = datetime.now(timezone.utc)


def _teams() -> list[Team]:
    return [
        Team(
            id=TEAM_ALPHA_ID,
            name="Alpha Engineering",
            department="Core Platform Architecture",
            description="Responsible for real-time data streaming pipelines, consensus layer, and edge routing.",
            primary_focus="Core Platform Architecture"
        ),
        Team(
            id=TEAM_BETA_ID,
            name="Beta Data Science",
            department="Predictive Modeling",
            description="Neural workload inference models, burnout early detection telemetry, and algorithmic scheduling.",
            primary_focus="Predictive Modeling"
        ),
        Team(
            id=TEAM_GAMMA_ID,
            name="Gamma Infrastructure",
            department="Cloud Reliability & SRE",
            description="Multi-region Kubernetes mesh, zero-trust telemetry ingestion, and latency SLA enforcement.",
            primary_focus="Global Resiliency"
        ),
    ]


def _profiles() -> list[Profile]:
    pwd = get_password_hash("password123")
    return [
        # Manager
        Profile(
            id=MGR_SARAH_ID,
            name="Sarah Jenkins",
            email="sarah.jenkins@capacita.ai",
            hashed_password=pwd,
            role=UserRole.MANAGER,
            team_id=TEAM_ALPHA_ID,
            weekly_capacity=40.0,
            title="Director of Engineering Operations",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        ),
        # Employees
        Profile(
            id=EMP_ALEX_ID,
            name="Alex Rivera",
            email="alex.rivera@capacita.ai",
            hashed_password=pwd,
            role=UserRole.EMPLOYEE,
            team_id=TEAM_ALPHA_ID,
            weekly_capacity=40.0,
            title="Lead Platform Architect",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        ),
        Profile(
            id=EMP_MARCUS_ID,
            name="Marcus Vance",
            email="marcus.vance@capacita.ai",
            hashed_password=pwd,
            role=UserRole.EMPLOYEE,
            team_id=TEAM_ALPHA_ID,
            weekly_capacity=40.0,
            title="Principal Platform Engineer",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        ),
        Profile(
            id=EMP_ELENA_ID,
            name="Elena Rostova",
            email="elena.rostova@capacita.ai",
            hashed_password=pwd,
            role=UserRole.EMPLOYEE,
            team_id=TEAM_ALPHA_ID,
            weekly_capacity=40.0,
            title="Staff Backend Engineer",
            avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
        ),
        Profile(
            id=EMP_DEVYN_ID,
            name="Devyn Chen",
            email="devyn.chen@capacita.ai",
            hashed_password=pwd,
            role=UserRole.EMPLOYEE,
            team_id=TEAM_ALPHA_ID,
            weekly_capacity=40.0,
            title="Senior Full Stack Engineer",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
        ),
    ]


def _tasks() -> list[Task]:
    tasks = [
        # Alex Rivera Tasks
        Task(
            id=TASK_IDS[0], # task_01
            title="Review Q3 Architecture Blueprint",
            description="Perform formal technical review of event-driven gateway RFC and micro-pod partitions.",
            estimated_hours=6.0,
            completed_hours=0.0,
            deadline=date(2026, 9, 2),
            priority=TaskPriority.HIGH,
            status=TaskStatus.TODO,
            assigned_to=EMP_ALEX_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="ARCH-102",
            tags=["Architecture", "RFC", "Security"]
        ),
        Task(
            id=TASK_IDS[1], # task_02
            title="Optimize Latency Protocols for Node Alpha",
            description="Tune TCP keepalive and memory buffers for edge proxy nodes in US-East cluster.",
            estimated_hours=8.0,
            completed_hours=4.0,
            deadline=date(2026, 9, 4),
            priority=TaskPriority.CRITICAL,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_ALEX_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="PERF-88",
            tags=["Networking", "Latency", "C++"]
        ),
        Task(
            id=TASK_IDS[2], # task_03
            title="Deploy Security Patch 4.1",
            description="Hotfix zero-day vulnerability in OpenSSL dependency across ingress proxies.",
            estimated_hours=4.0,
            completed_hours=4.0,
            deadline=date(2026, 8, 28),
            priority=TaskPriority.CRITICAL,
            status=TaskStatus.COMPLETED,
            assigned_to=EMP_ALEX_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="SEC-401",
            tags=["Security", "Patch", "Deploy"]
        ),
        # Marcus Vance Tasks
        Task(
            id=TASK_IDS[3], # task_04
            title="Migrate Redis Cluster to v7.2 and Partition Keys",
            description="Lead zero-downtime cluster re-sharding across 16 shards to eliminate memory skew.",
            estimated_hours=14.0,
            completed_hours=4.0,
            deadline=date(2026, 9, 3),
            priority=TaskPriority.CRITICAL,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_MARCUS_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="DATA-210",
            tags=["Redis", "Migration", "Database"]
        ),
        Task(
            id=TASK_IDS[4], # task_05
            title="PR Review Batch: Auth v2 RFC & Token Service",
            description="Review 18 pending pull requests accumulating in Alpha Pod sprint backlog.",
            estimated_hours=8.0,
            completed_hours=0.0,
            deadline=date(2026, 9, 2),
            priority=TaskPriority.HIGH,
            status=TaskStatus.TODO,
            assigned_to=EMP_MARCUS_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="CODE-441",
            tags=["PR Review", "Auth", "Sprint Blocker"]
        ),
        Task(
            id=TASK_IDS[5], # task_06
            title="Kafka Consumer Group Rebalance Bugfix",
            description="Investigate periodic partition deadlocks causing 34% drop in PR & ingestion throughput.",
            estimated_hours=12.0,
            completed_hours=8.0,
            deadline=date(2026, 9, 5),
            priority=TaskPriority.HIGH,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_MARCUS_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="STREAM-109",
            tags=["Kafka", "Go", "Throughput"]
        ),
        Task(
            id=TASK_IDS[6], # task_07
            title="gRPC Interceptor Benchmark Suite",
            description="Construct automated load-testing harnesses for streaming RPC endpoints.",
            estimated_hours=8.0,
            completed_hours=2.0,
            deadline=date(2026, 9, 8),
            priority=TaskPriority.MEDIUM,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_MARCUS_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="BENCH-32",
            tags=["gRPC", "Testing"]
        ),
        Task(
            id=TASK_IDS[7], # task_08
            title="On-Call Incident Escalation & Post-Mortem",
            description="Emergency rotation support and mitigation documentation for weekend outage.",
            estimated_hours=6.0,
            completed_hours=6.0,
            deadline=date(2026, 8, 29),
            priority=TaskPriority.HIGH,
            status=TaskStatus.COMPLETED,
            assigned_to=EMP_MARCUS_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="INC-889",
            tags=["Ops", "Incident"]
        ),
        # Elena Rostova Tasks
        Task(
            id=TASK_IDS[8], # task_09
            title="Database Index Maintenance Script",
            description="Automate weekly VACUUM and index bloat detection on reporting replica.",
            estimated_hours=10.0,
            completed_hours=8.0,
            deadline=date(2026, 9, 4),
            priority=TaskPriority.LOW,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_ELENA_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="DB-77",
            tags=["PostgreSQL", "Maintenance"]
        ),
        Task(
            id=TASK_IDS[9], # task_10
            title="FastAPI Telemetry Endpoints Refactor",
            description="Standardize Pydantic schemas and response headers for operational metrics API.",
            estimated_hours=16.0,
            completed_hours=12.0,
            deadline=date(2026, 9, 7),
            priority=TaskPriority.MEDIUM,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_ELENA_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="API-119",
            tags=["FastAPI", "Telemetry"]
        ),
        # Devyn Chen Tasks
        Task(
            id=TASK_IDS[10], # task_11
            title="Implement Operational Analytics Widgets",
            description="Build real-time capacity meters and bottleneck notification alerts.",
            estimated_hours=14.0,
            completed_hours=10.0,
            deadline=date(2026, 9, 3),
            priority=TaskPriority.HIGH,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_DEVYN_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="UI-55",
            tags=["React", "Charts", "Tailwind"]
        ),
        Task(
            id=TASK_IDS[11], # task_12
            title="Accessibility & WCAG AA Audit",
            description="Verify color contrast, focus outlines, and keyboard navigation across all portals.",
            estimated_hours=8.0,
            completed_hours=2.0,
            deadline=date(2026, 9, 6),
            priority=TaskPriority.MEDIUM,
            status=TaskStatus.IN_PROGRESS,
            assigned_to=EMP_DEVYN_ID,
            team_id=TEAM_ALPHA_ID,
            project_key="A11Y-09",
            tags=["A11y", "Audit"]
        ),
    ]
    return tasks


def _overtime_requests() -> list[OvertimeRequest]:
    return [
        # Marcus Vance — pending request (8 hours)
        OvertimeRequest(
            id=OT_REQ_1_ID,
            user_id=EMP_MARCUS_ID,
            team_id=TEAM_ALPHA_ID,
            extra_hours=8.0,
            reason="Emergency Redis cluster migration and clearing the 18 PR review bottleneck blocking Sprint 4.",
            project_name="Core Platform v4 Sprint",
            date=date(2026, 8, 30),
            status=OvertimeStatus.PENDING,
            reviewed_by=None,
            manager_notes=None,
            created_at=NOW,
            updated_at=NOW
        ),
        # Devyn Chen — approved request (4 hours)
        OvertimeRequest(
            id=OT_REQ_2_ID,
            user_id=EMP_DEVYN_ID,
            team_id=TEAM_ALPHA_ID,
            extra_hours=4.0,
            reason="Finalizing live telemetry charts and edge layout optimizations ahead of client showcase.",
            project_name="Executive Portal Launch",
            date=date(2026, 8, 29),
            status=OvertimeStatus.APPROVED,
            reviewed_by=MGR_SARAH_ID,
            manager_notes="Approved for client demo readiness.",
            created_at=NOW,
            updated_at=NOW
        )
    ]


async def init_db() -> None:
    """Drop and recreate schema, then insert demo seed data."""
    print("Resetting database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables initialized.")

    async with AsyncSessionLocal() as session:
        async with session.begin():
            # Teams
            teams = _teams()
            session.add_all(teams)
            await session.flush()
            print(f"Created {len(teams)} teams.")

            # Profiles
            profiles = _profiles()
            session.add_all(profiles)
            await session.flush()
            print(f"Created {len(profiles)} profiles.")

            # Tasks
            tasks = _tasks()
            session.add_all(tasks)
            await session.flush()
            print(f"Created {len(tasks)} tasks.")

            # Overtime Requests
            overtimes = _overtime_requests()
            session.add_all(overtimes)
            await session.flush()
            print(f"Created {len(overtimes)} overtime requests.")

    print("\nDatabase seeded successfully!")
    print("Manager:  sarah.jenkins@capacita.ai / password123")
    print("Employee: alex.rivera@capacita.ai / password123")
    print("───────────────────────────────────────────────")


if __name__ == "__main__":
    asyncio.run(init_db())
