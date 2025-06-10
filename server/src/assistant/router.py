from fastapi import APIRouter

router = APIRouter(
    tags=["speech-assistant"],
    prefix="/assistant"
)

# TO-DO: Add assistant endpoints