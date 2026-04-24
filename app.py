from flask import Flask
from dotenv import load_dotenv

load_dotenv()

# 🔹 Import both blueprints
from routes.describe import describe_bp
from routes.recommend import recommend_bp  
from routes.report import report_bp

app = Flask(__name__)

# 🔹 Register both routes
app.register_blueprint(describe_bp)
app.register_blueprint(recommend_bp) 
app.register_blueprint(report_bp)     


@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(port=5000, debug=True)