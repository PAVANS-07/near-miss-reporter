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
    start = time.time()  # start timer to measure response time

    # Get request JSON data
    data = request.get_json()

    # Check if "text" is present
    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400

    text = data["text"]

    # 🔹 Check if result is already in cache
    cached = get_from_cache(text)
    if cached:
        return jsonify(cached)  # return cached response if available

    # Load prompt and insert user input
    prompt = load_prompt(text)

    # Call Groq AI
    try:
        ai_response = call_groq(prompt)
    except:
        ai_response = None  # if error happens, set to None

    # If AI fails, return fallback response
    if not ai_response:
        return jsonify({
            "description": "Unable to generate description",
            "risk_level": "medium",
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    # Convert AI string response into JSON
    try:
        parsed = json.loads(ai_response)
    except:
        return jsonify({
            "description": "Invalid AI response format",
            "risk_level": "medium",
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    # Final result to return
    result = {
        "description": parsed.get("description"),
        "risk_level": parsed.get("risk_level"),
        "generated_at": datetime.utcnow().isoformat()
    }

    # 🔹 Save result in cache for future use
    set_cache(text, result)

    # 🔹 Store response time for performance tracking
    response_times.append(time.time() - start)

    # Return final response
    return jsonify(result)