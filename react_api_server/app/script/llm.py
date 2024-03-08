import json
import requests

api_key = "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"


def openai_generate(user_prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    url = "https://api.openai.com/v1/chat/completions"

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": user_prompt}],
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    response_data = response.json()
    generated_text = response_data["choices"][0]["message"]["content"]
    # save_to_json(generated_text)

    return generated_text


def save_to_json(response):
    data = {"response": response}
    with open("ai_prompt_responses.json", "a") as f:
        f.write(json.dumps(data) + "\n")
