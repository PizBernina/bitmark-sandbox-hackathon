import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { AIChatWindowProps } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

const TypingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '8px',
        animation: 'fadeIn 0.3s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box
        sx={{
          padding: '8px 12px',
          borderRadius: '18px',
          backgroundColor: '#f0f0f0',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Text sx={{ fontSize: '14px' }}>Writing</Text>
        <Box
          sx={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#666',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0s',
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          />
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#666',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0.2s',
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          />
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#666',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0.4s',
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
  isVisible,
  onMinimize,
  onClear,
  onSendMessage,
  messages,
  isMinimized,
  position,
  onPositionChange,
  onClose,
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or when loading state changes
  useEffect(() => {
    if (!isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized, isLoading]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow dragging from anywhere on the header, but not from buttons
    const target = e.target as HTMLElement;
    const isButton = target.closest('button') || target.tagName === 'BUTTON';
    
    if (!isButton) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      
      // Keep window within viewport bounds
      const maxX = window.innerWidth - 350;
      const maxY = window.innerHeight - (isMinimized ? 50 : 500);
      
      newPosition.x = Math.max(0, Math.min(newPosition.x, maxX));
      newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));
      
      onPositionChange(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      ref={windowRef}
      sx={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: '350px',
        height: isMinimized ? '50px' : '500px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        transition: 'height 0.3s ease',
        overflow: 'hidden',
      }}
      onMouseDown={handleMouseDown}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'move',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            cursor: 'move',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#666',
              fontSize: '12px',
              marginRight: '8px',
            }}
          >
            ⋮⋮
          </Box>
          <Text
            sx={{
              color: '#63019B',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            AI Chat
          </Text>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Button
            onClick={onClear}
            title="Clear chat"
            sx={{
              padding: '4px',
              color: '#63019B',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(99, 1, 155, 0.1)',
              },
            }}
          >
            🗑
          </Button>
          <Button
            onClick={onMinimize}
            title={isMinimized ? "Restore" : "Minimize"}
            sx={{
              padding: '4px',
              color: '#63019B',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(99, 1, 155, 0.1)',
              },
            }}
          >
            {isMinimized ? '□' : '−'}
          </Button>
          <Button
            onClick={onClose}
            title="Close chat"
            sx={{
              padding: '4px',
              color: '#63019B',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(99, 1, 155, 0.1)',
              },
            }}
          >
            ✕
          </Button>
        </Box>
      </Box>
      
      {!isMinimized && (
        <>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px',
              backgroundColor: 'white',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#63019B',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#4a0168',
              },
            }}
          >
            {messages.length === 0 && !isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#666',
                  textAlign: 'center',
                }}
              >
                <Text sx={{ fontSize: '14px' }}>
                  Start a conversation with AI
                </Text>
              </Box>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </Box>
          
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </>
      )}
    </Box>
  );
};