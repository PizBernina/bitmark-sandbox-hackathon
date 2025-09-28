import { useState, useCallback } from 'react';
import { ChatState, ChatMessage, ToolUsage } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChatState = (initialPosition = { x: window.innerWidth - 370, y: 50 }) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isMinimized: false,
    position: initialPosition,
    isVisible: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((content: string, sender: 'user' | 'ai', toolsUsed?: ToolUsage[]) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      content,
      sender,
      timestamp: new Date(),
      toolsUsed,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
    }));
  }, []);

  const toggleVisibility = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  }, []);

  const updatePosition = useCallback((position: { x: number; y: number }) => {
    setChatState(prev => ({
      ...prev,
      position,
    }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    addMessage(message, 'user');
    setIsLoading(true);
    
    try {
      // Prepare conversation history for the API
      const conversationHistory = chatState.messages.map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : msg.sender,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));
      
      // Call the backend API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_history: conversationHistory
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        addMessage(data.response, 'ai', data.tools_used || []);
      } else {
        addMessage(`Error: ${data.error || 'Failed to get response from AI'}`, 'ai');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage(`Error: ${error instanceof Error ? error.message : 'Failed to connect to AI service'}`, 'ai');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, chatState.messages]);

  return {
    chatState,
    isLoading,
    addMessage,
    clearMessages,
    toggleVisibility,
    toggleMinimize,
    updatePosition,
    sendMessage,
  };
};
