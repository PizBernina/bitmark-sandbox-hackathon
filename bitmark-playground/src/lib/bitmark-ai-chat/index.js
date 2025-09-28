"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AIChatButton: () => AIChatButton,
  AIChatWindow: () => AIChatWindow,
  ChatInput: () => ChatInput,
  ChatMessageComponent: () => ChatMessage,
  useChatState: () => useChatState
});
module.exports = __toCommonJS(index_exports);

// src/components/AIChatWindow.tsx
var import_react2 = require("react");
var import_theme_ui3 = require("theme-ui");

// src/components/ChatMessage.tsx
var import_theme_ui = require("theme-ui");
var import_jsx_runtime = require("react/jsx-runtime");
var ChatMessage = ({ message }) => {
  // Debug logging
  console.log('ChatMessage received:', message);
  console.log('Tool usage indicators:', message.toolUsageIndicators);
  console.log('Has tool usage:', message.hasToolUsage);
  
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_theme_ui.Box,
    {
      sx: {
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "8px"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_theme_ui.Box,
          {
            children: [
              // Tool usage indicators for AI messages
              message.sender === "ai" && message.toolUsageIndicators && message.toolUsageIndicators.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_theme_ui.Box,
                {
                  sx: {
                    margin: "10px 0",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    borderLeft: "4px solid #007bff"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_theme_ui.Text,
                      {
                        sx: {
                          marginBottom: "8px",
                          fontSize: "12px",
                          color: "#666",
                          fontWeight: 500
                        },
                        children: "🤖 AI is using tools..."
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_theme_ui.Box,
                      {
                        sx: {
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px"
                        },
                        children: message.toolUsageIndicators.map((tool, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          import_theme_ui.Box,
                          {
                            key: `${tool.function_name}-${index}`,
                            sx: {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              margin: "4px",
                              borderRadius: "20px",
                              background: "linear-gradient(45deg, #e8f5e8, #d4edda)",
                              border: "1px solid #c3e6cb",
                              fontSize: "14px",
                              animation: "toolComplete 0.5s ease-out"
                            },
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                import_theme_ui.Text,
                                {
                                  sx: {
                                    fontSize: "16px"
                                  },
                                  children: tool.emoji
                                }
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                import_theme_ui.Text,
                                {
                                  sx: {
                                    fontWeight: 500,
                                    color: "#333"
                                  },
                                  children: tool.description
                                }
                              )
                            ]
                          },
                          `${tool.function_name}-${index}`
                        ))
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_theme_ui.Box,
                {
                  sx: {
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "18px",
                    backgroundColor: message.sender === "user" ? "#63019B" : "#f0f0f0",
                    color: message.sender === "user" ? "white" : "#333",
                    wordWrap: "break-word"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_theme_ui.Text,
                    {
                      sx: {
                        fontSize: "14px",
                        whiteSpace: "pre-wrap"
                      },
                      children: message.content
                    }
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_theme_ui.Text,
                {
                  sx: {
                    fontSize: "0.75rem",
                    color: "#666",
                    marginTop: "4px",
                    textAlign: message.sender === "user" ? "right" : "left"
                  },
                  children: message.timestamp.toLocaleTimeString()
                }
              )
            ]
          }
        )
      ]
    }
  );
};

// src/components/ChatInput.tsx
var import_react = require("react");
var import_theme_ui2 = require("theme-ui");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ChatInput = ({ onSendMessage, disabled = false, isLoading = false }) => {
  const [message, setMessage] = (0, import_react.useState)("");
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_theme_ui2.Box,
    {
      sx: {
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "white"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_theme_ui2.Input,
          {
            value: message,
            onChange: (e) => setMessage(e.target.value),
            onKeyPress: handleKeyPress,
            placeholder: "Type your message...",
            sx: {
              flex: 1,
              marginRight: "8px",
              borderRadius: "20px",
              border: "1px solid #e0e0e0",
              padding: "8px 12px",
              fontSize: "14px",
              "&:focus": {
                outline: "none",
                borderColor: "#63019B"
              },
              "&:hover": {
                borderColor: "#63019B"
              }
            },
            disabled: disabled || isLoading
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_theme_ui2.Button,
          {
            onClick: handleSend,
            disabled: !message.trim() || disabled || isLoading,
            sx: {
              backgroundColor: isLoading ? "#ccc" : "#63019B",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isLoading ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: isLoading ? "#ccc" : "#4a0168"
              },
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
                cursor: "not-allowed"
              }
            },
            children: isLoading ? "\u23F3" : "\u27A4"
          }
        )
      ]
    }
  );
};

