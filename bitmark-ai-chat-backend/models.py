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


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str
    success: bool
    error: str = None
    tools_used: List[Dict[str, Any]] = []
