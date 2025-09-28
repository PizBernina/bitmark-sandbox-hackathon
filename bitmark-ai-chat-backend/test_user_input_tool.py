#!/usr/bin/env python3
"""Test script for the enhanced get_user_input_info tool."""

from tool_functions import get_user_input_info

def test_troubleshooting():
    """Test the troubleshooting functionality with sample pane content."""
    
    # Sample pane content with issues
    pane_content = {
        "bitmark_markup": "[.cloze] The students completed the [_] with the correct verb forms.\n\n[.multiple-choice] What color are violets? [-red][+blue][-green]\n\n[.cloze-and-multiple-choice-text] Roses are [_red], violets are [-green][+blue][-yellow]",
        "json_content": '[{"type": "cloze", "content": "The students completed the [_] with the correct verb forms.", "error": "Empty cloze placeholder"}]',
        "rendered_ui": "<div>Error: Empty cloze placeholder</div>",
        "sandbox_content": ""
    }
    
    print("=== TESTING TROUBLESHOOTING ===")
    result = get_user_input_info("troubleshooting", pane_content)
    
    print(f"Success: {result['success']}")
    print(f"Issues found: {len(result.get('issues_found', []))}")
    
    for issue in result.get('issues_found', []):
        print(f"  - {issue['severity'].upper()}: {issue['issue']} in {issue['pane']}")
        print(f"    Description: {issue['description']}")
    
    print(f"\nSuggestions:")
    for suggestion in result.get('suggestions', []):
        print(f"  - {suggestion}")

def test_interactive_elements():
    """Test the interactive elements information."""
    
    print("\n=== TESTING INTERACTIVE ELEMENTS ===")
    result = get_user_input_info("interactive_elements")
    
    print(f"Success: {result['success']}")
    print(f"Content: {result['content']}")

def test_validation():
    """Test the validation information."""
    
    print("\n=== TESTING VALIDATION ===")
    result = get_user_input_info("validation")
    
    print(f"Success: {result['success']}")
    print(f"Validation rules: {len(result['content']['common_validation_rules'])}")

if __name__ == "__main__":
    test_troubleshooting()
    test_interactive_elements()
    test_validation()
