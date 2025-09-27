import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Code, DataObject, PlayArrow } from '@mui/icons-material';

interface AppCodeEditorRendererProps {
  bit: {
    type: string;
    content?: string;
    id?: string;
    computerLanguage?: string;
    body?: any;
  };
}

export const AppCodeEditorRenderer: React.FC<AppCodeEditorRendererProps> = ({ bit }) => {
  // Extract content from various possible structures
  const getContent = () => {
    if (bit.content) return bit.content;
    if (bit.body) {
      if (typeof bit.body === 'string') return bit.body;
      if (bit.body.bodyText) return bit.body.bodyText;
      if (bit.body.text) return bit.body.text;
    }
    return '';
  };

  const content = getContent();
  const language = bit.computerLanguage || 'bitmark';
  const id = bit.id;

  const getLanguageIcon = () => {
    switch (language) {
      case 'json':
        return <DataObject sx={{ fontSize: '1rem' }} />;
      case 'bitmark':
        return <PlayArrow sx={{ fontSize: '1rem' }} />;
      default:
        return <Code sx={{ fontSize: '1rem' }} />;
    }
  };

  const getLanguageColor = () => {
    switch (language) {
      case 'json':
        return 'primary';
      case 'bitmark':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {getLanguageIcon()}
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Code Editor
          </Typography>
          <Chip
            label={language.toUpperCase()}
            size="small"
            color={getLanguageColor()}
            variant="outlined"
          />
          {id && (
            <Chip
              label={`ID: ${id}`}
              size="small"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
        
        <Box
          component="pre"
          sx={{
            backgroundColor: 'grey.50',
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            overflow: 'auto',
            maxHeight: '300px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content || 'No content available'}
        </Box>
      </Paper>
    </motion.div>
  );
};
