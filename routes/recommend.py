from flask import Blueprint, request, jsonify
from datetime import datetime
from services.groq_client import call_groq
from services.cache import get_from_cache, set_cache
from services.metrics import response_times
import json
import time

recommend_bp = Blueprint("recommend", __name__)


def load_prompt(text):
    with open("prompts/recommend.txt", "r") as f:
        template = f.read()
    return template.replace("{input}", text)


@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    start = time.time()

    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400

    text = data["text"]

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
            "recommendations": [],
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    try:
        parsed = json.loads(ai_response)
    except:
        return jsonify({
            "recommendations": [],
            "is_fallback": True,
            "generated_at": datetime.utcnow().isoformat()
        })

    result = {
        "recommendations": parsed,
        "generated_at": datetime.utcnow().isoformat()
    }

    set_cache(text, result)

    response_times.append(time.time() - start)

    return jsonify(result)