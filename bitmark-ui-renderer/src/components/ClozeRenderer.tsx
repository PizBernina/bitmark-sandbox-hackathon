import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ClozeBit } from '../types';

interface ClozeRendererProps {
  bit: ClozeBit;
  onInteraction: (value: string) => void;
}

export const ClozeRenderer: React.FC<ClozeRendererProps> = ({ bit, onInteraction }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onInteraction(newValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Parse the content to find cloze placeholders
  const parseContent = (content: string | undefined) => {
    if (!content) {
      return [{
        type: 'text' as const,
        content: 'No content available'
      }];
    }
    
    // Look for [_text] patterns in the content
    const parts = content.split(/(\[_[^\]]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[_') && part.endsWith(']')) {
        const correctAnswer = part.slice(2, -1);
        return {
          type: 'cloze' as const,
          correctAnswer,
          placeholder: bit.placeholder || 'Fill in the blank'
        };
      }
      return {
        type: 'text' as const,
        content: part
      };
    });
  };

  const parsedParts = parseContent(bit.content);

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: 1,
        mb: 2,
      }}
    >
      <Typography variant="body1" component="div">
        {parsedParts.map((part, index) => {
          if (part.type === 'cloze') {
            return (
              <motion.span
                key={index}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <TextField
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={part.placeholder}
                  variant="outlined"
                  size="small"
                  sx={{
                    mx: 1,
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isFocused ? 'primary.50' : 'grey.100',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'primary.100',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'primary.50',
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                      },
                    },
                  }}
                />
              </motion.span>
            );
          }
          return (
            <span key={index}>
              {part.content}
            </span>
          );
        })}
      </Typography>
    </Box>
  );
};
