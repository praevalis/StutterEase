from uuid import UUID
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, status

from src.core.logging import logger
from src.core.metadata import ApiTags
from src.user.services import update_user, delete_user
from src.core.dependencies import get_current_user, get_db_session
from src.user.schemas import (
    UserDto,
    UserUpdateDto,
    UserUpdateResponse, 
    UserDeleteResponse
)

router = APIRouter(
    tags=[ApiTags.user],
    prefix="/user"
)

@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserDto)
async def get_current_user_profile(
    current_user: Annotated[UserDto, Depends(get_current_user, use_cache=True)]
) -> UserDto:
    """
    Retrieves current user profile.

    Args:
        current_user: Dependency for current user.

    Returns:
        UserDto: Current user's profile without sensitive information.
    """
    return current_user

@router.patch("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserUpdateResponse)
async def update_user_endpoint(
    user_id: UUID,
    update_data: UserUpdateDto,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)]
) -> UserUpdateResponse:
    """
    Endpoint to update user.

    Args:
        user_id: Id of the user to update.
        update_data: Data to update user.
        current_user: Current user.
    
    Returns:
        UserUpdateResponse: Response with updated user.
    """
    try:
        updated_user = update_user(user_id, update_data, session, current_user)

        return UserUpdateResponse(
            message="User updated successfully.",
            data=updated_user
        )

    except Exception as e:
        logger.error(f"Error while updating user (id: {user_id}): {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error."
        )
    
@router.delete("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserDeleteResponse)
async def delete_user_endpoint(
    user_id: UUID,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)]
) -> UserDeleteResponse:
    """
    Endpoint to delete user.

    Args:
        user_id: Id of the user to be deleted.
    
    Returns:
        UserDeleteResponse: Only a message and no data.
    """
    try:
        delete_user(user_id, session, current_user)

        return UserDeleteResponse(
            message="User deleted successfully.",
            data=None
        )
    
    except Exception as e:
        logger.error(f"Error while deleting user (id: {user_id}): {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error."
        )
    
