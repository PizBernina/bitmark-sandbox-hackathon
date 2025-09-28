import React from 'react';
import { Button } from 'theme-ui';
import { AIChatButtonProps } from '../types';

export const AIChatButton: React.FC<AIChatButtonProps> = ({ onClick, isVisible }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        backgroundColor: '#63019B',
        color: 'white',
        fontSize: '12px',
        padding: '4px 8px',
        minWidth: 'auto',
        height: '28px',
        borderRadius: '4px',
        textTransform: 'none',
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#4a0168',
        },
        '&:disabled': {
          backgroundColor: '#ccc',
          color: '#666',
        },
      }}
    >
      AI Chat
    </Button>
  );
};
