"""Tool functions for Gemini function calling."""

import json
from typing import Dict, Any
from pathlib import Path


def get_bitmark_general_info(topic: str = "overview") -> Dict[str, Any]:
    """
    Retrieve general information about Bitmark from parsed markdown files.
    
    Args:
        topic: The specific topic to retrieve (overview, hackathon, taskpool, team, blog, sandbox)
    
    Returns:
        Dictionary containing the requested information
    """
    try:
        info_dir = Path(__file__).parent / "context-prompts" / "general_info_bitmark"
        
        # Map topics to files
        topic_files = {
            "overview": "bitmark-association.org_20250928_120659_home.md",
            "hackathon": "bitmark-association.org_20250928_120850_bitmark_hackathon.md",
            "taskpool": "bitmark-association.org_20250928_120923_open_task_pool.md",
            "team": "bitmark-association.org_20250928_120958_team.md",
            "blog": "bitmark-association.org_20250928_121039_blog.md",
            "sandbox": "bitmark-association.org_20250928_120739_sandbox_bit_challenge.md"
        }
        
        if topic not in topic_files:
            return {"error": f"Unknown topic: {topic}. Available topics: {list(topic_files.keys())}"}
        
        file_path = info_dir / topic_files[topic]
        if not file_path.exists():
            return {"error": f"File not found: {file_path}"}
        
        content = file_path.read_text(encoding="utf-8")
        
        return {
            "topic": topic,
            "content": content,
            "source": f"https://www.bitmark-association.org/",
            "success": True
        }
        
    except Exception as e:
        return {"error": f"Failed to retrieve information: {str(e)}", "success": False}


def get_bitmark_code_info(code_type: str = "syntax") -> Dict[str, Any]:
    """
    Retrieve information about Bitmark code, syntax, and technical details.
    
    Args:
        code_type: Type of code information (syntax, examples, parser, etc.)
    
    Returns:
        Dictionary containing the requested code information
    """
    # This will be implemented later with actual code examples
    return {
        "code_type": code_type,
        "message": "Code information retrieval not yet implemented",
        "success": False
    }


def get_user_input_info(input_type: str = "general") -> Dict[str, Any]:
    """
    Retrieve information about user input handling in Bitmark.
    
    Args:
        input_type: Type of input information (forms, validation, etc.)
    
    Returns:
        Dictionary containing the requested input information
    """
    # This will be implemented later
    return {
        "input_type": input_type,
        "message": "User input information retrieval not yet implemented",
        "success": False
    }


def get_function_declarations():
    """Get function declarations for Gemini tools."""
    return [
        {
            "name": "get_bitmark_general_info",
            "description": "Retrieve general information about Bitmark from the official website content",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "topic": {
                        "type": "STRING",
                        "description": "The specific topic to retrieve information about",
                        "enum": ["overview", "hackathon", "taskpool", "team", "blog", "sandbox"]
                    }
                },
                "required": ["topic"]
            }
        },
        {
            "name": "get_bitmark_code_info",
            "description": "Retrieve information about Bitmark code, syntax, and technical details",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "code_type": {
                        "type": "STRING",
                        "description": "Type of code information to retrieve",
                        "enum": ["syntax", "examples", "parser", "ui_renderer"]
                    }
                },
                "required": ["code_type"]
            }
        },
        {
            "name": "get_user_input_info",
            "description": "Retrieve information about user input handling in Bitmark",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "input_type": {
                        "type": "STRING",
                        "description": "Type of input information to retrieve",
                        "enum": ["forms", "validation", "interactive_elements"]
                    }
                },
                "required": ["input_type"]
            }
        }
    ]


def execute_function_call(function_name: str, function_args: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a function call and return the result."""
    function_map = {
        "get_bitmark_general_info": get_bitmark_general_info,
        "get_bitmark_code_info": get_bitmark_code_info,
        "get_user_input_info": get_user_input_info
    }
    
    if function_name not in function_map:
        return {"error": f"Unknown function: {function_name}", "success": False}
    
    try:
        return function_map[function_name](**function_args)
    except Exception as e:
        return {"error": f"Function execution failed: {str(e)}", "success": False}
