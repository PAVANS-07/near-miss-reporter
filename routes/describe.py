from flask import Blueprint, request, jsonify
from datetime import datetime
from services.groq_client import call_groq
from services.cache import get_from_cache, set_cache
from services.metrics import response_times
import json
import time

# Create a blueprint for /describe API
describe_bp = Blueprint("describe", __name__)


# Function to load prompt file and insert user input
def load_prompt(text):
    with open("prompts/describe.txt", "r") as f:
        template = f.read()
    return template.replace("{input}", text)


# POST /describe endpoint
@describe_bp.route("/describe", methods=["POST"])
def describe():
    start = time.time()

    data = request.get_json()

    # 🔐 Input validation
    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400

    text = data["text"]

    if not isinstance(text, str) or len(text.strip()) == 0:
        return jsonify({"error": "Invalid input"}), 400

    if len(text) > 500:
        return jsonify({"error": "Input too long"}), 400

    # 🔹 Check cache
    cached = get_from_cache(text)
    if cached:
        return jsonify(cached)

    prompt = load_prompt(text)

    try:
        ai_response = call_groq(prompt)
    except:
        ai_response = None

    if not ai_response:
     return jsonify({
        "description": "AI service unavailable, please try again later",
        "risk_level": "medium",
        "is_fallback": True,
        "generated_at": datetime.utcnow().isoformat()
    })

    try:
        parsed = json.loads(ai_response)
    except:
        return jsonify({
            "description": "Invalid AI response format",
            "risk_level": "medium",
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    result = {
        "description": parsed.get("description"),
        "risk_level": parsed.get("risk_level"),
        "generated_at": datetime.utcnow().isoformat()
    }

    set_cache(text, result)

    response_times.append(time.time() - start)

    return jsonify(result)