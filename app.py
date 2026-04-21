# Import Flask class from flask package
from flask import Flask

# Create an instance of the Flask application
app = Flask(__name__)

# Define a route (API endpoint) for "/health"
@app.route("/health")
def health():
    """
    Health check endpoint.
    When this URL is accessed, it returns a simple JSON response
    indicating that the service is up and running.
    """
    return {"status": "ok"}  # JSON response

if __name__ == "__main__":
    app.run(port=5000, debug=True)