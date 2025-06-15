from fastapi import APIRouter

from src.core.metadata import ApiTags

router = APIRouter(
    tags=[ApiTags.user],
    prefix="/user"
)

# TO-DO: Add user endpoints