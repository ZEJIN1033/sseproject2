import sys

import requests
from bs4 import BeautifulSoup
from fastapi import HTTPException

from app.script import youtube
from app.script.helper import get_video_transcript, count_tokens
from app.script.llm import openai_generate

max_tokens_per_chunk = 16385


def get_youtube_title(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises HTTPError for bad responses
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"HTTP Error: {e}")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=500, detail="Connection error")
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=408, detail="Timeout")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request Exception: {e}")

    try:
        soup = BeautifulSoup(response.content, 'html.parser')
        title_tag = soup.find('title')

        if title_tag:
            return title_tag.text  # Return the title text directly
        else:
            raise HTTPException(status_code=404, detail="Title not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing HTML: {e}")

def process_video_transcript(url, model):
    # Retrieve video transcript
    video_transcript = get_video_transcript(url)

    # Initialize token counts
    input_token_count = 0
    output_token_count = 0

    if count_tokens(video_transcript, model) > max_tokens_per_chunk:
        return False
    else:
        chunks = [video_transcript]

    overall_output = ""
    # Process each chunk to summarize
    for chunk in chunks:
        prompt = youtube.best_youtube_summary.format(user_input=chunk)
        try:
            overall_output = openai_generate(prompt)

        except Exception as e:
            print(f"Error processing chunk: {e}")
            continue

    return overall_output


def format_summary(summary: str) -> str:
    # Split the summary into sections based on the headers (like '# ONE SENTENCE SUMMARY:')
    sections = summary.split('- # ')
    formatted_summary = ""

    for section in sections:
        if section.strip():
            # Split the section into lines
            lines = section.split('\n')
            # Add the header back with Markdown formatting
            formatted_summary += f"### {lines[0].strip()}\n\n"
            # Add the remaining lines
            for line in lines[1:]:
                if line.strip():
                    formatted_summary += f"{line.strip()}\n\n"
            # Add a horizontal line for separation between sections
            formatted_summary += "---\n\n"

    return formatted_summary.strip()


def main():
    selected_model = "gpt-3.5-turbo-0125"
    print(sys.argv)
    # Check if a YouTube URL is provided as a command line argument
    if len(sys.argv) > 1:
        youtube_url = sys.argv[1]
        video_title = get_youtube_title(youtube_url)
        print(video_title)
        print("2")
        summarized_output = process_video_transcript(youtube_url, selected_model)
        if summarized_output:
            print(summarized_output)
        else:
            print("Failed to generate a summary.")
    else:
        print("Please provide a YouTube URL as an argument.")
