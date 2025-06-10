from fastapi import FastAPI
from contextlib import asynccontextmanager

from src.core.logging import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Provides lifespan context for application. 
    
    Args:
        app: Instantiated FastAPI application.
    """
    logger.info(f"Starting FastAPI application...")

    yield

    logger.info(f"Shutting down FastAPI application...")