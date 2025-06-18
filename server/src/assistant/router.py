import io
from fastapi import (
    APIRouter, 
    WebSocket, 
    WebSocketDisconnect,
    Depends
)
from typing import Annotated
from faster_whisper import WhisperModel
from langchain_core.language_models.chat_models import BaseChatModel

from src.core.logging import logger
from src.core.config import settings
from src.core.metadata import ApiTags
from src.assistant.utils import load_audio_segment
from src.core.dependencies import get_groq_model, get_whisper_model
from src.assistant.services import (
    get_transcription, 
    is_stuttering, 
    get_next_word_suggestion
)

router = APIRouter(
    tags=[ApiTags.assistant],
    prefix="/assistant"
)

@router.websocket("/ws/audio")
async def audio_suggestion_stream(
    websocket: WebSocket,
    whisper_model: Annotated[WhisperModel, Depends(get_whisper_model)],
    groq_model: Annotated[BaseChatModel, Depends(get_groq_model)]  
):
    """
    Websocket endpoint where the client streams audio in chunks and server streams next word suggestions.

    Args:
        websocket: Websocket object.
    """
    await websocket.accept()
    buffer = b""

    try:
        while True:
            data = await websocket.receive_bytes()
            buffer += data

            if len(buffer) > 16000 * 2: # approx. 1 second of audio
                logger.debug("Checking buffer.")
                audio = io.BytesIO(buffer)
                logger.debug("Converted to audio bytes.")
                audio_wav = load_audio_segment(audio)
                logger.debug("Converted to wav audio.")
                transcription = get_transcription(audio, whisper_model, beam_size=1)
                logger.debug(f"Transcription: {transcription}")

                if is_stuttering(audio_wav, transcription, settings.SILENCE_THRESHOLD, settings.MIN_SILENCE_LEN):
                    logger.debug("Stutter block detected.")
                    suggestion = await get_next_word_suggestion(transcription, groq_model)
                    logger.debug(f"Suggestion: {suggestion}")
                    payload = ", ".join(suggestion) if isinstance(suggestion, list) else suggestion
                    await websocket.send_text(payload)

                buffer = b""

    except WebSocketDisconnect:
        logger.info(f"Websocket connection closed.")
  