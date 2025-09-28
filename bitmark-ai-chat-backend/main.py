import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

# Import our helper modules
from models import ChatRequest, ChatResponse, ToolUsage
from tool_functions import get_function_declarations
from gemini_helpers import (
    load_system_instruction,
    build_conversation_context,
    create_gemini_config,
    process_gemini_response
)
from tool_usage_tracker import create_tool_usage_indicators

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

@app.get("/tool-animations/css")
async def get_tool_animations_css():
    """Get CSS for tool usage animations."""
    from tool_usage_tracker import get_tool_animation_css
    return {"css": get_tool_animation_css()}

@app.get("/tool-animations/js")
async def get_tool_animations_js():
    """Get JavaScript for tool usage animations."""
    from tool_usage_tracker import get_tool_animation_js
    return {"js": get_tool_animation_js()}

@app.post("/debug-conversation")
async def debug_conversation(request: ChatRequest):
    """Debug endpoint to see conversation history processing."""
    print("=== DEBUG CONVERSATION ===")
    print(f"Number of history messages: {len(request.conversation_history)}")
    
    for i, msg in enumerate(request.conversation_history):
        print(f"Message {i}: Role={msg.role}, Content={msg.content[:50]}...")
    
    print(f"Current message: {request.message}")
    
    # Build conversation context
    conversation_context = build_conversation_context(
        request.conversation_history, 
        request.message
    )
    
    print(f"Built context with {len(conversation_context)} messages")
    for i, ctx in enumerate(conversation_context):
        role = ctx.role
        content = ctx.parts[0].text if ctx.parts else "No content"
        print(f"Context {i}: Role={role}, Content={content[:50]}...")
    
    return {
        "history_count": len(request.conversation_history),
        "context_count": len(conversation_context),
        "current_message": request.message
    }

@app.post("/test-tool-animations")
async def test_tool_animations():
    """Test endpoint to verify tool usage indicators work."""
    # Create test tool usage indicators
    test_tool_usage_indicators = [
        ToolUsage(
            function_name="get_bitmark_general_info",
            status="completed",
            emoji="📚",
            description="Looking up Bitmark information",
            start_time=datetime.now().isoformat(),
            end_time=datetime.now().isoformat()
        )
    ]
    
    test_tools_used = [
        {
            "function": "get_bitmark_general_info",
            "args": {"topic": "team"},
            "result": {"success": True, "content": "Test content"}
        }
    ]
    
    return ChatResponse(
        response="This is a test response with tool usage indicators!",
        success=True,
        tools_used=test_tools_used,
        tool_usage_indicators=test_tool_usage_indicators,
        has_tool_usage=True
    )

@app.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    """Send a message to Gemini and get a response using function calling."""
    try:
        print(f"Received request with {len(request.conversation_history)} history messages")
        print(f"Current message: {request.message[:100]}...")
        print(f"Pane content: {request.pane_content}")
        
        # Build conversation context
        conversation_context = build_conversation_context(
            request.conversation_history, 
            request.message
        )
        
        print(f"Built conversation context with {len(conversation_context)} messages")
        
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
            response, conversation_context, config, client, request.pane_content
        )
        
        # Create tool usage indicators
        tool_usage_indicators = create_tool_usage_indicators(tools_used)
        has_tool_usage = len(tools_used) > 0
        
        print(f"Returning response: {response_text[:100]}...")
        print(f"Tools used: {len(tools_used)}")
        print(f"Tool usage indicators: {len(tool_usage_indicators)}")
        print(f"Has tool usage: {has_tool_usage}")
        print(f"Tool usage indicators details: {tool_usage_indicators}")
        
        return ChatResponse(
            response=response_text,
            success=True,
            tools_used=tools_used,
            tool_usage_indicators=tool_usage_indicators,
            has_tool_usage=has_tool_usage
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
