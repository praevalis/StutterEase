from typing import Optional, Dict, Any, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, field_validator, Field, ValidationInfo

class Settings(BaseSettings):
    """Parses type-safe environment variables."""
    ALLOWED_ORIGINS: List[str] = Field(default_factory=list)

    LOG_LEVEL: str
    LOG_DIR_PATH: str

    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_HOST: str
    POSTGRES_PASSWORD: SecretStr

    POSTGRES_URI: Optional[str] = None

    @field_validator("POSTGRES_URI", mode="before")
    def validate_postgres_conn(cls, v: Optional[str], info: ValidationInfo) -> str:
        if isinstance(v, str):
            return v

        data = info.data

        password: SecretStr = data.get("POSTGRES_PASSWORD", SecretStr(""))

        return "{scheme}://{user}:{password}@{host}/{db}".format(
            scheme="postgresql+asyncpg",
            user=data.get("POSTGRES_USER"),
            password=password.get_secret_value(),
            host=data.get("POSTGRES_HOST"),
            db=data.get("POSTGRES_DB"),
        )

    SECRET_KEY: SecretStr
    ACCESS_TOKEN_EXPIRES_MINUTES: int

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local", ".env.production")
    )

settings = Settings()