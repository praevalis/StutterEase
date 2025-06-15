from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status

from src.user.models import User
from src.user.schemas import UserDto
from src.auth.schemas import TokenType
from src.core.database import SessionLocal
from src.core.config import Settings, settings
from src.auth.services import oauth2_scheme, verify_token

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

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_db_session)]    
) -> UserDto:
    """
    Dependency injector for the current user.

    Args:
        token: Bearer token from Authorization header.
        session: Database session.

    Returns:
        UserDto: Current user.
    
    Raises:
        HTTPException: When user is not authenticated.
    """
    token_data = await verify_token(token, TokenType.ACCESS)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User is not authenticated."
        )
    
    query = select(User).where(User.id == token_data.sub)
    user = session.scalars(query).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User is not authenticated."
        )
    
    return UserDto.model_validate(user)
