from enum import Enum
from uuid import uuid4, UUID
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Enum as SQLEnum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID, DATE, TIMESTAMP

from src.core.database import Base
if TYPE_CHECKING:
    # Prevents circular import between modules
    # as conversation model is only imported for type checking.
    from src.coach.models import Conversation

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not_to_say = "prefer not to say"

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(254), nullable=False, unique=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str | None] = mapped_column(String(50), nullable=True)
    dob: Mapped[datetime | None] = mapped_column(DATE, nullable=True)
    gender: Mapped[GenderEnum] = mapped_column(
        SQLEnum(GenderEnum, name="gender_enum"), 
        default=GenderEnum.prefer_not_to_say, 
        nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )