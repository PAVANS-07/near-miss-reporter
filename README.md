# AI Service — Near Miss Reporter

## Overview
This is the AI microservice for the Near Miss Reporter project.
It is built using Flask and integrates with the Groq API (LLaMA model) to generate:

* Incident descriptions
* Safety recommendations
* Full structured reports


##  Tech Stack
* Python 3.11
* Flask
* Groq API (LLaMA-3.3-70B)
* Redis (optional) / In-memory caching



## Project Structure

near-miss-reporter/
│-- routes/
│   ├── describe.py
│   ├── recommend.py
│   └── report.py
│-- services/
│   ├── groq_client.py
│   ├── cache.py
│   └── metrics.py
│-- prompts/
│   ├── describe.txt
│   ├── recommend.txt
│   └── report.txt
│-- app.py
│-- requirements.txt
│-- .env
```


## 🔑 Environment Variables
Create a `.env` file:
GROQ_API_KEY=your_api_key_here
```

## How to Run
1. Install dependencies:
pip install -r requirements.txt


2. Start the server:
python app.py

3. Server will run on:
http://127.0.0.1:5000

##  API Endpoints

### 1. POST /describe
**Request:**
json
{
  "text": "Worker slipped on wet floor"
}

**Response:**
json
{
  "description": "...",
  "risk_level": "medium",
  "generated_at": "..."
}



###  2. POST /recommend

**Request:**
json
{
  "text": "Loose electrical wires exposed"
}

**Response:**
json
{
  "recommendations": [
    {
      "action_type": "Immediate",
      "description": "...",
      "priority": "High"
    }
  ],
  "generated_at": "..."
}



###  3. POST /generate-report

**Request:**
json
{
  "text": "Worker slipped near machine"
}


**Response:**
json
{
  "title": "...",
  "summary": "...",
  "overview": "...",
  "key_items": [],
  "recommendations": [],
  "generated_at": "..."
}



###  4. GET /health

**Response:**
json
{
  "status": "ok",
  "model": "llama-3.3-70b-versatile",
  "uptime_seconds": 123,
  "avg_response_time": 1.2
}




##  Features

* AI-powered incident analysis
* Structured JSON responses
* Caching for faster responses
* Input validation and security
* Fallback handling for AI failures


## Error Handling

* Invalid input → 400 response
* AI failure → fallback response with `is_fallback: true`
* Timeout protection for API calls


##  Notes
* Redis caching is supported (optional)
* In-memory caching used if Redis is unavailable
* Designed for integration with Java backend


