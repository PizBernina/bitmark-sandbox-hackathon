import React, { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ClozeAndMultipleChoiceBit } from '../types';

interface ClozeAndMultipleChoiceRendererProps {
  bit: ClozeAndMultipleChoiceBit;
  onInteraction: (value: string) => void;
}

export const ClozeAndMultipleChoiceRenderer: React.FC<ClozeAndMultipleChoiceRendererProps> = ({ 
  bit, 
  onInteraction 
}) => {
  const [clozeValue, setClozeValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleClozeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setClozeValue(newValue);
    onInteraction(`cloze:${newValue}`);
  };

  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onInteraction(`multiple-choice:${newValue}`);
  };

  // Parse the content to find both cloze and multiple choice patterns
  const parseContent = (content: string | undefined) => {
    if (!content) {
      return [{
        type: 'text' as const,
        content: 'No content available'
      }];
    }
    
    // Look for [_text] and [-text][+text] patterns
    const parts = content.split(/(\[_[^\]]*\]|\[[-+][^\]]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[_') && part.endsWith(']')) {
        const correctAnswer = part.slice(2, -1);
        return {
          type: 'cloze' as const,
          correctAnswer,
          placeholder: 'Fill in the blank'
        };
      } else if (part.startsWith('[-') || part.startsWith('[+')) {
        const isCorrect = part.startsWith('[+');
        const text = part.slice(2, -1);
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
      <Typography variant="body1" component="div" sx={{ lineHeight: 2.5 }}>
        {parsedParts.map((part, index) => {
          if (part.type === 'cloze') {
            return (
              <motion.span
                key={index}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-block', verticalAlign: 'middle' }}
              >
                <TextField
                  value={clozeValue}
                  onChange={handleClozeChange}
                  placeholder={part.placeholder}
                  variant="outlined"
                  size="small"
                  sx={{
                    mx: 0.5,
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'grey.100',
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
          } else if (part.type === 'option') {
            // Don't render individual options here, they'll be handled by the dropdown
            return null;
          }
          return (
            <span key={index} style={{ display: 'inline' }}>
              {part.content}
            </span>
          );
        })}
        {options.length > 0 && (
          <motion.span
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Choose</InputLabel>
              <Select
                value={selectedValue}
                onChange={handleSelectChange}
                label="Choose"
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
          </motion.span>
        )}
      </Typography>
    </Box>
  );
};
