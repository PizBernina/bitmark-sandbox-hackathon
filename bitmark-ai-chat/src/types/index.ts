export interface ToolUsage {
  function_name: string;
  status: 'starting' | 'in_progress' | 'completed' | 'error';
  emoji: string;
  description: string;
  start_time?: string;
  end_time?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  toolsUsed?: ToolUsage[];
  toolUsageIndicators?: ToolUsage[];
  hasToolUsage?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isMinimized: boolean;
  position: { x: number; y: number };
  isVisible: boolean;
}

export interface AIChatWindowProps {
  isVisible: boolean;
  onMinimize: () => void;
  onClear: () => void;
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isMinimized: boolean;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export interface AIChatButtonProps {
  onClick: () => void;
  isVisible: boolean;
}
