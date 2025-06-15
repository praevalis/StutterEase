from enum import Enum
from uuid import uuid4, UUID
from datetime import datetime
from sqlalchemy import String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID, TIMESTAMP

from src.core.database import Base

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
    last_name: Mapped[str | None] = mapped_column(String(50), default="", nullable=True)
    dob: Mapped[datetime | None] = mapped_column(TIMESTAMP, nullable=True)
    gender: Mapped[GenderEnum] = mapped_column(
        SQLEnum(GenderEnum, name="gender_enum"), 
        default=GenderEnum.prefer_not_to_say, 
        nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.now, nullable=False)