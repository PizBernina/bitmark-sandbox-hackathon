// Main exports for bitmark-ai-chat
export { AIChatWindow } from './components/AIChatWindow';
export { AIChatButton } from './components/AIChatButton';
export { ChatMessage as ChatMessageComponent } from './components/ChatMessage';
export { ChatInput } from './components/ChatInput';

// Tool usage animation components
export { ToolUsageIndicator } from './components/ToolUsageIndicator';
export { ToolUsageContainer } from './components/ToolUsageContainer';

// Hook exports
export { useChatState } from './hooks/useChatState';

// Type exports
export type { 
  ChatMessage, 
  ChatState, 
  AIChatWindowProps, 
  AIChatButtonProps, 
  ToolUsage 
} from './types';
