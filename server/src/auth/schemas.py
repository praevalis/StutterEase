from enum import Enum
from pydantic import BaseModel

from src.user.schemas import UserDto

class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"

class TokenData(BaseModel):
    sub: str

class AuthResponseData(BaseModel):
    access_token: str
    refresh_token: str
    user: UserDto

class AuthSuccessResponse(BaseModel):
    message: str
    data: AuthResponseData

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    message: str
    data: dict