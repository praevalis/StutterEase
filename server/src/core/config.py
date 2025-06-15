from pydantic import SecretStr, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Parses type-safe environment variables."""
    LOG_LEVEL: str
    LOG_DIR_PATH: str

    POSTGRES_URI: str

    ALGORITHM: str
    SECRET_KEY: SecretStr
    ACCESS_TOKEN_EXPIRES_MINUTES: int
    REFRESH_TOKEN_EXPIRES_DAYS: int
    ALLOWED_ORIGINS: list[str] = Field(default_factory=list)

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local", ".env.production")
    )

settings = Settings()