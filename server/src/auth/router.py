from fastapi import APIRouter

router = APIRouter(
    tags=["auth"],
    prefix="/auth"
)

# TO-DO: Add auth endpoints