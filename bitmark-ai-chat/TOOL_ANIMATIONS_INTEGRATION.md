# 🛠️ Tool Usage Animations Integration

This document explains how the tool usage animation system has been integrated into the `bitmark-ai-chat` package.

## Overview

The `bitmark-ai-chat` package now includes comprehensive tool usage animations that provide visual feedback when the AI uses tools to answer user questions.

## New Components

### 1. ToolUsageIndicator
Individual tool usage indicator with animations.

```tsx
import { ToolUsageIndicator } from 'bitmark-ai-chat';

<ToolUsageIndicator 
  tool={{
    function_name: 'get_bitmark_general_info',
    status: 'completed',
    emoji: '📚',
    description: 'Looking up Bitmark information'
  }}
  index={0}
/>
```

### 2. ToolUsageContainer
Container for multiple tool usage indicators.

```tsx
import { ToolUsageContainer } from 'bitmark-ai-chat';

<ToolUsageContainer 
  tools={[
    {
      function_name: 'get_bitmark_general_info',
      status: 'completed',
      emoji: '📚',
      description: 'Looking up Bitmark information'
    }
  ]}
/>
```

## Updated Types

### ToolUsage Interface
```tsx
interface ToolUsage {
  function_name: string;
  status: 'starting' | 'in_progress' | 'completed' | 'error';
  emoji: string;
  description: string;
  start_time?: string;
  end_time?: string;
}
```

### Enhanced ChatMessage
```tsx
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  toolsUsed?: ToolUsage[]; // Legacy support
  toolUsageIndicators?: ToolUsage[]; // New animated indicators
  hasToolUsage?: boolean;
}
```

## Backend Integration

The chat state automatically handles the new tool usage indicators from the backend response:

```tsx
// Backend response includes:
{
  "response": "AI response text",
  "success": true,
  "tools_used": [...], // Legacy format
  "tool_usage_indicators": [ // New animated format
    {
      "function_name": "get_bitmark_general_info",
      "status": "completed",
      "emoji": "📚",
      "description": "Looking up Bitmark information"
    }
  ],
  "has_tool_usage": true
}
```

## Animation Features

### 1. Staggered Appearance
Multiple tools appear with a 300ms delay between each.

### 2. Status Animations
- **Starting/In Progress**: Pulse animation with bouncing emoji
- **Completed**: Scale animation with color change
- **Error**: Shake animation with error styling

### 3. Visual States
- **In Progress**: Gray gradient with pulse animation
- **Completed**: Green gradient with completion animation
- **Error**: Red gradient with shake animation

## Usage Examples

### Basic Integration
```tsx
import { AIChatWindow, useChatState } from 'bitmark-ai-chat';

const MyApp = () => {
  const { chatState, sendMessage } = useChatState();
  
  return (
    <AIChatWindow
      isVisible={chatState.isVisible}
      messages={chatState.messages}
      onSendMessage={sendMessage}
      // ... other props
    />
  );
};
```

### Custom Tool Usage Display
```tsx
import { ChatMessage, ToolUsageContainer } from 'bitmark-ai-chat';

const CustomChatMessage = ({ message }) => (
  <div>
    {message.sender === 'ai' && message.toolUsageIndicators && (
      <ToolUsageContainer tools={message.toolUsageIndicators} />
    )}
    <div>{message.content}</div>
  </div>
);
```

## Tool Types & Emojis

| Tool Function | Emoji | Description | Color |
|---------------|-------|-------------|-------|
| `get_bitmark_general_info` | 📚 | Looking up Bitmark information | Green |
| `get_bitmark_code_info` | 💻 | Analyzing code structure | Blue |
| `get_user_input_info` | 🔧 | Troubleshooting input issues | Orange |

## CSS Animations

The package includes built-in CSS animations:

```css
@keyframes toolPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

@keyframes toolBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes toolComplete {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## Backward Compatibility

The integration maintains backward compatibility with existing implementations:

- Legacy `toolsUsed` array still works
- New `toolUsageIndicators` provides enhanced animations
- Both can be used simultaneously

## Testing

Use the included `integration_test.html` to test the animations:

1. Open `integration_test.html` in a browser
2. Click "Test Single Tool" to see single tool animation
3. Click "Test Multiple Tools" to see multiple tool animations
4. Click "Add User Message" to add user messages

## Benefits

1. **Enhanced UX**: Users see what the AI is doing
2. **Transparency**: Clear indication of tool usage
3. **Engagement**: Smooth animations keep users interested
4. **Professional Feel**: Polished, modern interface
5. **Debugging**: Easy to see which tools are being used

## Migration Guide

### From Legacy to New System

**Before:**
```tsx
// Old way - basic tool display
{message.toolsUsed && message.toolsUsed.map(tool => (
  <div key={tool.name}>{tool.name}</div>
))}
```

**After:**
```tsx
// New way - animated tool indicators
{message.toolUsageIndicators && (
  <ToolUsageContainer tools={message.toolUsageIndicators} />
)}
```

The new system provides a much more engaging and informative user experience while maintaining full backward compatibility!
