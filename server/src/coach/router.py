import io
from uuid import UUID
from typing import Annotated
from sqlalchemy.orm import Session
from faster_whisper import WhisperModel
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.language_models.chat_models import BaseChatModel
from fastapi import (
    status,
    APIRouter, 
    WebSocket, 
    WebSocketDisconnect,
    HTTPException,
    Depends
)

from src.core.logging import logger
from src.core.metadata import ApiTags
from src.coach.models import MessageSource
from src.assistant.services import get_transcription
from src.core.dependencies import get_db_session, get_groq_model, get_whisper_model
from src.coach.services import (
    create_conversation, 
    create_scenario, 
    update_scenario,
    generate_reply,
    save_message  
)
from src.coach.schemas import (
    ConversationCreateDto,
    ConversationResponse,
    ScenarioCreateDto, 
    ScenarioUpdateDto,
    ScenarioResponse,
    MessageCreateDto
)

router = APIRouter(
    tags=[ApiTags.coach],
    prefix="/coach"
)

@router.post("/conversation", status_code=status.HTTP_201_CREATED, response_model=ConversationResponse)
async def create_conversation_endpoint(
    create_dto: ConversationCreateDto, 
    session: Annotated[Session, Depends(get_db_session)]
) -> ConversationResponse:
    """
    Endpoint to create a conversation.

    Args:
        create_dto: Data for creating conversation.

    Returns:
        ConversationResponse: Message and created conversation.
    """
    try:
        conversation = await create_conversation(create_dto, session)
        return ConversationResponse(
            message="Conversation created successfully.",
            data=conversation
        )

    except Exception as e:
        logger.error(f"Error while creating conversation: {e}") 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error."
        )

@router.post("/scenario", status_code=status.HTTP_201_CREATED, response_model=ScenarioResponse)
async def create_scenario_endpoint(
    create_dto: ScenarioCreateDto,
    session: Annotated[Session, Depends(get_db_session)]    
) -> ScenarioResponse:
    """
    Endpoint to create a scenario.

    Args:
        create_dto: Data to create scenario.

    Returns:
        ScenarioResponse: Message and created scenario.
    """
    try:
        scenario = await create_scenario(create_dto, session)
        return ScenarioResponse(
            message="Scenario created successfully.",
            data=scenario
        )

    except Exception as e:
        logger.error(f"Error while creating scenario: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error."
        )
    
@router.patch("/scenario/{scenario_id}", status_code=status.HTTP_200_OK, response_model=ScenarioResponse)
async def update_scenario_endpoint(
    scenario_id: UUID, 
    update_dto: ScenarioUpdateDto,
    session: Annotated[Session, Depends(get_db_session)]  
) -> ScenarioResponse: 
    """
    Endpoint to update scenario.

    Args:
        scenario_id: Id of the scenario to update.
        update_dto: Data to update.
        session: Database session.

    Returns:
        ScenarioResponse: Message and update scenario. 
    """
    try:
        updated_scenario = await update_scenario(scenario_id, update_dto, session)
        return ScenarioResponse(
            message="Scenario updated succesfully.",
            data=updated_scenario
        )

    except Exception as e:
        logger.error(f"Error while updating scenario: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

# WebSocket Endpoints
@router.websocket("/ws/chat")
async def conversation_coach_chat(
    websocket: WebSocket,
    whisper_model: Annotated[WhisperModel, Depends(get_whisper_model)],
    groq_model: Annotated[BaseChatModel, Depends(get_groq_model)],
    session: Annotated[Session, Depends(get_db_session)]
):
    """
    Websocket endpoint for audio chat.

    Args:
        websocket: Websocket object.
    """
    await websocket.accept()

    first_msg = await websocket.receive_text()
    conversation_id = UUID(first_msg)

    memory = ConversationBufferMemory(return_messages=True)

    buffer = b""

    try:
        while True:
            message = await websocket.receive()

            if "bytes" in message:
                buffer += message["bytes"]

            elif message.get("text") == "END_AUDIO":
                audio = io.BytesIO(buffer)

                user_text = get_transcription(audio, whisper_model, beam_size=1)
                memory.chat_memory.add_user_message(user_text)

                bot_text = await generate_reply(memory.chat_memory.messages, groq_model)
                memory.chat_memory.add_ai_message(bot_text)

                await websocket.send_text(bot_text)

                buffer = b""

    except WebSocketDisconnect: 
        logger.info(f"Websocket connection closed.")

        for msg in memory.chat_memory.messages:
            create_dto = MessageCreateDto(
                source=MessageSource.USER if isinstance(msg, HumanMessage) else MessageSource.BOT,
                conversation_id=conversation_id,
                content=msg.content
            )
            _ = await save_message(create_dto, session)

        await websocket.close()
