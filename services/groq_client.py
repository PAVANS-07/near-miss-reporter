import requests
import os

def call_groq(prompt):
    print("🚀 CALLING GROQ API...")

    api_key = os.getenv("GROQ_API_KEY")

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        # 🔥 Add timeout (max 2 seconds)
        response = requests.post(
            url,
            headers=headers,
            json=body,
            timeout=2
        )

        if response.status_code != 200:
            print("❌ ERROR:", response.text)
            return None

        data = response.json()
        return data["choices"][0]["message"]["content"]

    except requests.exceptions.Timeout:
        print("⏱️ TIMEOUT ERROR")
        return None

    except Exception as e:
        print("❌ ERROR:", str(e))
        return None