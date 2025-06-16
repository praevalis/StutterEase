import io
from fastapi import (
    APIRouter, 
    WebSocket, 
    WebSocketDisconnect, 
    WebSocketException
)

from src.core.logging import logger
from src.core.config import settings
from src.core.metadata import ApiTags
from src.assistant.utils import load_audio_segment
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
async def audio_suggestion_stream(websocket: WebSocket):
    """
    Websocket point where the client streams audio in chunks and server streams next word suggestions.

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
                audio = io.BytesIO(buffer)
                audio_wav = load_audio_segment(audio)
                transcription = get_transcription(audio, beam_size=1)

                if is_stuttering(audio_wav, transcription, settings.SILENCE_THRESHOLD, settings.MIN_SILENCE_LEN):
                    suggestion = await get_next_word_suggestion(transcription)
                    payload = ", ".join(suggestion) if isinstance(suggestion, list) else suggestion
                    await websocket.send_text(payload)

                buffer = b""

    except WebSocketDisconnect:
        logger.info(f"Websocket connection closed.")
        await websocket.close()

    except WebSocketException as ws_error:
        logger.error(f"Error while handling websocket connection: {ws_error}")
        raise RuntimeError(f"WebSocket processing error.") from ws_error
  