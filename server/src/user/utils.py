from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.user.models import User
from src.user.schemas import UserDto

def get_user_by_id_or_404(user_id: UUID, session: Session) -> User:
    """
    Fetches the user using provided Id.

    Args:
        user_id: Id of the user.
        session: Database session.

    Returns:
        User: ORM user model.

    Raises:
        HTTPException: When user is not found.
    """
    user = session.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user

def assert_user_identity_match(target_user: User, current_user: UserDto) -> None:
    """
    Validates target user with current user.

    Args:
        target_user: User to be changed.
        current_user: Current user.

    Returns:
        None

    Raises:
        HTTPException: When identities don't match.
    """
    if target_user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User identity mismatch."
        )