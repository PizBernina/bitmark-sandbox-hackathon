import React from 'react';
import { Box, Text } from 'theme-ui';
import { ToolUsage } from '../types';
import { ToolUsageIndicator } from './ToolUsageIndicator';

interface ToolUsageContainerProps {
  tools: ToolUsage[];
  isVisible?: boolean;
}

export const ToolUsageContainer: React.FC<ToolUsageContainerProps> = ({ 
  tools, 
  isVisible = true 
}) => {
  // Debug logging
  console.log('ToolUsageContainer received:', { tools, isVisible });
  
  if (!tools || tools.length === 0 || !isVisible) {
    console.log('ToolUsageContainer: Not rendering - no tools or not visible');
    return null;
  }

  return (
    <Box
      sx={{
        margin: '10px 0',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.3s ease-out',
      }}
    >
      <Text
        sx={{
          marginBottom: '8px',
          fontSize: '12px',
          color: '#666',
          fontWeight: 500,
        }}
      >
        🤖 AI is using tools...
      </Text>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {tools.map((tool, index) => (
          <ToolUsageIndicator 
            key={`${tool.function_name}-${index}`} 
            tool={tool} 
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};
