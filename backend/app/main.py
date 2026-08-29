"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

settings.validate_startup()

app = FastAPI(
    title="Capacita.ai",
    docs_url="/docs" if settings.APP_DEBUG else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.APP_DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
