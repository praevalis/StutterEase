from sqlalchemy.orm import Session, sessionmaker

from src.core.database import SessionLocal
from src.core.config import Settings, settings

def get_settings() -> Settings:
    """
    Dependency injector for app config.

    Returns:
        Settings: Object of the class inherited from pydantic BaseSettings.

    """
    return settings

def get_db_session() -> sessionmaker[Session]:
    """
    Dependency injector for database session.

    Returns:
        sessionmaker[Session]: Session object created using sessionmaker.
        
    """
    return SessionLocal