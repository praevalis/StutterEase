from fastapi import FastAPI

from src.core.lifespan import lifespan
from src.core.middlewares import cors_middleware
from src.auth.router import router as auth_router
from src.user.router import router as user_router
from src.coach.router import router as coach_router
from src.assistant.router import router as assistant_router
from src.core.metadata import title, api_description, version, tags

api = FastAPI(
    lifespan=lifespan,
    title=title,
    description=api_description,
    version=version,
    openapi_tags=tags
)

cors_middleware.add(api)

api.include_router(auth_router)
api.include_router(user_router)
api.include_router(coach_router)
api.include_router(assistant_router)