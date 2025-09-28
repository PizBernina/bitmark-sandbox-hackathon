"""Tool functions for Gemini function calling."""

import json
from typing import Dict, Any, List
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


def get_user_input_info(input_type: str = "general", pane_content: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Retrieve information about user input handling in Bitmark and troubleshoot input issues.
    
    Args:
        input_type: Type of input information (forms, validation, interactive_elements, troubleshooting)
        pane_content: Optional content from the 4 playground panes for troubleshooting
    
    Returns:
        Dictionary containing the requested input information and troubleshooting results
    """
    try:
        if input_type == "troubleshooting" and pane_content:
            return _troubleshoot_input_issues(pane_content)
        elif input_type == "interactive_elements":
            return _get_interactive_elements_info()
        elif input_type == "validation":
            return _get_validation_info()
        elif input_type == "forms":
            return _get_forms_info()
        else:
            return _get_general_input_info()
    except Exception as e:
        return {
            "input_type": input_type,
            "error": f"Failed to retrieve input information: {str(e)}",
            "success": False
        }

def _troubleshoot_input_issues(pane_content: Dict[str, Any]) -> Dict[str, Any]:
    """Troubleshoot input issues based on pane content."""
    issues = []
    suggestions = []
    
    # Check bitmark markup pane
    bitmark_markup = pane_content.get("bitmark_markup", "")
    if bitmark_markup:
        markup_issues = _analyze_bitmark_markup(bitmark_markup)
        issues.extend(markup_issues)
    
    # Check JSON pane
    json_content = pane_content.get("json_content", "")
    if json_content:
        json_issues = _analyze_json_content(json_content)
        issues.extend(json_issues)
    
    # Check rendered UI pane
    rendered_ui = pane_content.get("rendered_ui", "")
    if rendered_ui:
        ui_issues = _analyze_rendered_ui(rendered_ui)
        issues.extend(ui_issues)
    
    # Check sandbox pane
    sandbox_content = pane_content.get("sandbox_content", "")
    if sandbox_content:
        sandbox_issues = _analyze_sandbox_content(sandbox_content)
        issues.extend(sandbox_issues)
    
    # Generate suggestions based on issues
    if issues:
        suggestions = _generate_troubleshooting_suggestions(issues)
    
    return {
        "input_type": "troubleshooting",
        "pane_content_analyzed": True,
        "issues_found": issues,
        "suggestions": suggestions,
        "success": True
    }

def _analyze_bitmark_markup(markup: str) -> List[Dict[str, Any]]:
    """Analyze bitmark markup for common input issues."""
    issues = []
    
    # Check for common syntax issues
    if "[_]" in markup and "[_answer]" not in markup:
        issues.append({
            "type": "syntax_error",
            "pane": "bitmark_markup",
            "issue": "Empty cloze placeholder found",
            "description": "Found [_] without content. Use [_answer] format.",
            "severity": "error"
        })
    
    # Check for malformed multiple choice
    if "[-" in markup and "[+" not in markup:
        issues.append({
            "type": "syntax_error", 
            "pane": "bitmark_markup",
            "issue": "Incomplete multiple choice syntax",
            "description": "Found [-option] without [+correct] option",
            "severity": "error"
        })
    
    # Check for unclosed brackets
    open_brackets = markup.count("[") - markup.count("]")
    if open_brackets > 0:
        issues.append({
            "type": "syntax_error",
            "pane": "bitmark_markup", 
            "issue": "Unclosed brackets",
            "description": f"Found {open_brackets} unclosed bracket(s)",
            "severity": "error"
        })
    
    return issues

def _analyze_json_content(json_content: str) -> List[Dict[str, Any]]:
    """Analyze JSON content for parsing issues."""
    issues = []
    
    try:
        import json
        parsed = json.loads(json_content)
        
        # Check for empty content
        if not parsed or len(parsed) == 0:
            issues.append({
                "type": "content_issue",
                "pane": "json",
                "issue": "Empty JSON content",
                "description": "No bitmark content found in JSON",
                "severity": "warning"
            })
        
        # Check for parsing errors in individual bits
        for i, bit in enumerate(parsed):
            if "error" in bit:
                issues.append({
                    "type": "parsing_error",
                    "pane": "json",
                    "issue": f"Bit {i} parsing error",
                    "description": bit.get("error", "Unknown parsing error"),
                    "severity": "error"
                })
    
    except json.JSONDecodeError as e:
        issues.append({
            "type": "json_error",
            "pane": "json",
            "issue": "Invalid JSON format",
            "description": str(e),
            "severity": "error"
        })
    
    return issues

def _analyze_rendered_ui(rendered_ui: str) -> List[Dict[str, Any]]:
    """Analyze rendered UI for display issues."""
    issues = []
    
    # Check for empty rendered content
    if not rendered_ui or rendered_ui.strip() == "":
        issues.append({
            "type": "rendering_issue",
            "pane": "rendered_ui",
            "issue": "Empty rendered content",
            "description": "No content rendered in UI pane",
            "severity": "warning"
        })
    
    # Check for error messages in rendered content
    if "error" in rendered_ui.lower() or "undefined" in rendered_ui.lower():
        issues.append({
            "type": "rendering_error",
            "pane": "rendered_ui",
            "issue": "Rendering error detected",
            "description": "Error or undefined content found in rendered UI",
            "severity": "error"
        })
    
    return issues

def _analyze_sandbox_content(sandbox_content: str) -> List[Dict[str, Any]]:
    """Analyze sandbox content for issues."""
    issues = []
    
    # Check for empty sandbox content
    if not sandbox_content or sandbox_content.strip() == "":
        issues.append({
            "type": "sandbox_issue",
            "pane": "sandbox",
            "issue": "Empty sandbox content",
            "description": "No content in sandbox pane",
            "severity": "info"
        })
    
    return issues

def _generate_troubleshooting_suggestions(issues: List[Dict[str, Any]]) -> List[str]:
    """Generate troubleshooting suggestions based on found issues."""
    suggestions = []
    
    for issue in issues:
        if issue["type"] == "syntax_error":
            if "Empty cloze placeholder" in issue["issue"]:
                suggestions.append("Fix empty cloze placeholders by adding content: [_answer] instead of [_]")
            elif "Incomplete multiple choice" in issue["issue"]:
                suggestions.append("Complete multiple choice syntax: [-wrong][+correct]")
            elif "Unclosed brackets" in issue["issue"]:
                suggestions.append("Check for missing closing brackets ] in your bitmark syntax")
        
        elif issue["type"] == "json_error":
            suggestions.append("Fix JSON syntax errors in the JSON pane")
        
        elif issue["type"] == "rendering_error":
            suggestions.append("Check the bitmark markup syntax - rendering errors usually indicate syntax issues")
    
    return suggestions

def _get_interactive_elements_info() -> Dict[str, Any]:
    """Get information about interactive elements in Bitmark."""
    return {
        "input_type": "interactive_elements",
        "content": {
            "cloze": {
                "syntax": "[_answer]",
                "description": "Fill-in-the-blank questions",
                "example": "The students completed the [_assignment] with the correct verb forms."
            },
            "multiple_choice": {
                "syntax": "[-wrong][+correct]",
                "description": "Multiple choice questions",
                "example": "What color are violets? [-red][+blue][-green]"
            },
            "cloze_and_multiple_choice": {
                "syntax": "Roses are [_red], violets are [-green][+blue][-yellow]",
                "description": "Combined cloze and multiple choice",
                "example": "Roses are [_red], violets are [-green][+blue][-yellow]"
            }
        },
        "success": True
    }

def _get_validation_info() -> Dict[str, Any]:
    """Get information about input validation in Bitmark."""
    return {
        "input_type": "validation",
        "content": {
            "common_validation_rules": [
                "Cloze placeholders must have content: [_answer] not [_]",
                "Multiple choice must have at least one correct answer: [+correct]",
                "All brackets must be properly closed",
                "Bit types must be valid: [.cloze], [.multiple-choice], etc."
            ],
            "validation_errors": [
                "Syntax errors in bitmark markup",
                "Invalid bit types",
                "Malformed interactive elements",
                "Unclosed brackets or parentheses"
            ]
        },
        "success": True
    }

def _get_forms_info() -> Dict[str, Any]:
    """Get information about forms in Bitmark."""
    return {
        "input_type": "forms",
        "content": {
            "form_elements": [
                "Cloze inputs for text entry",
                "Multiple choice dropdowns",
                "Checkbox groups",
                "Radio button groups"
            ],
            "form_validation": [
                "Required field validation",
                "Format validation for specific input types",
                "Custom validation rules"
            ]
        },
        "success": True
    }

def _get_general_input_info() -> Dict[str, Any]:
    """Get general information about user input in Bitmark."""
    return {
        "input_type": "general",
        "content": {
            "overview": "Bitmark supports various interactive input elements for creating engaging educational content",
            "supported_inputs": [
                "Text input (cloze)",
                "Multiple choice selection",
                "Combined cloze and multiple choice",
                "Custom form elements"
            ],
            "troubleshooting_tips": [
                "Check bitmark syntax in the markup pane",
                "Verify JSON parsing in the JSON pane", 
                "Review rendered output in the UI pane",
                "Use the sandbox for testing complex interactions"
            ]
        },
        "success": True
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
            "description": "Retrieve information about user input handling in Bitmark and troubleshoot input issues",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "input_type": {
                        "type": "STRING",
                        "description": "Type of input information to retrieve",
                        "enum": ["forms", "validation", "interactive_elements", "troubleshooting", "general"]
                    },
                    "pane_content": {
                        "type": "OBJECT",
                        "description": "Optional content from the 4 playground panes for troubleshooting",
                        "properties": {
                            "bitmark_markup": {
                                "type": "STRING",
                                "description": "Content from the bitmark markup pane (top-left)"
                            },
                            "json_content": {
                                "type": "STRING", 
                                "description": "Content from the JSON pane (top-right)"
                            },
                            "rendered_ui": {
                                "type": "STRING",
                                "description": "Content from the rendered UI pane (bottom-left)"
                            },
                            "sandbox_content": {
                                "type": "STRING",
                                "description": "Content from the sandbox pane (bottom-right)"
                            }
                        }
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
