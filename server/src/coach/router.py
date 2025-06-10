from fastapi import APIRouter

router = APIRouter(
    tags=["conversation-coach"],
    prefix="/coach"
)

# TO-DO: Add coach endpoints