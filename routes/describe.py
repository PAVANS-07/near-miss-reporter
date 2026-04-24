from flask import Blueprint, request, jsonify
from datetime import datetime
from services.groq_client import call_groq
import json

# Blueprint for describe API
describe_bp = Blueprint("describe", __name__)


#  Function to load prompt template and replace {input}
def load_prompt(text):
    with open("prompts/describe.txt", "r") as f:
        template = f.read()
    return template.replace("{input}", text)


#  POST /describe endpoint
@describe_bp.route("/describe", methods=["POST"])
def describe():
    # Get JSON data from request
    data = request.get_json()

    # Validate input
    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400

    text = data["text"]

    # Load prompt and inject user input
    prompt = load_prompt(text)

    # Call Groq AI service
    try:
        ai_response = call_groq(prompt)
    except Exception as e:
        ai_response = None  # fallback if error occurs

    #  Fallback response if AI fails
    if not ai_response:
        return jsonify({
            "description": "Unable to generate description",
            "risk_level": "medium",
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    # Convert AI string response → JSON object
    try:
        parsed = json.loads(ai_response)
    except Exception:
        # Fallback if AI returns invalid JSON
        return jsonify({
            "description": "Invalid AI response format",
            "risk_level": "medium",
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    #  Final clean response (what frontend/backend expects)
    return jsonify({
        "description": parsed.get("description"),
        "risk_level": parsed.get("risk_level"),
        "generated_at": datetime.utcnow().isoformat()
    })