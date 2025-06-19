# StutterEase

StutterEase is a real-time speech coaching assistant designed to support individuals who face challenges due to speech disorders, particularly Childhood Onset Fluency Disorder (Stuttering). It enables users to engage in natural, guided conversations where they can speak freely and receive contextual assistance when they get stuck.

## How it Works?

-   When an individual stammers, the main issue is that their mind gets clouded and they struggle to find the appropriate next words. StutterEase helps them overcome this through Speech Assistance — a feature that allows users to record real-life conversations (Your audio is used only for real-time assistance and is never stored or retained in any form). The audio is transcribed using Faster Whisper, and when a stutter is detected, the transcription is passed to an LLM to generate next-word suggestions, which are then provided to the user.

-   Lack of confidence is another challenge. To help build confidence, StutterEase offers Conversation Coaching — a feature that lets users engage in scenario-based, natural language conversations with AI. Transcription and Text-to-Speech are used to simulate real-life audio interactions, making practice more immersive and realistic.

## Tech Stack

-   **Expo**: Framework used for native development.
-   **FastAPI**: Framework used for server side.
-   **LangChain**: LLM-related features.
-   **PostgreSQL**: Relational Database.
-   **Faster-Whisper**: Audio Transcription.

## Setup Instructions

First clone the repository,

```bash
git clone https://github.com/praevalis/StutterEase.git
cd StutterEase
```

Now, setup both the client and the server using instructions given below.

### Client

1. **Install Dependencies**

```bash
npm install
npm install -g expo-cli # if not installed already
```

2. **Start the App**

```bash
npx expo start
```

3. **Download the Expo Go App**

> Note: Available on both Playstore and AppStore.

Scan the QR code on your CLI after starting the expo app in previous step. Wait for the application to load.

### Server

1. **Add Virtual Env and Dependencies**

```python
uv venv
uv sync
```

2. **Create a `.env` file and populate it using template values**

```bash
MIN_SILENCE_LEN=300
SILENCE_THRESHOLD=-40

GROQ_MODEL_NAME=model_name
GROQ_API_KEY=api_key

LOG_LEVEL=DEBUG
LOG_DIR_PATH=logs

POSTGRES_URI=db_url

ALGORITHM=algorithm
REFRESH_TOKEN_EXPIRES_DAYS=refresh_token_expiration
ACCESS_TOKEN_EXPIRES_MINUTES=access_token_expiration
ALLOWED_ORIGINS=["http://localhost:5173"] 
SECRET_KEY=secret_key
```

3. **Make Migrations to DB**

```bash
alembic upgrade head
```

4. **Run the Server**

```bash
uv run uvicorn src.server:api --host 0.0.0.0 --port 8000
```
