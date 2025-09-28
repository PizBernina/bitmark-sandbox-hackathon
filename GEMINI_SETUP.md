# Gemini AI Chat Integration Setup

This guide explains how to set up the Gemini Live API integration for the Bitmark AI Chat feature.

## Architecture

The AI Chat feature consists of two parts:
1. **Frontend**: React/TypeScript chat interface (integrated into bitmark-playground)
2. **Backend**: Python FastAPI service that handles Gemini Live API calls

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd /home/robin/bitmark_all/bitmark-ai-chat-backend
```

### 2. Set Up Environment Variables

**Option 1: Using .env file (recommended for development):**
```bash
# Copy the example environment file
cp env_example.txt .env

# Edit .env and add your Gemini API key
nano .env
```

Add your Gemini API key to the .env file:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Option 2: Using system environment variable:**
```bash
export GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 3. Start the Backend Service
```bash
# Option 1: Use the startup script (recommended)
./start.sh

# Option 2: Manual setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

The backend will start on `http://localhost:8000`

## Frontend Setup

The frontend is already integrated into the bitmark-playground. No additional setup is required.

## Testing the Integration

### 1. Start Both Services

**Terminal 1 - Backend:**
```bash
cd /home/robin/bitmark_all/bitmark-ai-chat-backend
./start.sh
```

**Terminal 2 - Frontend:**
```bash
cd /home/robin/bitmark_all/bitmark-playground
npm start
```

### 2. Test the Chat

1. Open `http://localhost:3010` in your browser
2. Click the "AI Chat" button in the top menu bar
3. Type a message and press Enter or click the send button
4. You should see a loading indicator (⏳) while the AI responds
5. The AI response should appear in the chat

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /chat` - Send message to Gemini

### Chat API Example

**Request:**
```json
POST http://localhost:8000/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "conversation_history": []
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "success": true,
  "error": null
}
```

## Configuration

### Gemini Model
- **Model**: `gemini-live-2.5-flash-preview`
- **Response Modalities**: TEXT only
- **API**: Google Gemini Live API

### CORS Settings
The backend is configured to allow requests from:
- `http://localhost:3010` (bitmark-playground)

## Troubleshooting

### Common Issues

1. **"Failed to connect to AI service"**
   - Check if the backend is running on port 8000
   - Verify the GEMINI_API_KEY is set correctly

2. **CORS errors**
   - Ensure the frontend is running on localhost:3010
   - Check backend CORS configuration

3. **Gemini API errors**
   - Verify your API key is valid
   - Check if you have access to the Gemini Live API
   - Ensure you have sufficient API quota

### Debug Mode

To see detailed error logs, check the backend console output. The backend logs all API calls and errors.

## Development

### Backend Development
- Edit `main.py` for API changes
- Add new dependencies to `requirements.txt`
- Restart the backend after changes

### Frontend Development
- Edit files in `/home/robin/bitmark_all/bitmark-ai-chat/src/`
- Run `npm run build` to rebuild the package
- Copy built files to playground: `cp -r dist/* /home/robin/bitmark_all/bitmark-playground/src/lib/bitmark-ai-chat/`

## Security Notes
- The backend runs on localhost only for development
- For production, implement proper authentication and HTTPS
