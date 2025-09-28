import React from 'react';

import { AIChatWindow, AIChatButton, useChatState } from '../../lib/bitmark-ai-chat/index.js';

export const AIChatManager: React.FC = () => {
  const { chatState, isLoading, toggleVisibility, toggleMinimize, updatePosition, sendMessage, clearMessages } =
    useChatState();

  const handleClose = () => {
    // Close the window by hiding it
    toggleVisibility();
  };

  return (
    <>
      <AIChatButton onClick={toggleVisibility} isVisible={chatState.isVisible} />
      <AIChatWindow
        isVisible={chatState.isVisible}
        onMinimize={toggleMinimize}
        onClear={clearMessages}
        onSendMessage={sendMessage}
        messages={chatState.messages}
        isMinimized={chatState.isMinimized}
        position={chatState.position}
        onPositionChange={updatePosition}
        onClose={handleClose}
        isLoading={isLoading}
      />
    </>
  );
};
