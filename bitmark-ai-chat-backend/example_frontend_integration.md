# Frontend Integration Example

This document shows how the frontend can integrate with the enhanced `get_user_input_info` tool to provide comprehensive troubleshooting for user input issues.

## How It Works

The enhanced tool can now access content from all 4 playground panes to diagnose input issues:

1. **Bitmark Markup Pane** (top-left) - Raw bitmark syntax
2. **JSON Pane** (top-right) - Parsed JSON representation
3. **Rendered UI Pane** (bottom-left) - Interactive output
4. **Sandbox Pane** (bottom-right) - Additional content/editors

## Frontend Integration

### 1. Collect Pane Content

When a user asks about input issues, collect content from all 4 panes:

```javascript
// Example: Collect pane content from the playground
function collectPaneContent() {
  return {
    bitmark_markup: getBitmarkMarkupContent(), // From bitmarkState.markup
    json_content: getJsonContent(),           // From bitmarkState.jsonAsString
    rendered_ui: getRenderedUIContent(),      // From rendered UI component
    sandbox_content: getSandboxContent()      // From sandbox component
  };
}
```

### 2. Send to AI Chat

Include pane content in the chat request:

```javascript
// Example: Send troubleshooting request
const chatRequest = {
  message: "My input isn't working, can you help?",
  conversation_history: [...],
  pane_content: collectPaneContent() // Optional: include pane content
};

// Send to /chat endpoint
fetch('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(chatRequest)
});
```

### 3. AI Response

The AI will analyze all 4 panes and provide:

- **Issues Found**: Specific problems detected in each pane
- **Suggestions**: Actionable fixes for the issues
- **Severity Levels**: Error, warning, or info
- **Pane-Specific**: Which pane has the problem

## Example AI Response

```json
{
  "response": "I found several issues with your bitmark input...",
  "tools_used": [
    {
      "function": "get_user_input_info",
      "args": {
        "input_type": "troubleshooting",
        "pane_content": {
          "bitmark_markup": "[.cloze] The students completed the [_] with...",
          "json_content": "[{\"type\":\"cloze\",\"content\":\"...\"}]",
          "rendered_ui": "<div>...</div>",
          "sandbox_content": "..."
        }
      },
      "result": {
        "issues_found": [
          {
            "type": "syntax_error",
            "pane": "bitmark_markup",
            "issue": "Empty cloze placeholder found",
            "description": "Found [_] without content. Use [_answer] format.",
            "severity": "error"
          }
        ],
        "suggestions": [
          "Fix empty cloze placeholders by adding content: [_answer] instead of [_]"
        ]
      }
    }
  ]
}
```

## Implementation Steps

1. **Add Pane Content Collection**: Modify the chat interface to collect content from all 4 panes
2. **Update Chat Request**: Include `pane_content` in the chat request when troubleshooting
3. **Display AI Suggestions**: Show the AI's findings and suggestions in the chat interface
4. **Highlight Issues**: Use the pane information to highlight specific issues in the playground

## Benefits

- **Comprehensive Analysis**: AI can see the full context across all panes
- **Specific Troubleshooting**: Identifies exact issues and their locations
- **Actionable Suggestions**: Provides specific fixes for each problem
- **Real-time Help**: Users get immediate assistance with their input issues

## Usage Examples

Users can now ask questions like:
- "Why isn't my input working?"
- "What's wrong with my bitmark syntax?"
- "Why isn't my multiple choice rendering?"
- "Help me fix my cloze questions"
- "What's causing the error in my JSON?"

The AI will analyze all 4 panes and provide specific, actionable help!
