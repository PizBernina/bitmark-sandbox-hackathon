import React from 'react';

import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { RendererError } from '../types';

interface ErrorRendererProps {
  error: RendererError;
}

export const ErrorRenderer: React.FC<ErrorRendererProps> = ({ error }) => {
  const getErrorIcon = () => {
    // Material-UI Alert component provides its own icons, so we don't need custom icons
    return null;
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'unsupported':
        return 'Unsupported Bit Type';
      case 'parsing':
        return 'Parsing Error';
      case 'validation':
        return 'Rendering Error';
      default:
        return 'Unknown Error';
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'unsupported':
        return 'warning';
      case 'parsing':
        return 'error';
      case 'validation':
        return 'error';
      default:
        return 'info';
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
          severity={getErrorColor() as any}
          sx={{
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.2rem',
            },
          }}
        >
          <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getErrorIcon() && <span>{getErrorIcon()}</span>}
            {getErrorTitle()}
          </AlertTitle>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            {error.message}
          </Typography>
          
          {error.bitType && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
              Bit type: <code>{error.bitType}</code>
            </Typography>
          )}
          
          {error.details && (
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1,
                bgcolor: 'grey.100',
                borderRadius: 1,
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflow: 'auto',
                maxHeight: '100px',
              }}
            >
              {error.details}
            </Box>
          )}
        </Alert>
      </Box>
    </motion.div>
  );
};
