# 🛠️ Tool Usage Animation System

This document explains the tool usage animation system that provides visual feedback when the AI uses tools to answer user questions.

## Overview

When users ask questions that require the AI to use tools (like looking up information or troubleshooting), the system now provides:

1. **Visual Indicators** - Emoji and description of what tool is being used
2. **Animations** - Smooth transitions and feedback during tool usage
3. **Status Updates** - Real-time indication of tool progress
4. **Completion Feedback** - Visual confirmation when tools finish

## How It Works

### 1. User Sends Message
```
User: "Tell me about Bitmark's hackathon"
```

### 2. AI Decides to Use Tools
The AI determines it needs to look up information using `get_bitmark_general_info`

### 3. Tool Usage Indicators Appear
```
🤖 AI is using tools...
📚 Looking up Bitmark information
```

### 4. Tool Completes
The indicator changes to completed state with animation

### 5. AI Response Appears
Full response with the retrieved information

## Tool Types & Emojis

| Tool | Emoji | Description | Color |
|------|-------|-------------|-------|
| `get_bitmark_general_info` | 📚 | Looking up Bitmark information | Green |
| `get_bitmark_code_info` | 💻 | Analyzing code structure | Blue |
| `get_user_input_info` | 🔧 | Troubleshooting input issues | Orange |

## Backend Implementation

### Response Model
```python
class ToolUsage(BaseModel):
    function_name: str
    status: str  # "starting", "in_progress", "completed", "error"
    emoji: str
    description: str
    start_time: str = None
    end_time: str = None

class ChatResponse(BaseModel):
    response: str
    success: bool
    tools_used: List[Dict[str, Any]] = []
    tool_usage_indicators: List[ToolUsage] = []
    has_tool_usage: bool = False
```

### API Endpoints
- `GET /tool-animations/css` - Get CSS for animations
- `GET /tool-animations/js` - Get JavaScript for animations

## Frontend Integration

### 1. HTML/CSS Implementation
```html
<div class="tool-usage-container">
  <div class="tool-usage-indicator">
    <span class="tool-emoji">📚</span>
    <span class="tool-description">Looking up Bitmark information</span>
  </div>
</div>
```

### 2. React Component
```tsx
const ToolUsageIndicator: React.FC<{ tool: ToolUsage }> = ({ tool }) => {
  return (
    <div className={`tool-usage-indicator ${isCompleted ? 'completed' : ''}`}>
      <span className="tool-emoji">{tool.emoji}</span>
      <span className="tool-description">{tool.description}</span>
    </div>
  );
};
```

### 3. Animation CSS
```css
.tool-usage-indicator {
  animation: toolPulse 1.5s ease-in-out infinite;
}

.tool-usage-indicator.completed {
  animation: toolComplete 0.5s ease-out;
}

@keyframes toolPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}
```

## Animation States

### 1. Starting
- Tool indicator appears with pulse animation
- Emoji bounces gently
- Description shows what's happening

### 2. In Progress
- Continuous pulse animation
- Visual feedback that work is being done
- Staggered appearance for multiple tools

### 3. Completed
- Scale animation on completion
- Color change to success state
- Animation stops, shows final state

### 4. Error
- Shake animation for errors
- Red color scheme
- Error state indication

## Usage Examples

### Single Tool Usage
```javascript
// User asks about Bitmark
const response = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: "Tell me about Bitmark's hackathon"
  })
});

// Response includes tool usage indicators
const data = await response.json();
// data.tool_usage_indicators = [
//   {
//     function_name: "get_bitmark_general_info",
//     emoji: "📚",
//     description: "Looking up Bitmark information",
//     status: "completed"
//   }
// ]
```

### Multiple Tool Usage
```javascript
// User asks complex question
const response = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: "Help me troubleshoot my input and tell me about Bitmark"
  })
});

// Response includes multiple tool indicators
// data.tool_usage_indicators = [
//   { emoji: "🔧", description: "Troubleshooting input issues" },
//   { emoji: "📚", description: "Looking up Bitmark information" }
// ]
```

## Benefits

1. **Transparency** - Users see what the AI is doing
2. **Engagement** - Visual feedback keeps users interested
3. **Trust** - Clear indication of tool usage builds confidence
4. **Debugging** - Easy to see which tools are being used
5. **Professional Feel** - Polished, modern user experience

## Customization

### Adding New Tools
1. Add tool info to `TOOL_EMOJIS` in `tool_usage_tracker.py`
2. Update function declarations in `tool_functions.py`
3. Add corresponding emoji and description

### Custom Animations
1. Modify CSS animations in `get_tool_animation_css()`
2. Update JavaScript in `get_tool_animation_js()`
3. Customize React component styles

### Styling
- Colors can be customized per tool type
- Animation timing can be adjusted
- Layout can be modified for different designs

## Demo

See `tool_animation_example.html` for a working demo of the animation system.

The system provides a smooth, engaging experience that keeps users informed about what the AI is doing behind the scenes!
