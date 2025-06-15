from typing import Generator
from sqlalchemy.orm import Session

from src.core.database import SessionLocal
from src.core.config import Settings, settings

def get_settings() -> Settings:
    """
    Dependency injector for app config.

    Returns:
        Settings: Object of the class inherited from pydantic BaseSettings.
    """
    return settings

def get_db_session() -> Generator[Session, None, None]:
    """
    Dependency injector for database session.

    Yields:
        Session: SQLAlchemy database session. 
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()