from uuid import UUID
from typing import TypeVar, Type
from fastapi import HTTPException, status
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session, declarative_base

from src.core.config import settings

# Database globals for the entire application
engine = create_engine(settings.POSTGRES_URI)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

# Helper function to create all tables
def create_tables() -> None:
    """Creates all the tables present in the Base metadata."""
    Base.metadata.create_all(bind=engine)

# Generic database operations
T = TypeVar("T")  # Generic type for ORM models

def get_by_id_or_404(model: Type[T], id: UUID, session: Session) -> T:
    """
    Generic function to fetch an entity by ID or raise 404.

    Args:
        model: SQLAlchemy model class (e.g., User, Conversation).
        id: UUID of the entity.
        session: SQLAlchemy session.

    Returns:
        The instance of the model.

    Raises:
        HTTPException: 404 if not found.
    """
    instance = session.scalar(select(model).where(model.id == id))
    if not instance:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found.")
    return instance

def assert_entity_identity_match(entity: T, actor: T) -> None:
    """
    Asserts that the actor's ID matches the target entity's ID.

    Args:
        entity: The target ORM model or object (must have an `id`).
        actor: The current user or requesting identity (must have an `id`).

    Raises:
        HTTPException: 403 if IDs don't match.
    """
    if getattr(entity, "id", None) != getattr(actor, "id", None):
        label = type(entity).__name__
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"{label} identity mismatch."
        )