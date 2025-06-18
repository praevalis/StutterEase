import io
from pydub import AudioSegment

def load_audio_segment(audio_chunk: bytes) -> AudioSegment: 
    """
    Converts the provided audio into python mutable form.

    Args:
        audio_chunk: Audio to convert.

    Returns:
        AudioSegment: Python mutable audio.
    """
    return AudioSegment.from_file_using_temporary_files(io.BytesIO(audio_chunk))