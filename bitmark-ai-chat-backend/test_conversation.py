#!/usr/bin/env python3
"""Test script to verify conversation history handling."""

import asyncio
import json
from models import ChatMessage, ChatRequest

# Test data
def create_test_conversation():
    """Create a test conversation with history."""
    history = [
        ChatMessage(
            role="user",
            content="Hello, I'm interested in learning about Bitmark.",
            timestamp="2024-01-01T10:00:00Z"
        ),
        ChatMessage(
            role="assistant", 
            content="Hello! I'd be happy to help you learn about Bitmark. Bitmark is a digital property system that enables you to own and transfer digital assets. What specific aspect of Bitmark would you like to know more about?",
            timestamp="2024-01-01T10:00:30Z"
        ),
        ChatMessage(
            role="user",
            content="Can you tell me about the hackathon?",
            timestamp="2024-01-01T10:01:00Z"
        ),
        ChatMessage(
            role="assistant",
            content="The Bitmark Hackathon is an exciting event where developers can showcase their skills and creativity. It's a great opportunity to work on innovative projects and connect with the Bitmark community.",
            timestamp="2024-01-01T10:01:30Z"
        )
    ]
    
    return ChatRequest(
        message="What about the team behind Bitmark?",
        conversation_history=history
    )

def test_conversation_building():
    """Test the conversation context building."""
    from gemini_helpers import build_conversation_context
    
    request = create_test_conversation()
    
    print("=== TESTING CONVERSATION BUILDING ===")
    print(f"History messages: {len(request.conversation_history)}")
    print(f"Current message: {request.message}")
    
    # Build conversation context
    context = build_conversation_context(
        request.conversation_history,
        request.message
    )
    
    print(f"\nBuilt context with {len(context)} messages:")
    for i, ctx in enumerate(context):
        role = ctx.role
        content = ctx.parts[0].text if ctx.parts else "No content"
        print(f"  {i}: {role} - {content[:100]}...")
    
    return context

if __name__ == "__main__":
    test_conversation_building()
