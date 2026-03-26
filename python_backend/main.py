import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env.local")

app = FastAPI(title="StudentOS AI Pedagogy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "PLACEHOLDER_GEMINI_API_KEY":
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: Gemini API Key is missing or invalid placeholder.")

model = genai.GenerativeModel('gemini-1.5-pro')

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

SOCRATIC_PROMPT = """
You are an elite Socratic Tutor applying the Feynman Technique. 
CRITICAL RULES:
1. NEVER give direct answers or exact solutions to problems. 
2. Ask leading questions to guide the student to the answer.
3. If the user presents math, you MUST format any mathematical output strictly in LaTeX using $ for inline and $$ for block equations.
"""

@app.post("/api/tutor/chat")
async def socratic_chat(request: ChatRequest):
    try:
        history = [{"role": "user" if m.role == "user" else "model", "parts": [m.content]} for m in request.messages[:-1]]
        chat = model.start_chat(history=history)
        
        latest = request.messages[-1].content
        injected_prompt = f"{SOCRATIC_PROMPT}\n\nStudent says: {latest}"
        
        response = chat.send_message(injected_prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
