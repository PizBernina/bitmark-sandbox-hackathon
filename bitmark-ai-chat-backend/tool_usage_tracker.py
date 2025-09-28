"""Tool usage tracking and animation system."""

import time
from datetime import datetime
from typing import Dict, Any, List
from models import ToolUsage

# Tool emoji and description mapping
TOOL_EMOJIS = {
    "get_bitmark_general_info": {
        "emoji": "📚",
        "description": "Looking up Bitmark information",
        "color": "#4CAF50"
    },
    "get_bitmark_code_info": {
        "emoji": "💻", 
        "description": "Analyzing code structure",
        "color": "#2196F3"
    },
    "get_user_input_info": {
        "emoji": "🔧",
        "description": "Troubleshooting input issues",
        "color": "#FF9800"
    }
}

class ToolUsageTracker:
    """Tracks tool usage and creates animation indicators."""
    
    def __init__(self):
        self.active_tools: Dict[str, ToolUsage] = {}
        self.completed_tools: List[ToolUsage] = []
    
    def start_tool(self, function_name: str) -> ToolUsage:
        """Start tracking a tool usage."""
        tool_info = TOOL_EMOJIS.get(function_name, {
            "emoji": "⚙️",
            "description": f"Using {function_name}",
            "color": "#9E9E9E"
        })
        
        tool_usage = ToolUsage(
            function_name=function_name,
            status="starting",
            emoji=tool_info["emoji"],
            description=tool_info["description"],
            start_time=datetime.now().isoformat()
        )
        
        self.active_tools[function_name] = tool_usage
        return tool_usage
    
    def update_tool_status(self, function_name: str, status: str) -> ToolUsage:
        """Update tool status."""
        if function_name in self.active_tools:
            self.active_tools[function_name].status = status
            if status == "completed":
                self.active_tools[function_name].end_time = datetime.now().isoformat()
                self.completed_tools.append(self.active_tools[function_name])
                del self.active_tools[function_name]
        
        return self.active_tools.get(function_name)
    
    def get_tool_usage_indicators(self) -> List[ToolUsage]:
        """Get all tool usage indicators."""
        return list(self.active_tools.values()) + self.completed_tools
    
    def has_active_tools(self) -> bool:
        """Check if there are active tools."""
        return len(self.active_tools) > 0
    
    def get_animation_sequence(self) -> List[Dict[str, Any]]:
        """Get animation sequence for frontend."""
        sequence = []
        
        # Add starting animations for active tools
        for tool in self.active_tools.values():
            sequence.append({
                "type": "tool_start",
                "tool": tool.function_name,
                "emoji": tool.emoji,
                "description": tool.description,
                "timestamp": tool.start_time
            })
        
        # Add completion animations for completed tools
        for tool in self.completed_tools:
            sequence.append({
                "type": "tool_complete",
                "tool": tool.function_name,
                "emoji": tool.emoji,
                "description": tool.description,
                "duration": self._calculate_duration(tool.start_time, tool.end_time)
            })
        
        return sequence
    
    def _calculate_duration(self, start_time: str, end_time: str) -> float:
        """Calculate duration between start and end times."""
        try:
            start = datetime.fromisoformat(start_time)
            end = datetime.fromisoformat(end_time)
            return (end - start).total_seconds()
        except:
            return 0.0

def create_tool_usage_indicators(tools_used: List[Dict[str, Any]]) -> List[ToolUsage]:
    """Create tool usage indicators from tools_used list."""
    indicators = []
    
    for tool in tools_used:
        function_name = tool.get("function", "unknown")
        tool_info = TOOL_EMOJIS.get(function_name, {
            "emoji": "⚙️",
            "description": f"Used {function_name}",
            "color": "#9E9E9E"
        })
        
        indicator = ToolUsage(
            function_name=function_name,
            status="completed",
            emoji=tool_info["emoji"],
            description=tool_info["description"],
            start_time=datetime.now().isoformat(),
            end_time=datetime.now().isoformat()
        )
        
        indicators.append(indicator)
    
    return indicators

def get_tool_animation_css() -> str:
    """Get CSS for tool usage animations."""
    return """
    .tool-usage-indicator {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin: 4px;
        border-radius: 20px;
        background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
        border: 1px solid #ddd;
        font-size: 14px;
        animation: toolPulse 1.5s ease-in-out infinite;
    }
    
    .tool-usage-indicator.completed {
        background: linear-gradient(45deg, #e8f5e8, #d4edda);
        border-color: #c3e6cb;
        animation: toolComplete 0.5s ease-out;
    }
    
    .tool-usage-indicator.error {
        background: linear-gradient(45deg, #f8d7da, #f5c6cb);
        border-color: #f1aeb5;
        animation: toolError 0.5s ease-out;
    }
    
    .tool-emoji {
        font-size: 16px;
        animation: toolBounce 1s ease-in-out infinite;
    }
    
    .tool-description {
        font-weight: 500;
        color: #333;
    }
    
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
    
    @keyframes toolError {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    """

def get_tool_animation_js() -> str:
    """Get JavaScript for tool usage animations."""
    return """
    function createToolUsageIndicator(tool) {
        const indicator = document.createElement('div');
        indicator.className = 'tool-usage-indicator';
        indicator.innerHTML = `
            <span class="tool-emoji">${tool.emoji}</span>
            <span class="tool-description">${tool.description}</span>
        `;
        
        // Add completion animation after a delay
        setTimeout(() => {
            indicator.classList.add('completed');
        }, 2000);
        
        return indicator;
    }
    
    function showToolUsageAnimation(tools) {
        const container = document.getElementById('tool-usage-container');
        if (!container) return;
        
        tools.forEach((tool, index) => {
            setTimeout(() => {
                const indicator = createToolUsageIndicator(tool);
                container.appendChild(indicator);
            }, index * 500); // Stagger animations
        });
    }
    """
