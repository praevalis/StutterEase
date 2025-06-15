import jwt
from typing import Any
from passlib.context import CryptContext
from fastapi import HTTPException, status
from datetime import UTC, datetime, timedelta

from src.auth.schemas import TokenType

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verifies a password, against hashed password.

    Args:
        password: Plain password to verify.
        hashed_password: Hashed password to verify against.

    Returns:
        bool: True if password matches with hash.

    """ 
    return  pwd_context.verify(password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hashes a password.

    Args:
        password: Password to hash.

    Returns:
        str: Hashed password.
    
    """
    return pwd_context.hash(password)

def encode_jwt(
    payload: dict[str, Any], 
    secret_key: str, 
    algorithm: str, 
    expires_delta: timedelta,
    token_type: TokenType
) -> str:
    """
    Encodes the payload.

    Args:
        payload: Data to be encoded.
        secret_key: Secret key.
        algorithm: Algorithm used for encoding.
        expires_delta: Expiration time.
        token_type: Type of the token.
        
    Returns:
        str: Encoded data.
    """
    to_encode = payload.copy()
    to_encode.update({ 
        "exp": datetime.now(UTC) + expires_delta, 
        "type": token_type 
    })
    
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm)
    return encoded_jwt

def decode_jwt(
    token: str,
    secret_key: str,
    algorithm: str
) -> dict[str, Any]:
    """
    Decodes token and returns its payload.
    
    Args:
        token: Token to be decoded.
        secret_key: Secret key.
        algorithm: Algorithm to be used.

    Returns:
        dict[str, Any]: Payload.
    """
    try:
        return jwt.decode(token, secret_key, algorithms=[algorithm])
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired.")
    
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")