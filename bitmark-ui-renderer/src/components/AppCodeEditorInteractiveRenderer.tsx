import React, { useState, useCallback } from 'react';

import { Code, DataObject, PlayArrow, Visibility, CodeOff } from '@mui/icons-material';
import { Box, Typography, Chip, Paper, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';

import { ClozeRenderer } from './ClozeRenderer';
import { ClozeAndMultipleChoiceRenderer } from './ClozeAndMultipleChoiceRenderer';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { TextRenderer } from './TextRenderer';
import { UserInteraction } from '../types';
import { parseBitmarkContent, extractOptions, getPrimaryInteractiveType } from '../utils/ContentParser';

interface AppCodeEditorInteractiveRendererProps {
  bit: {
    type: string;
    content?: string;
    computerLanguage?: string;
    body?: any;
    id?: string;
  };
  onInteraction?: (interaction: UserInteraction) => void;
  defaultView?: 'code' | 'interactive';
}

export const AppCodeEditorInteractiveRenderer: React.FC<AppCodeEditorInteractiveRendererProps> = ({ 
  bit, 
  onInteraction,
  defaultView = 'interactive'
}) => {
  const [viewMode, setViewMode] = useState<'code' | 'interactive'>(defaultView);
  const [interactions, setInteractions] = useState<Array<{ type: string; value: string; timestamp: number }>>([]);

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
  const id = bit.id || 'app-code-editor';

  const handleInteraction = useCallback((value: string) => {
    const interaction: UserInteraction = {
      type: 'app-code-editor',
      bitId: id,
      value,
      timestamp: Date.now()
    };
    
    setInteractions(prev => [...prev, { type: 'app-code-editor', value, timestamp: Date.now() }]);
    onInteraction?.(interaction);
  }, [id, onInteraction]);

  // Parse the content to determine what to render
  const parsedContent = parseBitmarkContent(content);
  const primaryType = getPrimaryInteractiveType(content);
  const options = extractOptions(parsedContent.parts);

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

  // Render interactive content based on the primary type
  const renderInteractiveContent = () => {
    if (!parsedContent.hasInteractiveElements) {
      return (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            No interactive elements found in content
          </Typography>
        </Box>
      );
    }

    // Create a mock bit object for the renderers
    const mockBit = {
      type: primaryType || 'text',
      content: content,
      id: id,
    };

    switch (primaryType) {
      case 'cloze':
        return (
          <ClozeRenderer
            bit={mockBit as any}
            onInteraction={handleInteraction}
          />
        );
      
      case 'multiple-choice':
        return (
          <MultipleChoiceRenderer
            bit={mockBit as any}
            onInteraction={handleInteraction}
          />
        );
      
      case 'cloze-and-multiple-choice':
        return (
          <ClozeAndMultipleChoiceRenderer
            bit={mockBit as any}
            onInteraction={handleInteraction}
          />
        );
      
      case 'header':
        return (
          <TextRenderer
            bit={mockBit as any}
          />
        );
      
      default:
        return (
          <TextRenderer
            bit={mockBit as any}
          />
        );
    }
  };

  // Render code view
  const renderCodeView = () => (
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
  );

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
            />
          )}
          
          {/* View mode toggle */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewMode === 'interactive'}
                  onChange={(e) => setViewMode(e.target.checked ? 'interactive' : 'code')}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {viewMode === 'interactive' ? <Visibility fontSize="small" /> : <CodeOff fontSize="small" />}
                  <Typography variant="caption">
                    {viewMode === 'interactive' ? 'Interactive' : 'Code'}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Box>
        </Box>
        
        {viewMode === 'code' ? renderCodeView() : renderInteractiveContent()}
        
        {/* Show interaction history if any */}
        {interactions.length > 0 && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Interactions: {interactions.length}
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};
