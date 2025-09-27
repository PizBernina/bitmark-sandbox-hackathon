import React from 'react';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { TextBit } from '../types';

interface TextRendererProps {
  bit: TextBit;
}

export const TextRenderer: React.FC<TextRendererProps> = ({ bit }) => {
  const { content, type, level = 1, formatting } = bit;

  // Parse inline formatting like **bold** and __italic__
  const parseInlineFormatting = (text: string | undefined) => {
    if (!text) {
      return ['No content available'];
    }
    
    const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|==[^=]+==)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Typography
            key={index}
            component="span"
            sx={{ fontWeight: 'bold' }}
          >
            {part.slice(2, -2)}
          </Typography>
        );
      } else if (part.startsWith('__') && part.endsWith('__')) {
        return (
          <Typography
            key={index}
            component="span"
            sx={{ fontStyle: 'italic' }}
          >
            {part.slice(2, -2)}
          </Typography>
        );
      } else if (part.startsWith('==') && part.endsWith('==')) {
        return (
          <Typography
            key={index}
            component="span"
            sx={{ 
              textDecoration: 'underline',
              textDecorationColor: 'primary.main'
            }}
          >
            {part.slice(2, -2)}
          </Typography>
        );
      }
      return part;
    });
  };

  const renderContent = () => {
    const formattedContent = parseInlineFormatting(content);
    
    if (type === 'header') {
      const variant = level === 1 ? 'h4' : level === 2 ? 'h5' : 'h6';
      return (
        <Typography
          variant={variant as any}
          component="div"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1,
            mt: level === 1 ? 0 : 2,
          }}
        >
          {formattedContent}
        </Typography>
      );
    }

    return (
      <Typography
        variant="body1"
        component="div"
        sx={{
          mb: 1,
          lineHeight: 1.6,
          ...(formatting?.bold && { fontWeight: 'bold' }),
          ...(formatting?.italic && { fontStyle: 'italic' }),
          ...(formatting?.underline && { textDecoration: 'underline' }),
        }}
      >
        {formattedContent}
      </Typography>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          mb: type === 'header' ? 2 : 1,
        }}
      >
        {renderContent()}
      </Box>
    </motion.div>
  );
};
