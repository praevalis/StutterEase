from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from src.core.config import settings

# Database globals for the entire application
engine = create_engine(settings.POSTGRES_URI)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

# Helper function to create all tables
def create_tables() -> None:
    """Creates all the tables present in the Base metadata."""
    Base.metadata.create_all(bind=engine)