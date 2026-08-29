"""
Database initialization script.

Creates all tables defined by the ORM models. Does not insert
any data — users, teams, and tasks are created through the API.

Usage:
    cd backend
    python -m app.seed
"""

import asyncio

from app.database import engine, Base

# Import all models so Base.metadata is fully populated
from app.models import Team, Profile, Task, OvertimeRequest  # noqa: F401


async def init_db() -> None:
    """Create all tables if they don't already exist."""

    print("Initializing database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Done. All tables are ready.")


if __name__ == "__main__":
    asyncio.run(init_db())
