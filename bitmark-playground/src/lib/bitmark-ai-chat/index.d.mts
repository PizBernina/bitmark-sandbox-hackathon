import React from 'react';

interface ToolUsage {
    function_name: string;
    status: 'starting' | 'in_progress' | 'completed' | 'error';
    emoji: string;
    description: string;
    start_time?: string;
    end_time?: string;
}
interface ChatMessage$1 {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    toolsUsed?: ToolUsage[];
    toolUsageIndicators?: ToolUsage[];
    hasToolUsage?: boolean;
}
interface ChatState {
    messages: ChatMessage$1[];
    isMinimized: boolean;
    position: {
        x: number;
        y: number;
    };
    isVisible: boolean;
}
interface AIChatWindowProps {
    isVisible: boolean;
    onMinimize: () => void;
    onClear: () => void;
    onSendMessage: (message: string) => void;
    messages: ChatMessage$1[];
    isMinimized: boolean;
    position: {
        x: number;
        y: number;
    };
    onPositionChange: (position: {
        x: number;
        y: number;
    }) => void;
    onClose: () => void;
    isLoading?: boolean;
}
interface AIChatButtonProps {
    onClick: () => void;
    isVisible: boolean;
}

declare const AIChatWindow: React.FC<AIChatWindowProps>;

declare const AIChatButton: React.FC<AIChatButtonProps>;

interface ChatMessageProps {
    message: ChatMessage$1;
}
declare const ChatMessage: React.FC<ChatMessageProps>;

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
}
declare const ChatInput: React.FC<ChatInputProps>;

interface ToolUsageIndicatorProps {
    tool: ToolUsage;
    index?: number;
}
declare const ToolUsageIndicator: React.FC<ToolUsageIndicatorProps>;

interface ToolUsageContainerProps {
    tools: ToolUsage[];
    isVisible?: boolean;
}
declare const ToolUsageContainer: React.FC<ToolUsageContainerProps>;

declare const useChatState: (initialPosition?: {
    x: number;
    y: number;
}) => {
    chatState: ChatState;
    isLoading: boolean;
    addMessage: (content: string, sender: "user" | "ai", toolsUsed?: ToolUsage[], toolUsageIndicators?: ToolUsage[], hasToolUsage?: boolean) => void;
    clearMessages: () => void;
    toggleVisibility: () => void;
    toggleMinimize: () => void;
    updatePosition: (position: {
        x: number;
        y: number;
    }) => void;
    sendMessage: (message: string, paneContent?: Record<string, string>) => Promise<void>;
};

export { AIChatButton, type AIChatButtonProps, AIChatWindow, type AIChatWindowProps, ChatInput, type ChatMessage$1 as ChatMessage, ChatMessage as ChatMessageComponent, type ChatState, type ToolUsage, ToolUsageContainer, ToolUsageIndicator, useChatState };
