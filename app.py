from flask import Flask
from dotenv import load_dotenv
import time

load_dotenv()

# 🔹 Import blueprints
from routes.describe import describe_bp
from routes.recommend import recommend_bp
from routes.report import report_bp

# 🔹 Import metrics
from services.metrics import START_TIME, response_times

app = Flask(__name__)

# 🔹 Register routes
app.register_blueprint(describe_bp)
app.register_blueprint(recommend_bp)
app.register_blueprint(report_bp)


# 🔐 SECURITY HEADERS (IMPORTANT)
@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response


# 🔹 Health endpoint
@app.route("/health")
def health():
    uptime = time.time() - START_TIME

    avg_time = (
        sum(response_times) / len(response_times)
        if response_times else 0
    )

    return {
        "status": "ok",
        "model": "llama-3.3-70b-versatile",
        "uptime_seconds": round(uptime, 2),
        "avg_response_time": round(avg_time, 2)
    }


if __name__ == "__main__":
    app.run(port=5000, debug=True)