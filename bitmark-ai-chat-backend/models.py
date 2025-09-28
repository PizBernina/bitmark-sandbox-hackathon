"""Pydantic models for request/response handling."""

from typing import List, Dict, Any
from pydantic import BaseModel


class ChatMessage(BaseModel):
    """Represents a single chat message."""
    role: str  # "user" or "assistant" (mapped to "model" for Gemini API)
    content: str
    timestamp: str


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str
    conversation_history: List[ChatMessage] = []


class ToolUsage(BaseModel):
    """Model for tool usage information."""
    function_name: str
    status: str  # "starting", "in_progress", "completed", "error"
    emoji: str
    description: str
    start_time: str = None
    end_time: str = None

class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str
    success: bool
    error: str = None
    tools_used: List[Dict[str, Any]] = []
    tool_usage_indicators: List[ToolUsage] = []
    has_tool_usage: bool = False
