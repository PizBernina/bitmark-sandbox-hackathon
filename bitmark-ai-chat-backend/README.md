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

3. **Run the server:**
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

- **Model**: `gemini-live-2.5-flash-preview`
- **Response Modalities**: TEXT only
- **CORS**: Configured for `http://localhost:3010` (frontend)

## Error Handling

The API includes comprehensive error handling for:
- Missing API keys
- Gemini API errors
- Network connectivity issues
- Invalid request formats