// src/components/AIChatWindow.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var AIChatWindow = ({
  isVisible,
  onMinimize,
  onClear,
  onSendMessage,
  messages,
  isMinimized,
  position,
  onPositionChange,
  onClose,
  isLoading = false
}) => {
  const [isDragging, setIsDragging] = (0, import_react2.useState)(false);
  const [dragStart, setDragStart] = (0, import_react2.useState)({ x: 0, y: 0 });
  const windowRef = (0, import_react2.useRef)(null);
  const messagesEndRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    if (!isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);
  const handleMouseDown = (e) => {
    const target = e.target;
    const isButton = target.closest("button") || target.tagName === "BUTTON";
    if (!isButton) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      const maxX = window.innerWidth - 350;
      const maxY = window.innerHeight - (isMinimized ? 50 : 500);
      newPosition.x = Math.max(0, Math.min(newPosition.x, maxX));
      newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));
      onPositionChange(newPosition);
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  (0, import_react2.useEffect)(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    import_theme_ui3.Box,
    {
      ref: windowRef,
      sx: {
        position: "fixed",
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: "350px",
        height: isMinimized ? "50px" : "500px",
        backgroundColor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1e3,
        transition: "height 0.3s ease",
        overflow: "hidden"
      },
      onMouseDown: handleMouseDown,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          import_theme_ui3.Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
              cursor: "move",
              userSelect: "none"
            },
            onMouseDown: handleMouseDown,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                import_theme_ui3.Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    cursor: "move"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_theme_ui3.Box,
                      {
                        sx: {
                          display: "flex",
                          alignItems: "center",
                          color: "#666",
                          fontSize: "12px",
                          marginRight: "8px"
                        },
                        children: "\u22EE\u22EE"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_theme_ui3.Text,
                      {
                        sx: {
                          color: "#63019B",
                          fontWeight: 600,
                          fontSize: "14px"
                        },
                        children: "AI Chat"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                import_theme_ui3.Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_theme_ui3.Button,
                      {
                        onClick: onClear,
                        title: "Clear chat",
                        sx: {
                          padding: "4px",
                          color: "#63019B",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "rgba(99, 1, 155, 0.1)"
                          }
                        },
                        children: "\u{1F5D1}"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_theme_ui3.Button,
                      {
                        onClick: onMinimize,
                        title: isMinimized ? "Restore" : "Minimize",
                        sx: {
                          padding: "4px",
                          color: "#63019B",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "rgba(99, 1, 155, 0.1)"
                          }
                        },
                        children: isMinimized ? "\u25A1" : "\u2212"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_theme_ui3.Button,
                      {
                        onClick: onClose,
                        title: "Close chat",
                        sx: {
                          padding: "4px",
                          color: "#63019B",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "rgba(99, 1, 155, 0.1)"
                          }
                        },
                        children: "\u2715"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        !isMinimized && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            import_theme_ui3.Box,
            {
              sx: {
                flex: 1,
                overflowY: "auto",
                padding: "8px",
                backgroundColor: "white",
                "&::-webkit-scrollbar": {
                  width: "6px"
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1"
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#63019B",
                  borderRadius: "3px"
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#4a0168"
                }
              },
              children: [
                messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  import_theme_ui3.Box,
                  {
                    sx: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#666",
                      textAlign: "center"
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_theme_ui3.Text, { sx: { fontSize: "14px" }, children: "Start a conversation with AI" })
                  }
                ) : messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ChatMessage, { message }, message.id)),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { ref: messagesEndRef })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ChatInput, { onSendMessage, isLoading })
        ] })
      ]
    }
  );
};

// src/components/AIChatButton.tsx
var import_theme_ui4 = require("theme-ui");
var import_jsx_runtime4 = require("react/jsx-runtime");
var AIChatButton = ({ onClick, isVisible }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_theme_ui4.Button,
    {
      onClick,
      sx: {
        backgroundColor: "#63019B",
        color: "white",
        fontSize: "12px",
        padding: "4px 8px",
        minWidth: "auto",
        height: "28px",
        borderRadius: "4px",
        textTransform: "none",
        border: "none",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#4a0168"
        },
        "&:disabled": {
          backgroundColor: "#ccc",
          color: "#666"
        }
      },
      children: "AI Chat"
    }
  );
};

// src/hooks/useChatState.ts
var import_react3 = require("react");
var generateId = () => Math.random().toString(36).substr(2, 9);
var useChatState = (initialPosition = { x: window.innerWidth - 370, y: 50 }) => {
  const [chatState, setChatState] = (0, import_react3.useState)({
    messages: [],
    isMinimized: false,
    position: initialPosition,
    isVisible: false
  });
  const [isLoading, setIsLoading] = (0, import_react3.useState)(false);
  const addMessage = (0, import_react3.useCallback)((content, sender, toolsUsed, toolUsageIndicators, hasToolUsage) => {
    const newMessage = {
      id: generateId(),
      content,
      sender,
      timestamp: /* @__PURE__ */ new Date(),
      toolsUsed,
      toolUsageIndicators,
      hasToolUsage
    };
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);
  const clearMessages = (0, import_react3.useCallback)(() => {
    setChatState((prev) => ({
      ...prev,
      messages: []
    }));
  }, []);
  const toggleVisibility = (0, import_react3.useCallback)(() => {
    setChatState((prev) => ({
      ...prev,
      isVisible: !prev.isVisible
    }));
  }, []);
  const toggleMinimize = (0, import_react3.useCallback)(() => {
    setChatState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  }, []);
  const updatePosition = (0, import_react3.useCallback)((position) => {
    setChatState((prev) => ({
      ...prev,
      position
    }));
  }, []);
  const sendMessage = (0, import_react3.useCallback)(async (message) => {
    addMessage(message, "user");
    setIsLoading(true);
    try {
      const conversationHistory = chatState.messages.map((msg) => ({
        role: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          conversation_history: conversationHistory
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Debug logging
      console.log('Backend response:', data);
      console.log('Tools used:', data.tools_used);
      console.log('Tool usage indicators:', data.tool_usage_indicators);
      console.log('Has tool usage:', data.has_tool_usage);
      
      if (data.success) {
        addMessage(
          data.response, 
          "ai", 
          data.tools_used || [], 
          data.tool_usage_indicators || [],
          data.has_tool_usage || false
        );
      } else {
        addMessage(`Error: ${data.error || "Failed to get response from AI"}`, "ai");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage(`Error: ${error instanceof Error ? error.message : "Failed to connect to AI service"}`, "ai");
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, chatState.messages]);
  return {
    chatState,
    isLoading,
    addMessage,
    clearMessages,
    toggleVisibility,
    toggleMinimize,
    updatePosition,
    sendMessage
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIChatButton,
  AIChatWindow,
  ChatInput,
  ChatMessageComponent,
  useChatState
});
//# sourceMappingURL=index.js.map