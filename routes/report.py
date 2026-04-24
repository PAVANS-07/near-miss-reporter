from flask import Blueprint, request, jsonify
from datetime import datetime
from services.groq_client import call_groq
import json

#  Create a blueprint for report API
report_bp = Blueprint("report", __name__)


#  Load prompt file and replace {input} with user text
def load_prompt(text):
    with open("prompts/report.txt", "r") as f:
        template = f.read()
    return template.replace("{input}", text)


#  POST /generate-report endpoint
@report_bp.route("/generate-report", methods=["POST"])
def generate_report():
    # Get JSON data from request
    data = request.get_json()

    # Check if input text is present
    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400

    text = data["text"]

    # Load prompt and insert user input
    prompt = load_prompt(text)

    # Call Groq AI
    try:
        ai_response = call_groq(prompt)
    except Exception:
        ai_response = None  # If error happens, set response to None

    # Fallback if AI fails or returns nothing
    if not ai_response:
        return jsonify({
            "title": "Report unavailable",
            "summary": "",
            "overview": "",
            "key_items": [],
            "recommendations": [],
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    # Convert AI string response into JSON
    try:
        parsed = json.loads(ai_response)
    except Exception:
        # If AI response is not valid JSON, return fallback
        return jsonify({
            "title": "Invalid AI response",
            "summary": "",
            "overview": "",
            "key_items": [],
            "recommendations": [],
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    # Final clean response sent to client
    return jsonify({
        "title": parsed.get("title"),
        "summary": parsed.get("summary"),
        "overview": parsed.get("overview"),
        "key_items": parsed.get("key_items"),
        "recommendations": parsed.get("recommendations"),
        "generated_at": datetime.utcnow().isoformat()
    })