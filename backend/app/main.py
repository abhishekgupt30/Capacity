"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import AsyncSessionLocal
from app.routers import auth, teams, tasks, overtime, agent

settings.validate_startup()

app = FastAPI(
    title="Capacita.ai",
    docs_url="/docs" if settings.APP_DEBUG else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.APP_DEBUG else None,
)

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(teams.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(overtime.router, prefix="/api")
app.include_router(agent.router, prefix="/api")


@app.on_event("startup")
async def migrate_task_completion_timestamp() -> None:
    """Add completion timestamps to databases created before this feature."""
    async with AsyncSessionLocal() as db:
        await db.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ"))
        await db.execute(text(
            "UPDATE tasks SET completed_at = created_at "
            "WHERE status = 'COMPLETED' AND completed_at IS NULL"
        ))
        await db.commit()


@app.get("/health")
async def health_check():
    return {"status": "ok"}
