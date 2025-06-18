# StutterEase

StutterEase is a real-time speech coaching assistant designed to support individuals who face challenges due to speech disorders, particularly Childhood Onset Fluency Disorder (Stuttering). It enables users to engage in natural, guided conversations where they can speak freely and receive contextual assistance when they get stuck.

## How it Works?

-   **Scenario-based Conversations:** Users select from real-world conversational scenarios (e.g., interviews, casual chats, presentations) to simulate real-life speaking conditions.

-   **Live Voice Input:** Users press a button to speak, and their voice is streamed to the backend using WebSockets.
-   **Transcription:** The spoken audio is transcribed in real-time using a highly efficient ASR model, faster-whisper.
-   **LLM-Powered Coaching:** The transcribed input is passed to a Language Model which responds naturally — either by continuing the conversation or by suggesting the next word or phrase to help the user overcome stuttering blocks.
-   **Text-to-Speech Feedback:** The AI response is converted back to audio using the device’s text-to-speech engine, enabling seamless voice-based communication.

StutterEase acts like a patient, intelligent conversational partner, helping users practice speech fluency and build confidence in a safe, responsive environment.

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
