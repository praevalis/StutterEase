from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from src.user.models import GenderEnum

class UserDto(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    first_name: str
    last_name: str | None = Field(default="")
    dob: datetime | None = Field(default=None)
    gender: GenderEnum | None = Field(default=GenderEnum.prefer_not_to_say)
    joined_at: datetime = Field(default_factory=datetime.now)

    model_config = ConfigDict(
        extra="forbid",
        from_attributes=True # Using this config to allow cohesion between ORM and Pydantic
    )

class UserCreateDto(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(
        min_length=3, 
        max_length=20, 
        pattern=r"^[A-Za-z\d@$!%*?&]+$"
    )
    first_name: str = Field(min_length=1, max_length=50)
    last_name: str | None = Field(default="", min_length=1, max_length=50)
    dob: datetime | None = Field(default=None)
    gender: GenderEnum | None = Field(default=GenderEnum.prefer_not_to_say)

    model_config = ConfigDict(
        str_strip_whitespace=True
    )

class UserUpdateDto(BaseModel):
    username: str | None = Field(default=None)
    email: EmailStr | None = Field(default=None)
    first_name: str | None = Field(default=None)
    last_name: str | None = Field(default=None)
    password: str | None = Field(default=None)

    model_config = ConfigDict(
        str_strip_whitespace=True
    )

class UserUpdateResponse(BaseModel):
    message: str
    data: UserDto

class UserDeleteResponse(BaseModel):
    message: str
    data: None
