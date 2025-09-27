import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { Box, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

import { AppCodeEditorInteractiveRenderer } from './AppCodeEditorInteractiveRenderer';
import { AppCodeEditorRenderer } from './AppCodeEditorRenderer';
import { ClozeAndMultipleChoiceRenderer } from './ClozeAndMultipleChoiceRenderer';
import { ClozeRenderer } from './ClozeRenderer';
import { ErrorRenderer } from './ErrorRenderer';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { SandboxOutputGroupRenderer } from './SandboxOutputGroupRenderer';
import { SandboxPlaceholderRenderer } from './SandboxPlaceholderRenderer';
import { TextRenderer } from './TextRenderer';
import { BitmarkNode, BitmarkRendererProps, UserInteraction, RendererError, ClozeBit, MultipleChoiceBit, TextBit, ClozeAndMultipleChoiceBit } from '../types';

const BitmarkRenderer: React.FC<BitmarkRendererProps> = ({
  data,
  onInteraction,
  className,
  style,
}) => {
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [errors, setErrors] = useState<RendererError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle user interactions
  const handleInteraction = useCallback((interaction: UserInteraction) => {
    setInteractions(prev => [...prev, interaction]);
    onInteraction?.(interaction);
  }, [onInteraction]);

  // Group related sandbox bits
  const groupSandboxBits = useCallback((bits: BitmarkNode[]) => {
    const groups = new Map<string, {
      editor?: BitmarkNode;
      outputs: Array<{ bit: BitmarkNode; index: number }>;
    }>();
    const standaloneBits: Array<{ bit: BitmarkNode; index: number }> = [];

    bits.forEach((bit, index) => {
      const bitType = bit.type || bit.bit?.type || 'unknown';
      
      if (bitType === 'app-code-editor') {
        // Handle ID which might be an array or string
        let id = bit.id || bit.bit?.id || `editor-${index}`;
        if (Array.isArray(id)) {
          id = id[0] || `editor-${index}`;
        }
        if (!groups.has(id)) {
          groups.set(id, { editor: bit, outputs: [] });
        } else {
          groups.get(id)!.editor = bit;
        }
      } else if (bitType === 'sandbox-output-json' || bitType === 'sandbox-output-bitmark') {
        // Handle fromId which might be an array or string
        let fromId = bit.fromId || bit.bit?.fromId || bit.properties?.fromId;
        if (Array.isArray(fromId)) {
          fromId = fromId[0];
        }
        if (fromId && groups.has(fromId)) {
          groups.get(fromId)!.outputs.push({ bit, index });
        } else {
          // If no matching editor found, treat as standalone
          standaloneBits.push({ bit, index });
        }
      } else {
        standaloneBits.push({ bit, index });
      }
    });

    return { groups, standaloneBits };
  }, []);

  // Render a single bit
  const renderBit = useCallback((bit: BitmarkNode, index: number) => {
    // Create a more unique key that includes the bit's ID if available
    const bitId = bit.id ? `bit-${bit.id}-${bit.type}` : `bit-${index}-${bit.type}`;

    try {
      // Handle different bitmark structures
      const bitType = bit.type || bit.bit?.type || 'unknown';
      
      // Debug logging - disabled for production build
      // if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      //   console.log('Rendering bit:', { bit, bitType, content: bit.content });
      // }
      
      switch (bitType) {
        case 'cloze':
          return (
            <ClozeRenderer
              key={bitId}
              bit={bit as ClozeBit}
              onInteraction={(value: string) => handleInteraction({
                type: 'cloze',
                bitId,
                value,
                timestamp: Date.now()
              })}
            />
          );
        
        case 'multiple-choice':
          return (
            <MultipleChoiceRenderer
              key={bitId}
              bit={bit as MultipleChoiceBit}
              onInteraction={(value: string) => handleInteraction({
                type: 'multiple-choice',
                bitId,
                value,
                timestamp: Date.now()
              })}
            />
          );
        
        case 'cloze-and-multiple-choice-text':
          return (
            <ClozeAndMultipleChoiceRenderer
              key={bitId}
              bit={bit as ClozeAndMultipleChoiceBit}
              onInteraction={(value: string) => handleInteraction({
                type: 'cloze',
                bitId,
                value,
                timestamp: Date.now()
              })}
            />
          );
        
        case 'text':
        case 'paragraph':
        case 'header':
          return (
            <TextRenderer
              key={bitId}
              bit={bit as TextBit}
            />
          );
        
        case 'app-code-editor':
          return (
            <AppCodeEditorInteractiveRenderer
              key={bitId}
              bit={bit}
              onInteraction={handleInteraction}
            />
          );
        
        case 'sandbox-output-json':
        case 'sandbox-output-bitmark':
          return (
            <SandboxPlaceholderRenderer
              key={bitId}
              bitType={bitType}
            />
          );
        
        default:
          return (
            <ErrorRenderer
              key={bitId}
              error={{
                type: 'unsupported',
                message: `Unsupported bit type: ${bitType}`,
                bitType: bitType
              }}
            />
          );
      }
    } catch (error) {
      return (
        <ErrorRenderer
          key={bitId}
          error={{
            type: 'validation',
            message: `Error rendering ${bit.type} bit`,
            bitType: bit.type,
            details: error instanceof Error ? error.message : 'Unknown error'
          }}
        />
      );
    }
  }, [handleInteraction]);

  // Validate data and collect errors
  const validateData = useCallback((inputData: BitmarkNode | BitmarkNode[]): { data: BitmarkNode[], errors: RendererError[] } => {
    const errors: RendererError[] = [];
    let parsedData: BitmarkNode[] = [];
    
    try {
      if (Array.isArray(inputData)) {
        parsedData = inputData;
      } else {
        parsedData = [inputData];
      }
      
      // Note: Unsupported bit types are now handled in renderBit() to avoid duplicate warnings
      
    } catch (error) {
      errors.push({
        type: 'parsing',
        message: 'Failed to parse bitmark data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return { data: parsedData, errors };
  }, []);

  // Process data when it changes
  useEffect(() => {
    setIsLoading(true);
    
    try {
      const { data: parsedData, errors: validationErrors } = validateData(data);
      setErrors(validationErrors);
      
      // Simulate a small delay for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    } catch (error) {
      setErrors([{
        type: 'parsing',
        message: 'Failed to process bitmark data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }]);
      setIsLoading(false);
    }
  }, [data, validateData]);

  const { data: parsedData } = validateData(data);

  // Group sandbox bits using useMemo to avoid hook order issues
  const groupedData = useMemo(() => {
    return groupSandboxBits(parsedData);
  }, [parsedData, groupSandboxBits]);

  if (isLoading) {
    return (
      <Box
        className={className}
        style={style}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className={className}
      style={style}
      sx={{
        padding: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        overflow: 'auto',
        maxHeight: '100%',
      }}
    >
      {/* Display errors if any */}
      {errors.length > 0 && (
        <Box mb={2}>
          {errors.map((error, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 1 }}>
              <AlertTitle>
                {error.type === 'unsupported' ? 'Unsupported Bit Type' : 
                 error.type === 'parsing' ? 'Parsing Error' : 'Rendering Error'}
              </AlertTitle>
              {error.message}
              {error.details && (
                <Box component="pre" sx={{ fontSize: '0.875rem', mt: 1, opacity: 0.8 }}>
                  {error.details}
                </Box>
              )}
            </Alert>
          ))}
        </Box>
      )}

      {/* Render bits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {(() => {
          const { groups, standaloneBits } = groupedData;
          const elements: React.ReactNode[] = [];

          // Render grouped sandbox bits
          groups.forEach((group, groupId) => {
            if (group.editor && group.outputs.length > 0) {
              // Render as a group
              const outputs = group.outputs.map(({ bit }) => ({
                type: bit.type as 'sandbox-output-json' | 'sandbox-output-bitmark',
                fromId: bit.fromId || bit.bit?.fromId || bit.properties?.fromId || '',
                prettify: bit.prettify || bit.bit?.prettify || bit.properties?.prettify,
                content: bit.content || bit.bit?.content || bit.body?.bodyText || bit.body?.text || '',
              }));
              
              elements.push(
                <SandboxOutputGroupRenderer
                  key={`group-${groupId}`}
                  editor={group.editor}
                  outputs={outputs}
                />
              );
            } else if (group.editor) {
              // Render standalone editor
              const editorIndex = groupId.startsWith('editor-') 
                ? parseInt(groupId.replace('editor-', '')) 
                : 0;
              elements.push(renderBit(group.editor, editorIndex));
            }
          });

          // Render standalone bits
          standaloneBits.forEach(({ bit, index }) => {
            elements.push(renderBit(bit, index));
          });

          return elements;
        })()}
      </motion.div>

      {/* Debug info in development */}
      {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
        <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
          <Box component="pre" fontSize="0.75rem" color="text.secondary">
            Interactions: {interactions.length}
            {interactions.length > 0 && (
              <Box component="div" mt={1}>
                {interactions.map((interaction, i) => (
                  <Box key={i} component="div">
                    {interaction.type}: {interaction.value}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BitmarkRenderer;
