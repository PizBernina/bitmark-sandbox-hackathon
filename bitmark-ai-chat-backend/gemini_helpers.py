"""Helper functions for Gemini API interactions."""

import os
from typing import List, Dict, Any, Tuple
from pathlib import Path
from google import genai
from google.genai import types

from models import ChatMessage
from tool_functions import execute_function_call


def load_system_instruction() -> str:
    """Load system instruction from file or environment variable."""
    # First try to load from file
    system_file = Path(__file__).parent / "context-prompts" / "system_instruction.txt"
    if system_file.exists():
        return system_file.read_text(encoding="utf-8").strip()
    
    # Fallback to environment variable
    return os.getenv("GEMINI_SYSTEM_INSTRUCTION", "")


def build_conversation_context(conversation_history: List[ChatMessage], current_message: str) -> List[types.Content]:
    """Build conversation context from history and current message."""
    context = []
    
    # Add conversation history
    for msg in conversation_history:
        gemini_role = "user" if msg.role == "user" else "model"
        context.append(
            types.Content(
                role=gemini_role,
                parts=[types.Part(text=msg.content)]
            )
        )
        print(f"Added to context - Role: {gemini_role}, Content: {msg.content[:100]}...")
    
    # Add current user message
    context.append(
        types.Content(
            role="user",
            parts=[types.Part(text=current_message)]
        )
    )
    print(f"Added current message - Content: {current_message[:100]}...")
    
    return context


def create_gemini_config(system_instruction: str, function_declarations: List[Dict[str, Any]]) -> types.GenerateContentConfig:
    """Create Gemini configuration with tools and system instruction."""
    tools = types.Tool(function_declarations=function_declarations)
    return types.GenerateContentConfig(
        tools=[tools],
        system_instruction=types.Content(
            parts=[types.Part(text=system_instruction)]
        )
    )


def create_simple_config(system_instruction: str) -> types.GenerateContentConfig:
    """Create simple Gemini configuration without tools."""
    return types.GenerateContentConfig(
        system_instruction=types.Content(
            parts=[types.Part(text=system_instruction)]
        )
    )


def extract_text_from_response(response) -> str:
    """Extract text content from Gemini response."""
    if not response.candidates or len(response.candidates) == 0:
        return ""
    
    candidate = response.candidates[0]
    if not candidate.content or not candidate.content.parts:
        return ""
    
    text_parts = []
    for part in candidate.content.parts:
        if hasattr(part, 'text') and part.text:
            text_parts.append(part.text)
    
    return "".join(text_parts)


async def handle_function_call(part: types.Part, conversation_context: List[types.Content], 
                             config: types.GenerateContentConfig, client, pane_content: Dict[str, str] = None, 
                             model: str = "gemini-2.5-pro") -> Tuple[str, List[Dict[str, Any]]]:
    """Handle a function call and return response text and tools used."""
    if not hasattr(part, 'function_call') or not part.function_call:
        return "", []
    
    function_name = part.function_call.name
    function_args = part.function_call.args
    
    print(f"Executing function: {function_name} with args: {function_args}")
    
    # Add pane content to function args if it's the playground function
    if function_name == "get_playground_panes_info" and pane_content:
        function_args["pane_content"] = pane_content
        print(f"Added pane content to function args: {pane_content}")
    
    # Execute the function
    result = execute_function_call(function_name, function_args)
    tools_used = [{"function": function_name, "args": function_args, "result": result}]
    
    # IMPORTANT: First add the model's function call to the conversation
    # This is required for the model to understand what it asked for
    conversation_context.append(
        types.Content(
            role="model",
            parts=[part]
        )
    )
    
    # Then add function response to conversation
    function_response_part = types.Part.from_function_response(
        name=function_name,
        response={"result": result}
    )
    
    conversation_context.append(
        types.Content(
            role="user",
            parts=[function_response_part]
        )
    )
    
    # Get final response with function result
    final_response = await client.aio.models.generate_content(
        model=model,
        contents=conversation_context,
        config=config
    )
    
    # Extract text from final response
    response_text = extract_text_from_response(final_response)
    return response_text, tools_used


async def process_gemini_response(response, conversation_context: List[types.Content], 
                                config: types.GenerateContentConfig, client, pane_content: Dict[str, str] = None,
                                model: str = "gemini-2.5-pro") -> Tuple[str, List[Dict[str, Any]]]:
    """Process Gemini response and handle function calls if present."""
    if not response.candidates or len(response.candidates) == 0:
        return "", []
    
    candidate = response.candidates[0]
    if not candidate.content or not candidate.content.parts:
        return "", []
    
    response_text = ""
    tools_used = []
    function_call_found = False
    
    for i, part in enumerate(candidate.content.parts):
        print(f"Processing part {i}: {type(part)}")
        print(f"Part attributes: {dir(part)}")
        if hasattr(part, 'text') and part.text:
            print(f"Text part found: {part.text[:100]}...")
            response_text += part.text
        elif hasattr(part, 'function_call') and part.function_call:
            function_call_found = True
            print(f"Function call detected: {part.function_call.name}")
            print(f"Function call args: {part.function_call.args}")
            
            # Handle function call
            func_response, func_tools = await handle_function_call(part, conversation_context, config, client, pane_content, model)
            response_text = func_response
            tools_used.extend(func_tools)
            break
        else:
            print(f"Part {i} is neither text nor function call")
    
    # If no function call found, try simple response
    if not function_call_found and not response_text:
        print("No function call found, trying simple response...")
        simple_config = create_simple_config(config.system_instruction.parts[0].text)
        simple_response = await client.aio.models.generate_content(
            model=model,
            contents=conversation_context,
            config=simple_config
        )
        response_text = extract_text_from_response(simple_response)
    
    print(f"Final response text: {response_text[:100]}...")
    return response_text, tools_used
