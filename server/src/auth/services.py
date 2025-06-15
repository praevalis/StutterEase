from typing import Any
from jwt import PyJWTError
from sqlalchemy import select
from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordBearer

from src.user.models import User
from src.core.config import settings
from src.auth.schemas import TokenType, TokenData
from src.user.schemas import UserDto, UserCreateDto
from src.auth.utils import encode_jwt, decode_jwt, get_password_hash, verify_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def create_access_token(data: dict[str, Any]) -> str:
    """
    Creates access token using given data.

    Args:
        data: Data to be encoded.

    Returns:
        str: Created access token.
    """
    return encode_jwt(
        data, 
        settings.SECRET_KEY.get_secret_value(), 
        settings.ALGORITHM,
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES),
        TokenType.ACCESS  
    )

async def create_refresh_token(data: dict[str, Any]) -> str:
    """
    Creates refresh token using given data.

    Args:
        data: Data to be encoded.

    Returns:
        str: Created refresh token.
    """
    return encode_jwt(
        data,
        settings.SECRET_KEY.get_secret_value(),
        settings.ALGORITHM,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRES_DAYS),
        TokenType.REFRESH
    )

async def create_user(
    user_data: UserCreateDto,
    session: Session
) -> UserDto:
    """
    Creates user with the given data.

    Args:
        user_data: Data for creating user.
        session: Database session.

    Returns:
        UserDto: Created user.
    """
    password_hash = get_password_hash(user_data.password)

    user = User(
        username=user_data.username,
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        dob=user_data.dob,
        gender=user_data.gender,
        password_hash=password_hash
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return UserDto.model_validate(user)

async def authenticate_user(
    username_or_email: str, 
    password: str, 
    session: Session
) -> UserDto | None:
    """
    Authenticates user using credentials.

    Args:
        username_or_email: Identifier used for authentication.
        password: Password to be validated.

    Returns:
        UserDto | None: User is returned if authenticated succeeds else None.
    """
    if "@" in username_or_email:
        query = select(User).where(User.email == username_or_email)
    else:
        query = select(User).where(User.username == username_or_email)

    user = session.scalars(query).first()
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    return UserDto.model_validate(user)

async def verify_token(
    token: str, 
    expected_token_type: TokenType
) -> TokenData | None:
    """
    Verifies given token and returns encoded payload if valid.

    Args:
        token: Token to verify.
        expected_token_type: Type of the token.

    Returns:
        TokenData | None: Data is returned if valid else None.
    """
    try:
        payload = decode_jwt(
            token, 
            settings.SECRET_KEY.get_secret_value(), 
            settings.ALGORITHM
        )
        
        token_type = payload.get("type")
        if token_type != expected_token_type.value:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token type mismatch.")

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token payload missing user ID.")

        return TokenData(sub=user_id)

    except (PyJWTError, KeyError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token.")