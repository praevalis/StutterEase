# StutterEase

StutterEase is a real-time speech coaching assistant designed to support individuals who face challenges due to speech disorders, particularly Childhood Onset Fluency Disorder (Stuttering). It enables users to engage in natural, guided conversations where they can speak freely and receive contextual assistance when they get stuck.

Here's how it works:

-   **Scenario-based Conversations:** Users select from real-world conversational scenarios (e.g., interviews, casual chats, presentations) to simulate real-life speaking conditions.
-   **Live Voice Input:** Users press a button to speak, and their voice is streamed to the backend using WebSockets.
-   **Transcription:** The spoken audio is transcribed in real-time using a highly efficient ASR model, faster-whisper.
-   **LLM-Powered Coaching:** The transcribed input is passed to a Language Model which responds naturally — either by continuing the conversation or by suggesting the next word or phrase to help the user overcome stuttering blocks.
-   **Text-to-Speech Feedback:** The AI response is converted back to audio using the device’s text-to-speech engine, enabling seamless voice-based communication.

StutterEase acts like a patient, intelligent conversational partner, helping users practice speech fluency and build confidence in a safe, responsive environment.

## Tech Stack
- **Expo**: Framework used for native development.
- **FastAPI**: Framework used for server side.
- **LangChain**: LLM-related features.
- **PostgreSQL**: Relational Database.
- **Faster-Whisper**: Audio Transcription.
