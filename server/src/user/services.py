from uuid import UUID
from sqlalchemy.orm import Session

from src.user.models import User
from src.user.schemas import UserUpdateDto, UserDto
from src.core.database import get_by_id_or_404, assert_entity_identity_match

def update_user(
    user_id: UUID, 
    update_data: UserUpdateDto, 
    session: Session,
    current_user: UserDto
) -> UserDto:
    """
    Service to update an user.

    Args:
        user_id: Id of the user to update.
        update_data: Data to update an user.
        session: Database session.
        current_user: Current user that sent the request.

    Returns:
        UserDto: Updated user.
    """
    user_to_update = get_by_id_or_404(User, user_id, session)
    assert_entity_identity_match(user_to_update, current_user)
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(user_to_update, field, value)

    session.commit()
    session.refresh(user_to_update)

    return UserDto.model_validate(user_to_update)

def delete_user(user_id: UUID, session: Session, current_user: UserDto) -> None:
    """
    Service to delete an user from database.

    Args:
        user_id: Id of the user to delete.
        session: Database session.
        current_user: Current user who sent the request.

    Returns:
        None
    """
    user_to_delete = get_by_id_or_404(User, user_id, session)
    assert_entity_identity_match(user_to_delete, current_user)

    session.delete(user_to_delete)
    session.commit()