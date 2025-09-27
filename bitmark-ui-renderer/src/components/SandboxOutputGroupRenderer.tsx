import React from 'react';
import { Box, Typography, Chip, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Code, DataObject, PlayArrow, Transform } from '@mui/icons-material';
import { AppCodeEditorRenderer } from './AppCodeEditorRenderer';

interface SandboxOutput {
  type: 'sandbox-output-json' | 'sandbox-output-bitmark';
  fromId: string;
  prettify?: boolean | number;
  content?: string;
}

interface SandboxOutputGroupRendererProps {
  editor: {
    type: string;
    content?: string;
    id?: string;
    computerLanguage?: string;
    body?: any;
  };
  outputs: SandboxOutput[];
}

export const SandboxOutputGroupRenderer: React.FC<SandboxOutputGroupRendererProps> = ({ 
  editor, 
  outputs 
}) => {
  const getOutputIcon = (type: string) => {
    switch (type) {
      case 'sandbox-output-json':
        return <DataObject sx={{ fontSize: '1rem' }} />;
      case 'sandbox-output-bitmark':
        return <PlayArrow sx={{ fontSize: '1rem' }} />;
      default:
        return <Code sx={{ fontSize: '1rem' }} />;
    }
  };

  const getOutputTitle = (type: string) => {
    switch (type) {
      case 'sandbox-output-json':
        return 'JSON Output';
      case 'sandbox-output-bitmark':
        return 'Bitmark Output';
      default:
        return 'Output';
    }
  };

  const getOutputColor = (type: string) => {
    switch (type) {
      case 'sandbox-output-json':
        return 'primary';
      case 'sandbox-output-bitmark':
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
        elevation={2}
        sx={{
          p: 0,
          mb: 3,
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Editor Section */}
        <Box sx={{ p: 2, backgroundColor: 'primary.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Transform sx={{ fontSize: '1.2rem', color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'primary.main' }}>
              Sandbox Group
            </Typography>
            <Chip
              label={`${outputs.length} output${outputs.length !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Editor Content */}
        <Box sx={{ p: 2 }}>
          <AppCodeEditorRenderer bit={editor} />
        </Box>

        {/* Outputs Section */}
        {outputs.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Generated Outputs:
              </Typography>
              
              {outputs.map((output, index) => (
                <Box key={`${output.type}-${index}`} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getOutputIcon(output.type)}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {getOutputTitle(output.type)}
                    </Typography>
                    <Chip
                      label={output.type.replace('sandbox-output-', '').toUpperCase()}
                      size="small"
                      color={getOutputColor(output.type)}
                      variant="outlined"
                    />
                    {output.prettify && (
                      <Chip
                        label={`Prettify: ${output.prettify}`}
                        size="small"
                        variant="outlined"
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
                      maxHeight: '200px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {output.content || `[Generated ${output.type.replace('sandbox-output-', '')} output would appear here]`}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </motion.div>
  );
};
