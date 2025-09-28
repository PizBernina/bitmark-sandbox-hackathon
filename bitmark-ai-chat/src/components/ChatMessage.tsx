import React from 'react';
import { Box, Text } from 'theme-ui';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '8px',
      }}
    >
      <Box>
        <Box
          sx={{
            maxWidth: '70%',
            padding: '8px 12px',
            borderRadius: '18px',
            backgroundColor: message.sender === 'user' ? '#63019B' : '#f0f0f0',
            color: message.sender === 'user' ? 'white' : '#333',
            wordWrap: 'break-word',
          }}
        >
          <Text
            sx={{
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </Text>
        </Box>
        <Text
          sx={{
            fontSize: '0.75rem',
            color: '#666',
            marginTop: '4px',
            textAlign: message.sender === 'user' ? 'right' : 'left',
          }}
        >
          {message.timestamp.toLocaleTimeString()}
        </Text>
      </Box>
    </Box>
  );
};
