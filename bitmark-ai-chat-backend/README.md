# Bitmark AI Chat Backend

Backend service for the Bitmark AI Chat feature, providing integration with Google's Gemini API with advanced tool calling capabilities and playground integration.

## Features

- FastAPI-based REST API
- Gemini API 2.5 Flash integration with function calling
- **Tool Usage Animation System** - Visual feedback when AI uses tools
- **Playground Integration** - Direct access to user's Bitmark content
- CORS support for frontend integration
- Conversation history support
- Error handling and logging
- Modular architecture with separate helper modules

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   
   **Option 1: Using .env file (recommended for development):**
   Edit .env and add your GEMINI_API_KEY

   
   **Option 2: Using system environment variable:**
   ```bash
   export GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

3. **Configure system instruction (optional):**
   
   The system instruction is loaded from `context-prompts/system_instruction.txt` by default. You can:
   - Edit the file directly to customize the AI's behavior
   - Or set `GEMINI_SYSTEM_INSTRUCTION` environment variable to override

4. **Run the server:**
   ```bash
   python main.py
   ```

The server will start on `http://localhost:8000`

## API Endpoints

### `GET /`
Health check endpoint

### `GET /health`
Detailed health status

### `POST /chat`
Send a message to Gemini and get a response with tool calling support

**Request Body:**
```json
{
  "message": "Check my cloze question for issues",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ],
  "pane_content": {
    "input_json_or_bitmark_pane": "[.cloze] The students completed the [_assignment] with the correct verb forms.",
    "json_content": "[{\"bit\": {\"type\": \"cloze\"}}]",
    "rendered_ui_pane": "Rendered UI content",
    "sandbox_output_pane": "Sandbox content"
  }
}
```

**Response:**
```json
{
  "response": "I found an issue with your cloze question...",
  "success": true,
  "error": null,
  "tools_used": [
    {
      "function": "get_playground_panes_info",
      "args": {"input_type": "markup_analysis"},
      "result": {"issues": ["❌ TYPO DETECTED: '[.close]' should be '[.cloze]'"]}
    }
  ],
  "tool_usage_indicators": [
    {
      "function_name": "get_playground_panes_info",
      "status": "completed",
      "emoji": "⚙️",
      "description": "Analyzing your Bitmark content",
      "start_time": "2024-01-01T12:00:00Z",
      "end_time": "2024-01-01T12:00:01Z"
    }
  ],
  "has_tool_usage": true
}
```

### `GET /tool-animations/css`
Get CSS for tool usage animations

### `GET /tool-animations/js`
Get JavaScript for tool usage animations

### `POST /test-tool-animations`
Test endpoint to verify tool usage indicators work

## Configuration

- **Model**: `gemini-2.5-flash`
- **Response Modalities**: TEXT only
- **CORS**: Configured for `http://localhost:3010` (frontend)
- **System Instruction**: Configurable via `GEMINI_SYSTEM_INSTRUCTION` environment variable

### System Instruction

The AI assistant uses a system instruction to provide context about its role and capabilities. The system instruction is loaded from `context-prompts/system_instruction.txt` by default.

**File-based approach (recommended):**
- Edit `context-prompts/system_instruction.txt` to customize the AI's behavior
- Changes take effect when the server is restarted

**Environment variable override:**
- Set `GEMINI_SYSTEM_INSTRUCTION` to override the file-based instruction
- Useful for deployment or testing different configurations

## Tool Usage Animation System

The backend provides visual feedback when the AI uses tools to answer user questions, creating a transparent and engaging user experience.

### How It Works

1. **User Sends Message** - User asks a question that requires tool usage
2. **AI Decides to Use Tools** - AI determines it needs to access playground content or look up information
3. **Tool Usage Indicators Appear** - Visual indicators show what tools are being used
4. **Tool Completes** - Indicators update to show completion status
5. **AI Response Appears** - Full response with analysis results

### Available Tools

| Tool | Emoji | Description | Purpose |
|------|-------|-------------|---------|
| `get_bitmark_general_info` | 📚 | Looking up Bitmark information | Retrieve general info about Bitmark |
| `get_bitmark_code_info` | 💻 | Analyzing code structure | Get technical details about Bitmark |
| `get_code_access_info` | 🔍 | Analyzing source code | Access actual running code and implementation details |
| `get_playground_panes_info` | ⚙️ | Analyzing your Bitmark content | Access and analyze playground content |

### Animation States

- **Starting** - Tool indicator appears with pulse animation
- **In Progress** - Continuous pulse animation during tool execution
- **Completed** - Scale animation on completion with success state
- **Error** - Shake animation for errors with error state

## Playground Integration

The backend can directly access the user's playground content through the `get_playground_panes_info` tool, enabling real-time analysis and troubleshooting.

### Playground Changes Required

To integrate the AI chat with the Bitmark playground, the following changes were made:

#### 1. Backend Model Updates
- Added `pane_content` field to `ChatRequest` model
- Updated `ChatResponse` to include tool usage indicators
- Added `ToolUsage` model for animation data

#### 2. Playground Frontend Changes
- **AIChatManager.tsx**: Added `bitmarkState` integration to pass pane content
- **useChatState.ts**: Updated `sendMessage` function to accept pane content parameter
- **Chat integration**: Modified to send real-time playground content to backend

#### 3. Tool Function Implementation
- Created `get_playground_panes_info` function for analyzing playground content
- Implemented error analysis and suggestions
- Added support for multiple analysis types (markup_analysis, error_check, content_review)

### Pane Content Structure
```json
{
  "input_json_or_bitmark_pane": "User's Bitmark markup from top-left pane",
  "json_content": "Parsed JSON output from top-right pane", 
  "rendered_ui_pane": "Rendered UI content from bottom-left pane",
  "sandbox_output_pane": "Sandbox output from bottom-right pane"
}
```

## Architecture

The backend uses a modular architecture with separate helper modules:

- **`main.py`** - FastAPI application and main endpoints
- **`models.py`** - Pydantic models for request/response handling
- **`tool_functions.py`** - Tool implementations and function declarations
- **`gemini_helpers.py`** - Gemini API interaction helpers
- **`tool_usage_tracker.py`** - Tool usage tracking and animation data

## Error Handling

The API includes comprehensive error handling for:
- Missing API keys
- Gemini API errors
- Network connectivity issues
- Invalid request formats
- Tool execution errors
- Playground content access issues

## Dependencies

Refer to requirements.txt

## License

MIT License