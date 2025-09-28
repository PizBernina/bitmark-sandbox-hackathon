import React, { useState, useEffect } from 'react';
import { Box, Text } from 'theme-ui';
import { ToolUsage } from '../types';

interface ToolUsageIndicatorProps {
  tool: ToolUsage;
  index?: number;
}

export const ToolUsageIndicator: React.FC<ToolUsageIndicatorProps> = ({ tool, index = 0 }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger the appearance of multiple tools
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 300);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (tool.status === 'completed') {
      const timer = setTimeout(() => setIsCompleted(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [tool.status]);

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        margin: '4px',
        borderRadius: '20px',
        background: isCompleted 
          ? 'linear-gradient(45deg, #e8f5e8, #d4edda)'
          : 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
        border: `1px solid ${isCompleted ? '#c3e6cb' : '#ddd'}`,
        fontSize: '14px',
        animation: isCompleted ? 'toolComplete 0.5s ease-out' : 'toolPulse 1.5s ease-in-out infinite',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease-out',
      }}
    >
      <Text
        sx={{
          fontSize: '16px',
          animation: isCompleted ? 'none' : 'toolBounce 1s ease-in-out infinite',
        }}
      >
        {tool.emoji}
      </Text>
      <Text
        sx={{
          fontWeight: 500,
          color: '#333',
        }}
      >
        {tool.description}
      </Text>
    </Box>
  );
};

// CSS animations (injected via style tag)
export const ToolAnimationStyles = () => (
  <style>
    {`
      @keyframes toolPulse {
        0%, 100% { 
          transform: scale(1); 
          opacity: 0.8; 
        }
        50% { 
          transform: scale(1.05); 
          opacity: 1; 
        }
      }
      
      @keyframes toolBounce {
        0%, 100% { 
          transform: translateY(0); 
        }
        50% { 
          transform: translateY(-2px); 
        }
      }
      
      @keyframes toolComplete {
        0% { 
          transform: scale(1); 
        }
        50% { 
          transform: scale(1.1); 
        }
        100% { 
          transform: scale(1); 
        }
      }
    `}
  </style>
);
