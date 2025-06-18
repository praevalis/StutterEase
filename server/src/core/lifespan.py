from fastapi import FastAPI
from faster_whisper import WhisperModel
from contextlib import asynccontextmanager
from langchain.chat_models import init_chat_model

from src.core.logging import logger
from src.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Provides lifespan context for application. 
    
    Args:
        app: Instantiated FastAPI application.
    """
    logger.info(f"Starting FastAPI application...")

    try:
        app.state.whisper_model = WhisperModel("base.en", compute_type="int8")
        app.state.groq_model = init_chat_model(
            settings.GROQ_MODEL_NAME, 
            model_provider="groq", 
            api_key=settings.GROQ_API_KEY
        )
        logger.info("Models loaded successfully.")

        yield

    except Exception as e:
        logger.exception("Startup failed.")
        raise e

    finally:
        del app.state.whisper_model
        del app.state.groq_model

        logger.info(f"Shutting down FastAPI application...")