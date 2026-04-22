import requests
import os

# 🔹 Function to call Groq AI API
def call_groq(prompt):
    print("🚀 CALLING GROQ API...")

    # Get API key from environment variables (.env)
    api_key = os.getenv("GROQ_API_KEY")
    print("API KEY USED:", api_key)

    # Groq API endpoint
    url = "https://api.groq.com/openai/v1/chat/completions"

    # Request headers (authorization + content type)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Request body (model + user prompt)
    body = {
        "model": "llama-3.3-70b-versatile",  # Supported Groq model
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        # 🔹 Send POST request to Groq API
        response = requests.post(url, headers=headers, json=body)

        # Debug logs (very useful during development)
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)

        # If API call fails, return None (handled by fallback)
        if response.status_code != 200:
            return None

        # Convert response JSON
        data = response.json()

        # Extract AI-generated message content
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        # Handle any runtime/network errors
        print("ERROR:", str(e))
        return None