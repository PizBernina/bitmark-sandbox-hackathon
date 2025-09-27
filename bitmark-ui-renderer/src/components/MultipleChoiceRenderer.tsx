import React, { useState } from 'react';

import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { MultipleChoiceBit } from '../types';

interface MultipleChoiceRendererProps {
  bit: MultipleChoiceBit;
  onInteraction: (value: string) => void;
}

export const MultipleChoiceRenderer: React.FC<MultipleChoiceRendererProps> = ({ bit, onInteraction }) => {
  const [selectedValue, setSelectedValue] = useState(bit.selectedValue || '');

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onInteraction(newValue);
  };

  // Parse the content to find multiple choice patterns
  const parseContent = (content: string | undefined) => {
    if (!content) {
      return [{
        type: 'text' as const,
        content: 'No content available'
      }];
    }
    
    // Look for [-text][+text] patterns in the content, handling spaces and newlines
    // Use a more robust regex that handles spaces and newlines within brackets
    const parts = content.split(/(\[[-+][^\]]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[-') || part.startsWith('[+')) {
        const isCorrect = part.startsWith('[+');
        // Extract text content, trimming whitespace
        const text = part.slice(2, -1).trim();
        return {
          type: 'option' as const,
          text,
          correct: isCorrect,
          value: text.toLowerCase().replace(/\s+/g, '-')
        };
      }
      return {
        type: 'text' as const,
        content: part
      };
    });
  };

  const parsedParts = parseContent(bit.content);
  const options = parsedParts.filter(part => part.type === 'option');

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
          if (part.type === 'option') {
            // Don't render individual options here, they'll be handled by the dropdown
            return null;
          }
          return (
            <span key={index}>
              {part.content}
            </span>
          );
        })}
        {options.length > 0 && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: 16 }}
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Choose an option</InputLabel>
              <Select
                value={selectedValue}
                onChange={handleChange}
                label="Choose an option"
                sx={{
                  backgroundColor: 'grey.100',
                  '&:hover': {
                    backgroundColor: 'primary.100',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                {options.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </motion.div>
        )}
      </Typography>
    </Box>
  );
};
