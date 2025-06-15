from enum import Enum

class ApiTags(str, Enum):
    """Specifies tags used to group API operations."""
    assistant = "assistant"
    auth = "auth"
    coach = "coach"
    user = "user"

# metadata for the API
title = "StutterEase-API"

version = "0.0.1"

api_description = """
StutterEase API handles all the business logic for StutterEase.

## Features

- **Speech Assistant**: Assists users with real-time next word suggestions.
- **Conversation Coach**: Converses with users to help them improve their speech.
"""

tags = [
    {
        "name": ApiTags.auth,
        "description": "Handles all the authentication and security logic for API."
    },
    {
        "name": ApiTags.assistant,
        "description": "Handles the logic for real-time speech suggestions."
    },
    {
        "name": ApiTags.coach,
        "description": "Handles logic for conversation coaching."
    },
    {
        "name": ApiTags.user,
        "description": "Handles user operations such as profile management."
    }
]