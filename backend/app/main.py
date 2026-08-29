"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
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


@app.get("/health")
async def health_check():
    return {"status": "ok"}
