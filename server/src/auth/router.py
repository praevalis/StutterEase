from typing import Annotated
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

from src.user.models import User
from src.core.logging import logger
from src.core.metadata import ApiTags
from src.user.schemas import UserCreateDto
from src.core.dependencies import get_db_session
from src.auth.schemas import (
    AuthResponseData, 
    AuthSuccessResponse, 
    TokenType, 
    TokenData,
    RefreshTokenRequest, 
    RefreshTokenResponse
)
from src.auth.services import (
    create_access_token, 
    create_refresh_token, 
    create_user,
    authenticate_user, 
    verify_token
)

router = APIRouter(
    tags=[ApiTags.auth],
    prefix="/auth"
)

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=AuthSuccessResponse)
async def register_user(
    user_data: UserCreateDto, 
    session: Annotated[Session, Depends(get_db_session)]
) -> AuthSuccessResponse:
    """
    Endpoint to register users.

    Args:
        create_data: Data used for creating user.
        session: Database session.

    Returns:
        AuthSuccessResponse: Response containing created user and access tokens.
    """
    try:
        existing_user_query = select(User).where(
            or_(
                User.username == user_data.username, 
                User.email == user_data.email
            ) 
        )

        existing_user = session.scalars(existing_user_query).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Username or email already exists."
            )
        
        user = await create_user(user_data, session)

        token_data = TokenData(sub=str(user.id))
        response = AuthResponseData(
            access_token = await create_access_token(token_data.model_dump()),
            refresh_token = await create_refresh_token(token_data.model_dump()),
            user = user    
        )

        return AuthSuccessResponse(
            message="Registration successful.",
            data=response
        )
    
    except Exception as e:
        logger.exception(f"Error while registering user {user_data.username}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error."
        )

@router.post("/login", status_code=status.HTTP_200_OK, response_model=AuthSuccessResponse)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_db_session)]    
) -> AuthSuccessResponse:
    """
    Endpoint to login users.

    Args:
        form_data: Data containing username and password.
        session: Database session.
        
    Returns:
        AuthSuccessResponse: Response containing access token.
    """
    try:
        user = await authenticate_user(form_data.username, form_data.password, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user credentials."
            )

        token_data = TokenData(sub=str(user.id))
        response = AuthResponseData(
            access_token = await create_access_token(token_data.model_dump()),
            refresh_token = await create_refresh_token(token_data.model_dump()),
            user = user    
        )

        return AuthSuccessResponse(
            message="Login successful.",
            data=response
        )
    
    except Exception as e:
        logger.exception(f"Error while logging user {form_data.username}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error."
        )

@router.post("/refresh", status_code=status.HTTP_200_OK, response_model=RefreshTokenResponse)
async def refresh_access_token(refresh_token: RefreshTokenRequest) -> RefreshTokenResponse:
    """
    Endpoint to refresh access tokens.

    Args:
        refresh_token: Refresh token.

    Returns:
        RefreshTokenResponse: Response with new access token.
    """
    try:
        user_data = await verify_token(refresh_token, TokenType.REFRESH)

        new_access_token = await create_access_token({ "sub": user_data.sub })
        return RefreshTokenResponse(
            message="Token refreshed successfully.",
            data={
                "access_token": new_access_token
            }
        )

    except Exception as e: 
        logger.exception(f"Error while refreshing token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error."
        )