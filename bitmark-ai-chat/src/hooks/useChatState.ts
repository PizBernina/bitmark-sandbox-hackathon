import { useState, useCallback } from 'react';
import { ChatState, ChatMessage } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChatState = (initialPosition = { x: window.innerWidth - 370, y: 50 }) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isMinimized: false,
    position: initialPosition,
    isVisible: false,
  });

  const addMessage = useCallback((content: string, sender: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: generateId(),
      content,
      sender,
      timestamp: new Date(),
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

  const sendMessage = useCallback((message: string) => {
    addMessage(message, 'user');
    // TODO: Add AI response logic here when Gemini integration is implemented
    // For now, we'll just echo the message back
    setTimeout(() => {
      addMessage(`Echo: ${message}`, 'ai');
    }, 1000);
  }, [addMessage]);

  return {
    chatState,
    addMessage,
    clearMessages,
    toggleVisibility,
    toggleMinimize,
    updatePosition,
    sendMessage,
  };
};
