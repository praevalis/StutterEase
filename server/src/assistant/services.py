from io import BytesIO
from pydub import AudioSegment, silence
from faster_whisper import WhisperModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.language_models.chat_models import BaseChatModel

def get_transcription(
    audio: BytesIO | bytes, 
    model: WhisperModel, 
    beam_size: int = 1
) -> str:
    """
    Get transcribes from audio.

    Args:
        audio: Audio in buffer format.
        beam_size: Beam size to use for decoding.
        whisper_model: Model to be used for transcription.

    Returns:
        str: Transcription.
    """
    segments, _ = model.transcribe(audio, beam_size=beam_size)
    transcript = " ".join([seg.text for seg in segments])
    return transcript

def is_stuttering(
    audio_seg: AudioSegment, 
    transcript: str,
    silence_thresh: int = -40,
    min_silence_len: int = 300
) -> bool:
    """
    Identifies whether the audio segment consists of blocks.

    Args:
        audio_seg: Audio segment to check.
        silence_thresh: Threshold for silent blocks of audio.
        transcript: Transcribed audio file.
        
    Returns:
        bool: True if the audio consists of stutter blocks.
    """
    silences = silence.detect_silence(
        audio_seg, 
        min_silence_len=min_silence_len, 
        silence_thresh=silence_thresh
    )
    return bool(silences) or (transcript and transcript.split()[-1].endswith(("-", "uh", "um", "aaaa")))

async def get_next_word_suggestion(transcription: str, model: BaseChatModel) -> str | list[str]:
    """
    Provides suggestions for next word based on context.

    Returns:
        str | list[str]: Next word suggestions.
    """
    system_prompt = """
    ### Role:
    You are a helpful and intelligent **speech assistant** designed to help users continue speaking fluently during real-time conversations.

    ### Objective:
    1. Analyze the provided transcript to detect signs of speech disfluency, such as stuttering, hesitations, or abrupt pauses — typically indicated by dashes (e.g., 'uh---'), repetitions, filler words or aberrations in text.
    2. Use the full context of the transcript to suggest 1–4 appropriate next words that the speaker might naturally say next.
    3. Respond only with a list of 1 to 4 contextually relevant and grammatically appropriate next words.

    ### Example:
    **Transcript:**
    Yes, I went to that party yesterday. I uh--

    **Next word suggestions:**
    enjoyed, liked, hated, remembered

    ### Output Format:
    Comma-separated list of 1 to 4 words. Do not include quotes, numbers, or explanations.

    ### Important Guidelines:
    - Never suggest profanities, slang, or inappropriate content.
    - Always consider the intent and tone of the sentence.
    - Your suggestions should be helpful and aligned with what the user is likely trying to say.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{transcript}")
    ])

    suggestion_chain = prompt | model

    response = await suggestion_chain.ainvoke({"transcript": transcription})
    raw = response.content if hasattr(response, "content") else str(response)
    return [w.strip() for w in raw.split(",") if w.strip()]