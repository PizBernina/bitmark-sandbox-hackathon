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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_theme_ui.Box,
    {
      sx: {
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "8px"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_theme_ui.Box, { children: [
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
      ] })
    }
  );
};

// src/components/ChatInput.tsx
var import_react = require("react");
var import_theme_ui2 = require("theme-ui");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ChatInput = ({ onSendMessage, disabled = false }) => {
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
            disabled
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_theme_ui2.Button,
          {
            onClick: handleSend,
            disabled: !message.trim() || disabled,
            sx: {
              backgroundColor: "#63019B",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#4a0168"
              },
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
                cursor: "not-allowed"
              }
            },
            children: "\u27A4"
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
  onClose
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
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ChatInput, { onSendMessage })
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
  const addMessage = (0, import_react3.useCallback)((content, sender) => {
    const newMessage = {
      id: generateId(),
      content,
      sender,
      timestamp: /* @__PURE__ */ new Date()
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
  const sendMessage = (0, import_react3.useCallback)((message) => {
    addMessage(message, "user");
    setTimeout(() => {
      addMessage(`Echo: ${message}`, "ai");
    }, 1e3);
  }, [addMessage]);
  return {
    chatState,
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