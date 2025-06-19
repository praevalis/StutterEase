from enum import Enum
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import Enum as SQLEnum, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID, TIMESTAMP, TEXT

from src.user.models import User
from src.core.database import Base

# Enum models
class MessageSource(str, Enum):
    USER = "USER"
    BOT = "BOT"

# ORM models
class Scenario(Base):
    __tablename__ = "scenarios"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(TEXT, nullable=False)
    description: Mapped[str] = mapped_column(TEXT, nullable=True)

    conversations: Mapped[list["Conversation"]] = relationship(back_populates="scenario")

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    source: Mapped[MessageSource] = mapped_column(
        SQLEnum(MessageSource, name="message_source"),
        nullable=False
    )
    conversation_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    content: Mapped[str] = mapped_column(TEXT, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    conversation: Mapped["Conversation"] = relationship(back_populates="messages")

class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    scenario_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="conversations")
    scenario: Mapped["Scenario"] = relationship(back_populates="conversations")
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan"
    )
