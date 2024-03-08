import re

import tiktoken as tiktoken
from youtube_transcript_api import YouTubeTranscriptApi


def get_video_transcript(video_url):
    match = re.search(r"(?:youtube\.com\/watch\?v=|youtu\.be\/)(.*)", video_url)
    if match:
        video_id = match.group(1)
    else:
        raise ValueError("Invalid YouTube URL")

    # Fetch the transcript using the YouTubeTranscriptApi
    transcript = YouTubeTranscriptApi.get_transcript(video_id)

    # Extract the text of the transcript
    transcript_text = ""
    for line in transcript:
        transcript_text += line["text"] + " "
    return transcript_text


def count_tokens(text, selected_model):
    encoding = tiktoken.encoding_for_model(selected_model)

    # Count tokens for the text
    tokens = encoding.encode(text)
    token_count = len(tokens)
    return token_count
