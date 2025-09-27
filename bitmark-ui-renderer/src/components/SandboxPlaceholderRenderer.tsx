import React from 'react';
import { Box, Alert, AlertTitle, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Code, PlayArrow } from '@mui/icons-material';

interface SandboxPlaceholderRendererProps {
  bitType: string;
}

export const SandboxPlaceholderRenderer: React.FC<SandboxPlaceholderRendererProps> = ({ bitType }) => {
  const getSandboxIcon = () => {
    switch (bitType) {
      case 'app-code-editor':
        return <Code sx={{ fontSize: '1.2rem' }} />;
      case 'sandbox-output-json':
        return <Code sx={{ fontSize: '1.2rem' }} />;
      case 'sandbox-output-bitmark':
        return <PlayArrow sx={{ fontSize: '1.2rem' }} />;
      default:
        return <Code sx={{ fontSize: '1.2rem' }} />;
    }
  };

  const getSandboxTitle = () => {
    switch (bitType) {
      case 'app-code-editor':
        return 'Code Editor';
      case 'sandbox-output-json':
        return 'Sandbox JSON Output';
      case 'sandbox-output-bitmark':
        return 'Sandbox Bitmark Output';
      default:
        return 'Sandbox Content';
    }
  };

  const getSandboxDescription = () => {
    switch (bitType) {
      case 'app-code-editor':
        return 'This code editor content is rendered from the JSON pane.';
      case 'sandbox-output-json':
        return 'This JSON output content is rendered from the JSON pane.';
      case 'sandbox-output-bitmark':
        return 'This bitmark output content is rendered from the JSON pane.';
      default:
        return 'This sandbox content is rendered from the JSON pane.';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 2 }}>
        <Alert 
          severity="info"
          sx={{
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
            '& .MuiAlert-icon': {
              fontSize: '1.2rem',
            },
          }}
        >
          <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getSandboxIcon()}
            {getSandboxTitle()}
          </AlertTitle>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            {getSandboxDescription()}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label="Sandbox Integration" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Rendering from JSON pane...
            </Typography>
          </Box>
        </Alert>
      </Box>
    </motion.div>
  );
};
