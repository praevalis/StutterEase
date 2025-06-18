from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.coach.models import MessageSource

class ConversationDto(BaseModel):
    id: UUID
    user_id: UUID
    scenario_id: UUID | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        extra="forbid",
        from_attributes=True
    )

class ConversationCreateDto(BaseModel):
    user_id: UUID
    scenario_id: UUID | None = None

class ConversationResponse(BaseModel):
    message: str
    data: ConversationDto | list[ConversationDto]

class ScenarioDto(BaseModel):
    id: UUID
    title: str
    description: str

    model_config = ConfigDict(
        extra="forbid",
        from_attributes=True
    )

class ScenarioCreateDto(BaseModel):
    title: str
    description: str

class ScenarioUpdateDto(BaseModel):
    title: str | None = None
    description: str | None = None

class ScenarioResponse(BaseModel):
    message: str
    data: ScenarioDto | list[ScenarioDto]

class MessageDto(BaseModel):
    id: UUID
    source: MessageSource
    conversation_id: UUID
    content: str
    sent_at: datetime

    model_config = ConfigDict(
        extra="forbid",
        from_attributes=True
    )

class MessageCreateDto(BaseModel):
    source: MessageSource
    conversation_id: UUID
    content: str

class MessageResponse(BaseModel):
    message: str
    data: MessageDto | list[MessageDto]