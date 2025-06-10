from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from src.core.config import settings

# Database globals for entire application.
engine = create_async_engine(settings.POSTGRES_URI)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

# Helper functions for handling database.
def create_tables() -> None:
    """Creates all the tables present in the Base metadata.""" 
    Base.metadata.create_all(engine)