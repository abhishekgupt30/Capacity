"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Security ──────────────────────────────────────────────
    SECRET_KEY: str = "CHANGE_ME_BEFORE_RUNNING"
    CORS_ORIGINS: str = "http://localhost:5173"

    # ── Database ──────────────────────────────────────────────
    DATABASE_URL: str = (
        "postgresql+asyncpg://capacita:capacita_dev_2024@localhost:5432/capacita_db"
    )

    # ── Google Gemini (server-side only) ──────────────────────
    GOOGLE_API_KEY: str = ""
    GEMINI_ENABLED: bool = False
    # Zero means unlimited; positive values enable a persistent daily cap.
    GEMINI_DAILY_CALL_LIMIT: int = 0

    # ── App ───────────────────────────────────────────────────
    APP_ENV: str = "development"
    APP_DEBUG: bool = False

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def sync_database_url(self) -> str:
        """Synchronous database URL for tools like Alembic."""
        return self.DATABASE_URL.replace("+asyncpg", "+psycopg2")

    def validate_startup(self) -> None:
        """Check critical config before the app starts serving."""
        if self.SECRET_KEY == "CHANGE_ME_BEFORE_RUNNING":
            import warnings
            warnings.warn(
                "SECRET_KEY is using the default value. "
                "Generate a proper key: python -c \"import secrets; print(secrets.token_urlsafe(64))\"",
                stacklevel=2,
            )
        if self.GOOGLE_API_KEY == "":
            import warnings
            warnings.warn(
                "GOOGLE_API_KEY is not set. Agent endpoints will be unavailable.",
                stacklevel=2,
            )
        if self.GEMINI_DAILY_CALL_LIMIT < 0:
            raise ValueError("GEMINI_DAILY_CALL_LIMIT cannot be negative")


settings = Settings()
