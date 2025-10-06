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


def get_code_access_info(code_type: str = "parser", file_path: str = None, function_name: str = None) -> Dict[str, Any]:
    """
    Access and analyze the actual running code in the backend, including bitmark-parser-generator, bitmark-ui-renderer, and bitmark-playground.
    Use this when users ask about implementation details, code structure, or need to understand how specific functions work.
    
    Args:
        code_type: Type of code to access (parser, ui_renderer, playground, specific_file, function_implementation)
        file_path: Specific file path to analyze (optional)
        function_name: Specific function to examine (optional)
    
    Returns:
        Dictionary containing code analysis and implementation details
    """
    try:
        if code_type == "parser":
            return _get_parser_code_info()
        elif code_type == "ui_renderer":
            return _get_ui_renderer_code_info()
        elif code_type == "playground":
            return _get_playground_code_info()
        elif code_type == "specific_file" and file_path:
            return _get_specific_file_info(file_path)
        elif code_type == "function_implementation" and function_name:
            return _get_function_implementation(function_name)
        else:
            return _get_general_code_info()
    except Exception as e:
        return {
            "code_type": code_type,
            "error": f"Failed to access code information: {str(e)}",
            "success": False
        }

def get_playground_panes_info(input_type: str = "general", pane_content: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Access and analyze the 4 playground panes (Bitmark markup, JSON, Rendered UI, Sandbox) to help users with their Bitmark content.
    Use this when users ask about their input, want to check their Bitmark markup, need help with errors, or want to analyze their content.
    
    Args:
        input_type: Type of analysis to perform (markup_analysis, error_check, content_review, troubleshooting, general)
        pane_content: Content from the 4 playground panes: input_json_or_bitmark_pane, json_content, rendered_ui_pane, sandbox_output_pane
    
    Returns:
        Dictionary containing analysis results and suggestions for the user's Bitmark content
    """
    try:
        if input_type == "troubleshooting":
            if pane_content:
                return _troubleshoot_input_issues(pane_content)
            else:
                return {
                    "input_type": "troubleshooting",
                    "message": "No playground content provided for troubleshooting. Please ensure the playground panes are accessible.",
                    "suggestions": ["Check if the playground is loaded and has content in the panes"],
                    "success": False
                }
        elif input_type == "markup_analysis":
            if pane_content:
                return _analyze_bitmark_markup(pane_content.get("input_json_or_bitmark_pane", ""))
            else:
                return {
                    "input_type": "markup_analysis",
                    "message": "No playground content provided for markup analysis. I need access to the Bitmark markup pane to analyze your content.",
                    "suggestions": ["Please ensure the playground is loaded and has Bitmark markup in the top-left pane"],
                    "success": False
                }
        elif input_type == "error_check":
            if pane_content:
                return _check_for_errors(pane_content)
            else:
                return {
                    "input_type": "error_check",
                    "message": "No playground content provided for error checking. I need access to all playground panes to check for errors.",
                    "suggestions": ["Please ensure the playground is loaded and accessible"],
                    "success": False
                }
        elif input_type == "content_review":
            if pane_content:
                return _review_content(pane_content)
            else:
                return {
                    "input_type": "content_review",
                    "message": "No playground content provided for content review. I need access to the playground panes to review your content.",
                    "suggestions": ["Please ensure the playground is loaded and has content"],
                    "success": False
                }
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
            "error": f"Failed to retrieve playground panes information: {str(e)}",
            "success": False
        }

def _analyze_bitmark_markup(bitmark_markup: str) -> Dict[str, Any]:
    """Analyze Bitmark markup content for issues and suggestions."""
    if not bitmark_markup.strip():
        return {
            "input_type": "markup_analysis",
            "message": "No Bitmark markup found in the playground",
            "suggestions": ["Please add some Bitmark markup to the top-left pane to analyze"],
            "success": False
        }
    
    issues = []
    suggestions = []
    
    # Check for common issues and typos
    if "[.close]" in bitmark_markup:
        issues.append("❌ TYPO DETECTED: '[.close]' should be '[.cloze]'")
        suggestions.append("Fix the typo: change '[.close]' to '[.cloze]'")
    elif "[.cloze]" in bitmark_markup:
        if "[_]" not in bitmark_markup:
            issues.append("Cloze exercise found but no input fields [_] detected")
            suggestions.append("Add input fields using [_] syntax in your cloze exercise")
        else:
            suggestions.append("✅ Cloze exercise syntax looks correct!")
    
    if "[.multiple-choice]" in bitmark_markup:
        if "[+" not in bitmark_markup or "[-" not in bitmark_markup:
            issues.append("Multiple choice found but no answer options detected")
            suggestions.append("Add correct answers with [+option] and incorrect answers with [-option]")
        else:
            suggestions.append("✅ Multiple choice syntax looks correct!")
    
    if "**" in bitmark_markup and "__" in bitmark_markup:
        suggestions.append("✅ Your markup uses both **bold** and __italic__ formatting - looks good!")
    
    # Check for other common typos
    if "[.cloze-and-multiple-choice-text]" in bitmark_markup:
        suggestions.append("✅ Combined cloze and multiple choice syntax detected!")
    
    # Check for reveal solutions syntax
    if "[@revealSolutions:" in bitmark_markup:
        suggestions.append("✅ Reveal solutions syntax detected!")
    
    return {
        "input_type": "markup_analysis",
        "bitmark_markup": bitmark_markup[:200] + "..." if len(bitmark_markup) > 200 else bitmark_markup,
        "issues": issues,
        "suggestions": suggestions,
        "success": True
    }

def _check_for_errors(pane_content: Dict[str, Any]) -> Dict[str, Any]:
    """Check for errors across all panes."""
    errors = []
    suggestions = []
    
    bitmark_markup = pane_content.get("input_json_or_bitmark_pane", "")
    json_content = pane_content.get("json_content", "")
    rendered_ui = pane_content.get("rendered_ui_pane", "")
    
    if not bitmark_markup.strip():
        errors.append("No Bitmark markup found")
        suggestions.append("Add some Bitmark markup to get started")
    
    if bitmark_markup and not json_content:
        errors.append("Bitmark markup exists but no JSON output found")
        suggestions.append("Check if your Bitmark syntax is correct - it should generate JSON")
    
    if json_content and not rendered_ui:
        errors.append("JSON exists but no rendered UI found")
        suggestions.append("The JSON might not be valid for rendering")
    
    return {
        "input_type": "error_check",
        "errors": errors,
        "suggestions": suggestions,
        "success": len(errors) == 0
    }

def _review_content(pane_content: Dict[str, Any]) -> Dict[str, Any]:
    """Review content across all panes and provide feedback."""
    review = {
        "input_json_or_bitmark_pane": "Not provided",
        "json_content": "Not provided", 
        "rendered_ui_pane": "Not provided",
        "sandbox_output_pane": "Not provided"
    }
    
    feedback = []
    
    for pane, content in pane_content.items():
        if content and content.strip():
            review[pane] = f"Provided ({len(content)} characters)"
            if pane == "input_json_or_bitmark_pane":
                if "[.cloze]" in content:
                    feedback.append("✅ Cloze exercise detected")
                if "[.multiple-choice]" in content:
                    feedback.append("✅ Multiple choice question detected")
                if "**" in content or "__" in content:
                    feedback.append("✅ Text formatting detected")
        else:
            feedback.append(f"⚠️ {pane.replace('_', ' ').title()} pane is empty")
    
    return {
        "input_type": "content_review",
        "review": review,
        "feedback": feedback,
        "success": True
    }

def _troubleshoot_input_issues(pane_content: Dict[str, Any]) -> Dict[str, Any]:
    """Troubleshoot input issues based on pane content."""
    issues = []
    suggestions = []
    
    # Check bitmark markup pane
    bitmark_markup = pane_content.get("input_json_or_bitmark_pane", "")
    if bitmark_markup:
        markup_issues = _analyze_bitmark_markup(bitmark_markup)
        issues.extend(markup_issues)
    
    # Check JSON pane
    json_content = pane_content.get("json_content", "")
    if json_content:
        json_issues = _analyze_json_content(json_content)
        issues.extend(json_issues)
    
    # Check rendered UI pane
    rendered_ui = pane_content.get("rendered_ui_pane", "")
    if rendered_ui:
        ui_issues = _analyze_rendered_ui(rendered_ui)
        issues.extend(ui_issues)
    
    # Check sandbox pane
    sandbox_content = pane_content.get("sandbox_output_pane", "")
    if sandbox_content:
        sandbox_issues = _analyze_sandbox_content(sandbox_content)
        issues.extend(sandbox_issues)
    
    # Generate suggestions based on issues
    if issues:
        suggestions = _generate_troubleshooting_suggestions(issues)
    
    # Add the actual pane content to help LLM analyze directly
    return {
        "input_type": "troubleshooting",
        "pane_content_analyzed": True,
        "input_json_or_bitmark_pane": bitmark_markup[:500] if bitmark_markup else "Not provided",
        "json_content": json_content[:1000] if json_content else "Not provided",
        "sandbox_output_pane": sandbox_content[:500] if sandbox_content else "Not provided",
        "issues_found": issues,
        "suggestions": suggestions,
        "success": True
    }

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
    
    # Skip analysis if this is just a placeholder string from frontend
    if "not available" in rendered_ui.lower():
        return issues
    
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
    
    # Skip analysis if this is just a placeholder string from frontend
    if "not available" in sandbox_content.lower():
        return issues
    
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

def _get_parser_code_info() -> Dict[str, Any]:
    """Get information about the bitmark-parser-generator code."""
    try:
        import os
        import sys
        
        # Add the parser package to the path
        parser_path = os.path.join(os.path.dirname(__file__), '..', 'bitmark-parser-generator', 'src')
        if parser_path not in sys.path:
            sys.path.insert(0, parser_path)
        
        # Try to import and analyze the parser
        try:
            from BitmarkParserGenerator import BitmarkParserGenerator
            parser = BitmarkParserGenerator()
            
            # Get parser methods and properties
            methods = [method for method in dir(parser) if not method.startswith('_')]
            
            return {
                "code_type": "parser",
                "package": "bitmark-parser-generator",
                "class": "BitmarkParserGenerator",
                "available_methods": methods[:10],  # First 10 methods
                "total_methods": len(methods),
                "description": "Main parser class for converting Bitmark markup to JSON",
                "success": True
            }
        except ImportError as e:
            return {
                "code_type": "parser",
                "error": f"Could not import BitmarkParserGenerator: {str(e)}",
                "suggestion": "Make sure bitmark-parser-generator is installed and accessible",
                "success": False
            }
            
    except Exception as e:
        return {
            "code_type": "parser",
            "error": f"Failed to access parser code: {str(e)}",
            "success": False
        }

def _get_ui_renderer_code_info() -> Dict[str, Any]:
    """Get information about the bitmark-ui-renderer code."""
    try:
        import os
        import sys
        
        # Add the UI renderer package to the path
        renderer_path = os.path.join(os.path.dirname(__file__), '..', 'bitmark-ui-renderer', 'src')
        if renderer_path not in sys.path:
            sys.path.insert(0, renderer_path)
        
        # Try to import and analyze the UI renderer
        try:
            # Look for main components
            components = []
            renderer_dir = os.path.join(os.path.dirname(__file__), '..', 'bitmark-ui-renderer', 'src', 'components')
            if os.path.exists(renderer_dir):
                for file in os.listdir(renderer_dir):
                    if file.endswith('.tsx'):
                        components.append(file.replace('.tsx', ''))
            
            return {
                "code_type": "ui_renderer",
                "package": "bitmark-ui-renderer",
                "available_components": components[:10],  # First 10 components
                "total_components": len(components),
                "description": "React components for rendering Bitmark content",
                "success": True
            }
        except Exception as e:
            return {
                "code_type": "ui_renderer",
                "error": f"Could not access UI renderer: {str(e)}",
                "suggestion": "Make sure bitmark-ui-renderer is accessible",
                "success": False
            }
            
    except Exception as e:
        return {
            "code_type": "ui_renderer",
            "error": f"Failed to access UI renderer code: {str(e)}",
            "success": False
        }

def _get_playground_code_info() -> Dict[str, Any]:
    """Get information about the bitmark-playground code."""
    try:
        import os
        
        # Look for main components and files in the playground
        playground_path = os.path.join(os.path.dirname(__file__), '..', 'bitmark-playground', 'src')
        
        components = []
        services = []
        utils = []
        state_files = []
        
        # Scan different directories
        if os.path.exists(playground_path):
            # Components (scan subdirectories too)
            components_dir = os.path.join(playground_path, 'components')
            if os.path.exists(components_dir):
                for item in os.listdir(components_dir):
                    item_path = os.path.join(components_dir, item)
                    if os.path.isdir(item_path):
                        # Scan subdirectory for .tsx files
                        for file in os.listdir(item_path):
                            if file.endswith('.tsx'):
                                components.append(f"{item}/{file.replace('.tsx', '')}")
                    elif item.endswith('.tsx'):
                        components.append(item.replace('.tsx', ''))
            
            # Services
            services_dir = os.path.join(playground_path, 'services')
            if os.path.exists(services_dir):
                for file in os.listdir(services_dir):
                    if file.endswith('.tsx'):
                        services.append(file.replace('.tsx', ''))
            
            # Utils
            utils_dir = os.path.join(playground_path, 'utils')
            if os.path.exists(utils_dir):
                for file in os.listdir(utils_dir):
                    if file.endswith('.ts'):
                        utils.append(file.replace('.ts', ''))
            
            # State
            state_dir = os.path.join(playground_path, 'state')
            if os.path.exists(state_dir):
                for file in os.listdir(state_dir):
                    if file.endswith('.ts'):
                        state_files.append(file.replace('.ts', ''))
        
        return {
            "code_type": "playground",
            "package": "bitmark-playground",
            "available_components": components[:10],  # First 10 components
            "total_components": len(components),
            "services": services[:5],  # First 5 services
            "utils": utils[:5],  # First 5 utils
            "state_files": state_files[:5],  # First 5 state files
            "description": "React playground application with editor, components, and state management",
            "success": True
        }
        
    except Exception as e:
        return {
            "code_type": "playground",
            "error": f"Failed to access playground code: {str(e)}",
            "success": False
        }

def _get_specific_file_info(file_path: str) -> Dict[str, Any]:
    """Get information about a specific file."""
    try:
        import os
        
        # Construct full path
        full_path = os.path.join(os.path.dirname(__file__), '..', file_path)
        
        if not os.path.exists(full_path):
            return {
                "code_type": "specific_file",
                "file_path": file_path,
                "error": "File not found",
                "success": False
            }
        
        # Read file content (limit to first 1000 lines for performance)
        with open(full_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            content = ''.join(lines[:1000])
            total_lines = len(lines)
        
        return {
            "code_type": "specific_file",
            "file_path": file_path,
            "content_preview": content,
            "total_lines": total_lines,
            "preview_lines": min(1000, total_lines),
            "success": True
        }
        
    except Exception as e:
        return {
            "code_type": "specific_file",
            "file_path": file_path,
            "error": f"Failed to read file: {str(e)}",
            "success": False
        }

def _get_function_implementation(function_name: str) -> Dict[str, Any]:
    """Get implementation details for a specific function."""
    try:
        import inspect
        import sys
        
        # Try to find the function in various modules
        modules_to_check = [
            'BitmarkParserGenerator',
            'bitmark_parser',
            'ui_renderer'
        ]
        
        for module_name in modules_to_check:
            try:
                module = __import__(module_name)
                if hasattr(module, function_name):
                    func = getattr(module, function_name)
                    source = inspect.getsource(func)
                    signature = inspect.signature(func)
                    
                    return {
                        "code_type": "function_implementation",
                        "function_name": function_name,
                        "module": module_name,
                        "signature": str(signature),
                        "source_code": source,
                        "success": True
                    }
            except (ImportError, AttributeError):
                continue
        
        return {
            "code_type": "function_implementation",
            "function_name": function_name,
            "error": "Function not found in available modules",
            "suggestion": "Try checking parser or UI renderer modules",
            "success": False
        }
        
    except Exception as e:
        return {
            "code_type": "function_implementation",
            "function_name": function_name,
            "error": f"Failed to get function implementation: {str(e)}",
            "success": False
        }

def _get_general_code_info() -> Dict[str, Any]:
    """Get general information about available code."""
    try:
        import os
        
        # Get available packages
        packages = []
        base_path = os.path.dirname(os.path.dirname(__file__))
        
        for item in os.listdir(base_path):
            if item.startswith('bitmark-') and os.path.isdir(os.path.join(base_path, item)):
                packages.append(item)
        
        return {
            "code_type": "general",
            "available_packages": packages,
            "description": "Available Bitmark packages in the codebase",
            "success": True
        }
        
    except Exception as e:
        return {
            "code_type": "general",
            "error": f"Failed to get general code info: {str(e)}",
            "success": False
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
            "name": "get_code_access_info",
            "description": "Access and analyze the actual running code in the backend, including bitmark-parser-generator, bitmark-ui-renderer, and bitmark-playground. Use this when users ask about implementation details, code structure, or need to understand how specific functions work. This gives you direct access to the source code and implementation details.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "code_type": {
                        "type": "STRING",
                        "description": "Type of code to access",
                        "enum": ["parser", "ui_renderer", "playground", "specific_file", "function_implementation", "general"]
                    },
                    "file_path": {
                        "type": "STRING",
                        "description": "Specific file path to analyze (optional, used with specific_file type)"
                    },
                    "function_name": {
                        "type": "STRING",
                        "description": "Specific function to examine (optional, used with function_implementation type)"
                    }
                },
                "required": ["code_type"]
            }
        },
        {
            "name": "get_playground_panes_info",
            "description": "CRITICAL: This function gives you DIRECT ACCESS to the user's playground editor content. When users ask about their Bitmark content, their input, or want you to check something they're working on, you MUST use this function to read what's currently in their editor. The function returns the actual input_json_or_bitmark_pane and json_content from the playground, which you can analyze directly to answer the user's question. Focus on the input_json_or_bitmark_pane (raw Bitmark syntax) and json_content (parsed JSON representation) fields in the response - these contain all the information you need. DO NOT say you lack access if these fields contain content. Use this for questions like 'check my cloze question', 'any issues?', 'help with my input', 'analyze my content', etc.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "input_type": {
                        "type": "STRING",
                        "description": "Type of analysis to perform on the playground content",
                        "enum": ["markup_analysis", "error_check", "content_review", "troubleshooting", "general"]
                    },
                    "pane_content": {
                        "type": "OBJECT",
                        "description": "Content from the 4 playground panes for analysis",
                        "properties": {
                            "input_json_or_bitmark_pane": {
                                "type": "STRING",
                                "description": "Content from the bitmark markup pane (top-left)"
                            },
                            "json_content": {
                                "type": "STRING", 
                                "description": "Content from the JSON pane (top-right)"
                            },
                            "rendered_ui_pane": {
                                "type": "STRING",
                                "description": "Content from the rendered UI pane (bottom-left)"
                            },
                            "sandbox_output_pane": {
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
        "get_code_access_info": get_code_access_info,
        "get_playground_panes_info": get_playground_panes_info
    }
    
    if function_name not in function_map:
        return {"error": f"Unknown function: {function_name}", "success": False}
    
    try:
        return function_map[function_name](**function_args)
    except Exception as e:
        return {"error": f"Function execution failed: {str(e)}", "success": False}
