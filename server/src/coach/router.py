from fastapi import APIRouter

from src.core.metadata import ApiTags

router = APIRouter(
    tags=[ApiTags.coach],
    prefix="/coach"
)

# TO-DO: Add coach endpoints