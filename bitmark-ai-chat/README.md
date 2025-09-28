# Bitmark AI Chat

A draggable AI chat component for the Bitmark Playground, powered by Gemini 2.5 Flash.

## Features

- **Draggable Chat Window**: Move the chat window around the screen to avoid blocking content
- **Minimize/Restore**: Click the minimize button to hide the chat, click the AI Chat button to restore it
- **Clear Chat**: Clear the entire chat history and start fresh
- **Send Messages**: Type messages and press Enter or click the send button
- **Consistent Styling**: Matches the Bitmark Playground theme with white background and purple accents

## Usage

The AI Chat component integrates seamlessly with the Bitmark Playground. Click the "AI Chat" button in the top menu bar to open the chat window.

## Components

- `AIChatWindow`: Main draggable chat window component
- `AIChatButton`: Button to toggle chat visibility
- `ChatMessage`: Individual message display component
- `ChatInput`: Input field with send functionality

## State Management

The chat maintains its state (messages, position, visibility) until the user explicitly clears the chat history. Minimizing the chat preserves all messages and conversation state.

## Styling

- White background for the chat window
- Purple buttons matching the app's accent color (#63019B)
- Consistent typography and spacing with the main application
