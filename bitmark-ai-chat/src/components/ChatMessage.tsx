import React from 'react';
import { Box, Text } from 'theme-ui';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const getToolDisplayName = (toolName: string) => {
    const toolNames: Record<string, string> = {
      'get_bitmark_general_info': '📚 General Info',
      'get_bitmark_code_info': '💻 Code Info',
      'get_user_input_info': '📝 Input Info'
    };
    return toolNames[toolName] || `🔧 ${toolName}`;
  };

  const getToolDescription = (tool: any) => {
    if (tool.name === 'get_bitmark_general_info') {
      return `Retrieved ${tool.args.topic || 'overview'} information`;
    } else if (tool.name === 'get_bitmark_code_info') {
      return `Retrieved ${tool.args.code_type || 'syntax'} information`;
    } else if (tool.name === 'get_user_input_info') {
      return `Retrieved ${tool.args.input_type || 'general'} information`;
    }
    return 'Used tool';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '8px',
      }}
    >
      <Box>
        {/* Tool usage indicators */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <Box
            sx={{
              marginBottom: '6px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
            }}
          >
            {message.toolsUsed.map((tool, index) => (
              <Box
                key={index}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 6px',
                  backgroundColor: '#e8f4fd',
                  border: '1px solid #63019B',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  color: '#63019B',
                  fontWeight: '500',
                }}
                title={getToolDescription(tool)}
              >
                {getToolDisplayName(tool.name)}
              </Box>
            ))}
          </Box>
        )}
        
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
