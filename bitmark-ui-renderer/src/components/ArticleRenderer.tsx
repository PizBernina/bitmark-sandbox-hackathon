import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Article as ArticleIcon } from '@mui/icons-material';
import { ArticleBit } from '../types';

interface ArticleRendererProps {
  bit: ArticleBit;
  onInteraction?: (value: string) => void;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ bit, onInteraction }) => {
  const { content, title, level = 1 } = bit;

  const handleInteraction = (value: string) => {
    if (onInteraction) {
      onInteraction(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderBottomColor: 'primary.main',
          }}
        >
          <ArticleIcon color="primary" />
          <Typography
            variant={`h${Math.min(level, 6)}` as any}
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              m: 0,
            }}
          >
            {title || 'Article'}
          </Typography>
        </Box>
        
        <Box
          sx={{
            '& p': {
              mb: 2,
              lineHeight: 1.6,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 3,
              mb: 1.5,
              fontWeight: 'bold',
              color: 'text.primary',
            },
            '& h1': { fontSize: '1.5rem' },
            '& h2': { fontSize: '1.3rem' },
            '& h3': { fontSize: '1.1rem' },
            '& h4': { fontSize: '1rem' },
            '& h5': { fontSize: '0.9rem' },
            '& h6': { fontSize: '0.8rem' },
            '& ul, & ol': {
              pl: 3,
              mb: 2,
            },
            '& li': {
              mb: 0.5,
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
              color: 'text.secondary',
              mb: 2,
            },
            '& code': {
              backgroundColor: 'grey.100',
              px: 0.5,
              py: 0.25,
              borderRadius: 0.5,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            },
            '& pre': {
              backgroundColor: 'grey.100',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              mb: 2,
            },
            '& pre code': {
              backgroundColor: 'transparent',
              p: 0,
            },
          }}
        >
          {content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/__(.*?)__/g, '<em>$1</em>')
                  .replace(/==(.*?)==/g, '<u>$1</u>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>'),
              }}
            />
          ) : (
            <Typography color="text.secondary" fontStyle="italic">
              No content available
            </Typography>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};
