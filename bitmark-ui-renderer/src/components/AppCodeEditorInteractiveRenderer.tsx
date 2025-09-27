import React, { useState, useCallback, useMemo } from 'react';

import { Code, DataObject, PlayArrow, Visibility, CodeOff } from '@mui/icons-material';
import { Box, Typography, Chip, Paper, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';

import { ClozeRenderer } from './ClozeRenderer';
import { ClozeAndMultipleChoiceRenderer } from './ClozeAndMultipleChoiceRenderer';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { TextRenderer } from './TextRenderer';
import { ArticleRenderer } from './ArticleRenderer';
import { UserInteraction } from '../types';
import { parseBitmarkContent, extractOptions, getPrimaryInteractiveType } from '../utils/ContentParser';

interface AppCodeEditorInteractiveRendererProps {
  bit: {
    type: string;
    content?: string;
    computerLanguage?: string;
    body?: any;
    id?: string;
    bitmark?: string;
    originalBit?: {
      bitmark?: string;
      body?: string | any[];
      markup?: string;
    };
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

  // Extract content from various possible structures
  const content = useMemo(() => {
    // First check if content is already extracted (from playground)
    if (bit.content) return bit.content;
    
    // Then check body structures
    if (bit.body) {
      if (typeof bit.body === 'string') return bit.body;
      if (Array.isArray(bit.body)) {
        // For app-code-editor, the body contains the actual code content
        return bit.body
          .map((item: any) => {
            if (typeof item === 'string') {
              return item;
            } else if (item && typeof item === 'object') {
              // Handle different body structures
              if (item.bodyText) return item.bodyText;
              if (item.text) return item.text;
              if (item.content) return item.content;
              if (typeof item === 'string') return item;
            }
            return '';
          })
          .join('\n');
      }
      if (bit.body.bodyText) return bit.body.bodyText;
      if (bit.body.text) return bit.body.text;
    }
    
    // Try to find content in other locations (for bitmark content)
    if (bit.bitmark) return bit.bitmark;
    if (bit.originalBit && bit.originalBit.bitmark) return bit.originalBit.bitmark;
    if (bit.originalBit && bit.originalBit.body) {
      if (typeof bit.originalBit.body === 'string') return bit.originalBit.body;
      if (Array.isArray(bit.originalBit.body)) {
        return bit.originalBit.body
          .map((item: any) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              if (item.bodyText) return item.bodyText;
              if (item.text) return item.text;
              if (item.content) return item.content;
            }
            return '';
          })
          .join('\n');
      }
    }
    
    // For app-code-editor bits, try to extract content from the markup
    if (bit.originalBit && bit.originalBit.markup) {
      const markup = bit.originalBit.markup;
      // Extract content after the app-code-editor tag
      const lines = markup.split('\n');
      const contentLines = [];
      let inContent = false;
      
      for (const line of lines) {
        if (line.trim().startsWith('[.app-code-editor')) {
          inContent = true;
          continue;
        }
        if (inContent && line.trim() && !line.trim().startsWith('[')) {
          contentLines.push(line);
        } else if (inContent && line.trim().startsWith('[') && !line.trim().startsWith('[.app-code-editor')) {
          break;
        }
      }
      
      if (contentLines.length > 0) {
        return contentLines.join('\n').trim();
      }
    }
    
    return '';
  }, [bit.content, bit.body, bit.bitmark, bit.originalBit]);

  const language = bit.computerLanguage || 'bitmark';
  const id = bit.id || 'app-code-editor';

  const handleInteraction = useCallback((value: string) => {
    const interaction: UserInteraction = {
      type: 'app-code-editor',
      bitId: id,
      value,
      timestamp: Date.now()
    };
    
    onInteraction?.(interaction);
  }, [id, onInteraction]);

  // For JSON content, determine if we should use original JSON or extracted text
  const { displayContent, shouldUseOriginalJson } = useMemo(() => {
    if (language === 'json' && content) {
      try {
        const parsed = JSON.parse(content);
        
        // Check if this JSON contains structured data that should be parsed as-is
        const hasStructuredData = Array.isArray(parsed) 
          ? parsed.some((item: any) => item && typeof item === 'object' && item.type)
          : parsed && typeof parsed === 'object' && parsed.type;
        
        if (hasStructuredData) {
          // Use original JSON for structured data (like articles)
          return { displayContent: content, shouldUseOriginalJson: true };
        }
        
        // For simple JSON, extract text content
        if (Array.isArray(parsed)) {
          const extractedContent = parsed
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') {
                if (item.body && item.body.bodyText) return item.body.bodyText;
                if (item.body && typeof item.body === 'string') return item.body;
                if (item.content) return item.content;
                if (item.text) return item.text;
              }
              return '';
            })
            .filter(Boolean)
            .join('\n');
          if (extractedContent) {
            return { displayContent: extractedContent, shouldUseOriginalJson: false };
          }
        } else if (parsed && typeof parsed === 'object') {
          if (parsed.body && parsed.body.bodyText) {
            return { displayContent: parsed.body.bodyText, shouldUseOriginalJson: false };
          } else if (parsed.body && typeof parsed.body === 'string') {
            return { displayContent: parsed.body, shouldUseOriginalJson: false };
          } else if (parsed.content) {
            return { displayContent: parsed.content, shouldUseOriginalJson: false };
          } else if (parsed.text) {
            return { displayContent: parsed.text, shouldUseOriginalJson: false };
          }
        }
      } catch {
        // Not JSON, use content as-is
      }
    }
    return { displayContent: content, shouldUseOriginalJson: false };
  }, [language, content]);

  // Parse the content to determine what to render
  const parsedContent = parseBitmarkContent(displayContent);
  const primaryType = getPrimaryInteractiveType(displayContent);
  const options = extractOptions(parsedContent.parts);

  console.log('AppCodeEditorInteractiveRenderer: displayContent:', displayContent);
  console.log('AppCodeEditorInteractiveRenderer: parsedContent:', parsedContent);
  console.log('AppCodeEditorInteractiveRenderer: primaryType:', primaryType);
  console.log('AppCodeEditorInteractiveRenderer: hasInteractiveElements:', parsedContent.hasInteractiveElements);

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
      // If no interactive elements, render as text content
      return (
        <Box sx={{ p: 2 }}>
          <TextRenderer
            bit={{
              type: 'text',
              content: displayContent,
              id: id,
            }}
          />
        </Box>
      );
    }

    // For article type, use the parsed content from ContentParser
    if (primaryType === 'article') {
      console.log('AppCodeEditorInteractiveRenderer: Rendering article, looking for article part');
      const articlePart = parsedContent.parts.find(part => part.type === 'article');
      console.log('AppCodeEditorInteractiveRenderer: Found article part:', articlePart);
      if (articlePart) {
        const articleBit = {
          type: 'article' as const,
          content: articlePart.content,
          title: articlePart.title,
          level: articlePart.level || 1,
          id: id,
        };
        console.log('AppCodeEditorInteractiveRenderer: Created articleBit:', articleBit);
        return (
          <ArticleRenderer
            bit={articleBit}
            onInteraction={handleInteraction}
          />
        );
      } else {
        console.log('AppCodeEditorInteractiveRenderer: No article part found in parsedContent.parts:', parsedContent.parts);
      }
    }

    // Create a mock bit object for other renderers
    const mockBit = {
      type: primaryType || 'text',
      content: displayContent,
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
      </Paper>
    </motion.div>
  );
};
