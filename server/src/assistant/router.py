from fastapi import APIRouter

from src.core.metadata import ApiTags

router = APIRouter(
    tags=[ApiTags.assistant],
    prefix="/assistant"
)

# TO-DO: Add assistant endpoints