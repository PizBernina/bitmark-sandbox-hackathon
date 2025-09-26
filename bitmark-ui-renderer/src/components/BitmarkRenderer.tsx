import React, { useState, useEffect, useCallback } from 'react';
import { Box, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { BitmarkNode, BitmarkRendererProps, UserInteraction, RendererError, ClozeBit, MultipleChoiceBit, TextBit, ClozeAndMultipleChoiceBit } from '../types';
import { ClozeRenderer } from './ClozeRenderer';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { TextRenderer } from './TextRenderer';
import { ClozeAndMultipleChoiceRenderer } from './ClozeAndMultipleChoiceRenderer';
import { ErrorRenderer } from './ErrorRenderer';

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


  // Render a single bit
  const renderBit = useCallback((bit: BitmarkNode, index: number) => {
    const bitId = `bit-${index}-${bit.type}`;
    
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
              onInteraction={(value) => handleInteraction({
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
              onInteraction={(value) => handleInteraction({
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
              onInteraction={(value) => handleInteraction({
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
      
      // Validate each bit
      parsedData.forEach((bit, index) => {
        const bitType = bit.type || bit.bit?.type || 'unknown';
        
        // Check for unsupported bit types
        const supportedTypes = ['cloze', 'multiple-choice', 'cloze-and-multiple-choice-text', 'text', 'paragraph', 'header'];
        if (!supportedTypes.includes(bitType)) {
          errors.push({
            type: 'unsupported',
            message: `Unsupported bit type: ${bitType}`,
            bitType: bitType
          });
        }
      });
      
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
        {parsedData.map((bit, index) => renderBit(bit, index))}
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
