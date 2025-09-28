import React, { useState, useEffect } from 'react';

interface ToolUsage {
  function_name: string;
  status: 'starting' | 'in_progress' | 'completed' | 'error';
  emoji: string;
  description: string;
  start_time?: string;
  end_time?: string;
}

interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
  tools_used: any[];
  tool_usage_indicators: ToolUsage[];
  has_tool_usage: boolean;
}

const ToolUsageIndicator: React.FC<{ tool: ToolUsage }> = ({ tool }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (tool.status === 'completed') {
      const timer = setTimeout(() => setIsCompleted(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [tool.status]);

  return (
    <div 
      className={`tool-usage-indicator ${isCompleted ? 'completed' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        margin: '4px',
        borderRadius: '20px',
        background: isCompleted 
          ? 'linear-gradient(45deg, #e8f5e8, #d4edda)'
          : 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
        border: `1px solid ${isCompleted ? '#c3e6cb' : '#ddd'}`,
        fontSize: '14px',
        animation: isCompleted ? 'toolComplete 0.5s ease-out' : 'toolPulse 1.5s ease-in-out infinite'
      }}
    >
      <span 
        className="tool-emoji"
        style={{
          fontSize: '16px',
          animation: isCompleted ? 'none' : 'toolBounce 1s ease-in-out infinite'
        }}
      >
        {tool.emoji}
      </span>
      <span 
        className="tool-description"
        style={{
          fontWeight: 500,
          color: '#333'
        }}
      >
        {tool.description}
      </span>
    </div>
  );
};

const ToolUsageContainer: React.FC<{ tools: ToolUsage[] }> = ({ tools }) => {
  if (tools.length === 0) return null;

  return (
    <div 
      className="tool-usage-container"
      style={{
        margin: '10px 0',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      }}
    >
      <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
        🤖 AI is using tools...
      </div>
      {tools.map((tool, index) => (
        <ToolUsageIndicator key={`${tool.function_name}-${index}`} tool={tool} />
      ))}
    </div>
  );
};

const ChatMessage: React.FC<{ 
  message: string; 
  isUser: boolean; 
  toolUsage?: ToolUsage[];
  hasToolUsage?: boolean;
}> = ({ message, isUser, toolUsage = [], hasToolUsage = false }) => {
  return (
    <div 
      className={`message ${isUser ? 'user-message' : 'assistant-message'}`}
      style={{
        margin: '10px 0',
        padding: '12px 16px',
        borderRadius: '18px',
        maxWidth: '80%',
        background: isUser ? '#007bff' : '#f1f3f4',
        color: isUser ? 'white' : '#333',
        marginLeft: isUser ? 'auto' : '0'
      }}
    >
      {!isUser && hasToolUsage && (
        <ToolUsageContainer tools={toolUsage} />
      )}
      <div>{message}</div>
    </div>
  );
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Array<{
    id: number;
    message: string;
    isUser: boolean;
    toolUsage?: ToolUsage[];
    hasToolUsage?: boolean;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          conversation_history: messages.map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.message,
            timestamp: new Date().toISOString()
          }))
        })
      });

      const data: ChatResponse = await response.json();
      
      const assistantMessage = {
        id: Date.now() + 1,
        message: data.response,
        isUser: false,
        toolUsage: data.tool_usage_indicators,
        hasToolUsage: data.has_tool_usage
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>🛠️ AI Chat with Tool Usage Animations</h1>
      
      <div 
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          height: '400px',
          overflowY: 'auto'
        }}
      >
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            toolUsage={msg.toolUsage}
            hasToolUsage={msg.hasToolUsage}
          />
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
            AI is thinking...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about Bitmark..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default ChatInterface;
