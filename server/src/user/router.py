from fastapi import APIRouter

router = APIRouter(
    tags=["user"],
    prefix="/user"
)

# TO-DO: Add user endpoints