# Bitmark AI Chat Backend

Backend service for the Bitmark AI Chat feature, providing integration with Google's Gemini Live API.

## Features

- FastAPI-based REST API
- Gemini Live API 2.5 Flash Preview integration
    https://ai.google.dev/gemini-api/docs/live
- CORS support for frontend integration
- Conversation history support
- Error handling and logging

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   
   **Option 1: Using .env file (recommended for development):**
   ```bash
   cp env_example.txt .env
   # Edit .env and add your GEMINI_API_KEY
   ```
   
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
Send a message to Gemini and get a response

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "response": "I'm doing well, thank you!",
  "success": true,
  "error": null
}
```

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

**Default system instruction:**
```
You are a helpful AI assistant for the Bitmark ecosystem. Bitmark is a markup language for creating interactive educational content. You can help users with Bitmark syntax, creating interactive elements, and understanding how to use the Bitmark parser and UI renderer. Be concise and helpful in your responses.

Key areas you can help with:
- Bitmark syntax and grammar
- Creating interactive elements (quizzes, dropdowns, etc.)
- Understanding the Bitmark parser and how it works
- UI rendering and component usage
- Best practices for educational content creation
- Troubleshooting Bitmark-related issues

Always provide practical examples when explaining Bitmark concepts and keep responses focused on the user's specific needs.
```

## Error Handling

The API includes comprehensive error handling for:
- Missing API keys
- Gemini API errors
- Network connectivity issues
- Invalid request formats
