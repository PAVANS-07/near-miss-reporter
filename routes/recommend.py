from flask import Blueprint, request, jsonify
from datetime import datetime
from services.groq_client import call_groq
import json

recommend_bp = Blueprint("recommend", __name__)


def load_prompt(text):
    with open("prompts/recommend.txt", "r") as f:
        template = f.read()
    return template.replace("{input}", text)


@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400

    text = data["text"]

    prompt = load_prompt(text)

    try:
        ai_response = call_groq(prompt)
    except Exception:
        ai_response = None

    # Fallback
    if not ai_response:
        return jsonify({
            "recommendations": [],
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    # Convert string → JSON
    try:
        parsed = json.loads(ai_response)
    except Exception:
        return jsonify({
            "recommendations": [],
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    return jsonify({
        "recommendations": parsed,
        "generated_at": datetime.utcnow().isoformat()
    })