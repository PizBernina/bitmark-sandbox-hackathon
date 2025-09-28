import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

# Import our helper modules
from models import ChatRequest, ChatResponse
from tool_functions import get_function_declarations
from gemini_helpers import (
    load_system_instruction,
    build_conversation_context,
    create_gemini_config,
    process_gemini_response
)

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

# Initialize Gemini client
MODEL = "gemini-live-2.5-flash" #-preview
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is required")

client = genai.Client(api_key=api_key)

# Load system instruction
SYSTEM_INSTRUCTION = load_system_instruction()

@app.get("/")
async def root():
    return {"message": "Bitmark AI Chat Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    """Send a message to Gemini and get a response using function calling."""
    try:
        # Build conversation context
        conversation_context = build_conversation_context(
            request.conversation_history, 
            request.message
        )
        
        # Create Gemini configuration
        config = create_gemini_config(SYSTEM_INSTRUCTION, get_function_declarations())
        
        # Get response from Gemini
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=conversation_context,
            config=config
        )
        
        # Process response and handle function calls
        response_text, tools_used = await process_gemini_response(
            response, conversation_context, config, client
        )
        
        return ChatResponse(
            response=response_text,
            success=True,
            tools_used=tools_used
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
