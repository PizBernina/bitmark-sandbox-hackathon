import React, { useState, KeyboardEvent } from 'react';
import { Box, Input, Button } from 'theme-ui';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: 'white',
      }}
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        sx={{
          flex: 1,
          marginRight: '8px',
          borderRadius: '20px',
          border: '1px solid #e0e0e0',
          padding: '8px 12px',
          fontSize: '14px',
          '&:focus': {
            outline: 'none',
            borderColor: '#63019B',
          },
          '&:hover': {
            borderColor: '#63019B',
          },
        }}
        disabled={disabled || isLoading}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled || isLoading}
        sx={{
          backgroundColor: isLoading ? '#ccc' : '#63019B',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          '&:hover': {
            backgroundColor: isLoading ? '#ccc' : '#4a0168',
          },
          '&:disabled': {
            backgroundColor: '#ccc',
            color: '#666',
            cursor: 'not-allowed',
          },
        }}
      >
        {isLoading ? '⏳' : '➤'}
      </Button>
    </Box>
  );
};
