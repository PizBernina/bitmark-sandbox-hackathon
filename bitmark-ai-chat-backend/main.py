import asyncio
import os
import json
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables from parent directory
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Bitmark AI Chat Backend", version="1.0.0")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3010"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    success: bool
    error: str = None

# Initialize Gemini client
MODEL = "gemini-2.0-flash-exp"
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is required")

client = genai.Client(api_key=api_key)

@app.get("/")
async def root():
    return {"message": "Bitmark AI Chat Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    """
    Send a message to Gemini and get a response
    """
    try:
        config = {
            "response_modalities": ["TEXT"]
        }
        
        # Create conversation context from history
        conversation_context = []
        for msg in request.conversation_history:
            conversation_context.append({
                "role": msg.role,
                "parts": [{"text": msg.content}]
            })
        
        # Add current user message
        conversation_context.append({
            "role": "user", 
            "parts": [{"text": request.message}]
        })
        
        # Use the generate content API instead of live API for now
        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=conversation_context
        )
        
        response_text = ""
        if response.candidates and len(response.candidates) > 0:
            candidate = response.candidates[0]
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if hasattr(part, 'text') and part.text:
                        response_text += part.text
            
            return ChatResponse(
                response=response_text,
                success=True
            )
            
    except Exception as e:
        print(f"Error in chat_with_gemini: {str(e)}")
        return ChatResponse(
            response="",
            success=False,
            error=f"Failed to get response from Gemini: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
