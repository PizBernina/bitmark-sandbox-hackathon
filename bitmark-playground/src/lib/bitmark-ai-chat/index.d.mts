import React from 'react';

interface ChatMessage$1 {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
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
}
declare const ChatInput: React.FC<ChatInputProps>;

declare const useChatState: (initialPosition?: {
    x: number;
    y: number;
}) => {
    chatState: ChatState;
    addMessage: (content: string, sender: "user" | "ai") => void;
    clearMessages: () => void;
    toggleVisibility: () => void;
    toggleMinimize: () => void;
    updatePosition: (position: {
        x: number;
        y: number;
    }) => void;
    sendMessage: (message: string) => void;
};

export { AIChatButton, type AIChatButtonProps, AIChatWindow, type AIChatWindowProps, ChatInput, type ChatMessage$1 as ChatMessage, ChatMessage as ChatMessageComponent, type ChatState, useChatState };
