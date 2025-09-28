import React from 'react';
import { useSnapshot } from 'valtio';

import { AIChatWindow, AIChatButton, useChatState } from '../../lib/bitmark-ai-chat/index.js';
import { bitmarkState } from '../../state/bitmarkState';

export const AIChatManager: React.FC = () => {
  const snap = useSnapshot(bitmarkState);
  const { chatState, isLoading, toggleVisibility, toggleMinimize, updatePosition, sendMessage, clearMessages } =
    useChatState();

  const handleClose = () => {
    // Close the window by hiding it
    toggleVisibility();
  };

  // Create pane content from current state
  const paneContent = {
    bitmark_markup: snap.markup || '',
    json_content: snap.jsonAsString || '',
    rendered_ui: 'Rendered UI content not available', // This would need to be extracted from the DOM
    sandbox_content: 'Sandbox content not available', // This would need to be extracted from the sandbox
  };

  return (
    <>
      <AIChatButton onClick={toggleVisibility} isVisible={chatState.isVisible} />
      <AIChatWindow
        isVisible={chatState.isVisible}
        onMinimize={toggleMinimize}
        onClear={clearMessages}
        onSendMessage={(message) => sendMessage(message, paneContent)}
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
