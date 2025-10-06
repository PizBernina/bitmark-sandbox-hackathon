import React, { useState } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { ChatMessage as ChatMessageType } from '../types';
import { ToolUsageContainer } from './ToolUsageContainer';
import { ToolAnimationStyles } from './ToolUsageIndicator';

interface ChatMessageProps {
  message: ChatMessageType;
}

interface MessagePart {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

const CodeBlockComponent: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        marginY: '8px',
        borderRadius: '8px',
        backgroundColor: '#1e1e1e',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: '#2d2d2d',
          borderBottom: '1px solid #444',
        }}
      >
        <Text sx={{ fontSize: '12px', color: '#888', fontFamily: 'monospace' }}>
          {language || 'code'}
        </Text>
        <Button
          onClick={handleCopy}
          sx={{
            padding: '4px 12px',
            fontSize: '12px',
            backgroundColor: copied ? '#4caf50' : '#444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: copied ? '#4caf50' : '#555',
            },
          }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </Button>
      </Box>
      <Box
        sx={{
          padding: '12px',
          overflowX: 'auto',
        }}
      >
        <Text
          as="pre"
          sx={{
            margin: 0,
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '13px',
            color: '#d4d4d4',
            whiteSpace: 'pre',
            lineHeight: '1.5',
          }}
        >
          {code}
        </Text>
      </Box>
    </Box>
  );
};

const renderMarkdown = (text: string): React.ReactNode => {
  // Split by lines to handle lists and paragraphs
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  const processInlineMarkdown = (line: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Process bold text (**text**)
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(remaining)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${key++}`}>{remaining.substring(lastIndex, match.index)}</span>);
      }
      // Add bold text
      parts.push(<strong key={`bold-${key++}`}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < remaining.length) {
      parts.push(<span key={`text-${key++}`}>{remaining.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : [remaining];
  };

  lines.forEach((line, index) => {
    // Handle bullet points
    if (line.trim().startsWith('*') && !line.trim().startsWith('**')) {
      const content = line.trim().substring(1).trim();
      currentList.push(
        <li key={`li-${index}`} style={{ marginLeft: '1em', listStyleType: 'disc' }}>
          {processInlineMarkdown(content)}
        </li>
      );
    } else {
      // If we have a list in progress, close it
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${listKey++}`} style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
            {currentList}
          </ul>
        );
        currentList = [];
      }

      // Handle regular text with inline markdown
      if (line.trim()) {
        elements.push(
          <div key={`p-${index}`} style={{ marginBottom: '0.5em' }}>
            {processInlineMarkdown(line)}
          </div>
        );
      } else {
        // Empty line - add spacing
        elements.push(<br key={`br-${index}`} />);
      }
    }
  });

  // Close any remaining list
  if (currentList.length > 0) {
    elements.push(
      <ul key={`ul-${listKey++}`} style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
        {currentList}
      </ul>
    );
  }

  return <>{elements}</>;
};

const parseMessageContent = (content: string): MessagePart[] => {
  const parts: MessagePart[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = content.substring(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    // Add code block
    parts.push({
      type: 'code',
      content: match[2].trim(),
      language: match[1] || 'text',
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const textContent = content.substring(lastIndex);
    if (textContent.trim()) {
      parts.push({ type: 'text', content: textContent });
    }
  }

  // If no code blocks found, return the entire content as text
  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }

  return parts;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Debug logging
  console.log('ChatMessage received:', message);
  console.log('Tool usage indicators:', message.toolUsageIndicators);
  console.log('Has tool usage:', message.hasToolUsage);
  
  const getToolDisplayName = (toolName: string) => {
    const toolNames: Record<string, string> = {
      'get_bitmark_general_info': '📚 General Info',
      'get_bitmark_code_info': '💻 Code Info',
      'get_user_input_info': '🔧 Input Info'
    };
    return toolNames[toolName] || `🔧 ${toolName}`;
  };

  const getToolDescription = (tool: any) => {
    if (tool.function_name === 'get_bitmark_general_info') {
      return `Retrieved ${tool.args?.topic || 'overview'} information`;
    } else if (tool.function_name === 'get_bitmark_code_info') {
      return `Retrieved ${tool.args?.code_type || 'syntax'} information`;
    } else if (tool.function_name === 'get_user_input_info') {
      return `Retrieved ${tool.args?.input_type || 'general'} information`;
    }
    return 'Used tool';
  };

  return (
    <>
      <ToolAnimationStyles />
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
          marginBottom: '8px',
        }}
      >
        <Box>
          {/* New animated tool usage indicators */}
          {message.sender === 'ai' && message.toolUsageIndicators && message.toolUsageIndicators.length > 0 && (
            <ToolUsageContainer tools={message.toolUsageIndicators} />
          )}
          
          {/* Legacy tool usage indicators (for backward compatibility) */}
          {message.toolsUsed && message.toolsUsed.length > 0 && (
            <Box
              sx={{
                marginBottom: '6px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              {message.toolsUsed.map((tool, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    backgroundColor: '#e8f4fd',
                    border: '1px solid #63019B',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    color: '#63019B',
                    fontWeight: '500',
                  }}
                  title={getToolDescription(tool)}
                >
                  {getToolDisplayName(tool.function_name)}
                </Box>
              ))}
            </Box>
          )}
        
          <Box
            sx={{
              maxWidth: '70%',
              minWidth: message.sender === 'ai' ? '300px' : 'auto',
            }}
          >
            {message.sender === 'ai' ? (
              // Parse and render AI messages with code blocks
              parseMessageContent(message.content).map((part, index) => (
                part.type === 'code' ? (
                  <CodeBlockComponent key={index} code={part.content} language={part.language || 'text'} />
                ) : (
                  <Box
                    key={index}
                    sx={{
                      padding: '8px 12px',
                      borderRadius: '18px',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      wordWrap: 'break-word',
                      marginY: index > 0 ? '4px' : 0,
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '14px',
                      }}
                    >
                      {renderMarkdown(part.content)}
                    </Box>
                  </Box>
                )
              ))
            ) : (
              // User messages stay simple
              <Box
                sx={{
                  padding: '8px 12px',
                  borderRadius: '18px',
                  backgroundColor: '#63019B',
                  color: 'white',
                  wordWrap: 'break-word',
                }}
              >
                <Text
                  sx={{
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.content}
                </Text>
              </Box>
            )}
          </Box>
          <Text
            sx={{
              fontSize: '0.75rem',
              color: '#666',
              marginTop: '4px',
              textAlign: message.sender === 'user' ? 'right' : 'left',
            }}
          >
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </Box>
      </Box>
    </>
  );
};
