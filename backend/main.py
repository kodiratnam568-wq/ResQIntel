import os
import json
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq


# Load backend/.env
load_dotenv(Path(__file__).resolve().parent / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not configured.")


app = FastAPI(
    title="ResQIntel AI",
    version="1.0.0",
    description="AI-Powered Emergency Response Intelligence Platform",
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = Groq(api_key=GROQ_API_KEY)


class IncidentReport(BaseModel):
    report: str


@app.get("/")
def home():
    return {
        "message": "ResQIntel AI Backend is running!",
        "status": "online"
    }


@app.get("/health")
def health():
    return "ResQIntel AI backend healthy"


@app.post("/analyze")
def analyze_incident(data: IncidentReport):

    if not data.report.strip():
        raise HTTPException(
            status_code=400,
            detail="Incident report cannot be empty."
        )

    prompt = f"""
You are ResQIntel AI, an emergency response intelligence assistant.

Analyze the emergency report below and return ONLY valid JSON.

Required JSON structure:

{{
  "incident_type": "...",
  "location": "...",
  "people_at_risk": "...",
  "potential_hazards": "...",
  "urgency": "Low | Medium | High | Critical",
  "missing_information": "...",
  "response_brief": "..."
}}

Rules:
- Do not invent facts.
- If information is unavailable, say "Not specified".
- Keep the response concise.
- Urgency must be based only on the information in the report.
- This is decision-support intelligence, not a replacement for trained emergency responders.

Emergency report:
{data.report}
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise emergency incident intelligence analyzer. Return valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=800,
        )

        raw = response.choices[0].message.content.strip()

        # Remove markdown fences if the model adds them
        if raw.startswith("```"):
            raw = raw.replace("```json", "", 1)
            raw = raw.replace("```", "")
            raw = raw.strip()

        result = json.loads(raw)

        return {
            "success": True,
            "incident": result,
            "original_report": data.report
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid analysis format."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )
