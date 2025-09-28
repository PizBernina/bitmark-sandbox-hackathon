// src/components/AIChatWindow.tsx
import { useState as useState2, useRef, useEffect } from "react";
import { Box as Box3, Text as Text2, Button as Button2 } from "theme-ui";

// src/components/ChatMessage.tsx
import { Box, Text } from "theme-ui";
import { jsx, jsxs } from "react/jsx-runtime";
var ChatMessage = ({ message }) => {
  return /* @__PURE__ */ jsx(
    Box,
    {
      sx: {
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "8px"
      },
      children: /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsx(
          Box,
          {
            sx: {
              maxWidth: "70%",
              padding: "8px 12px",
              borderRadius: "18px",
              backgroundColor: message.sender === "user" ? "#63019B" : "#f0f0f0",
              color: message.sender === "user" ? "white" : "#333",
              wordWrap: "break-word"
            },
            children: /* @__PURE__ */ jsx(
              Text,
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
        /* @__PURE__ */ jsx(
          Text,
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
import { useState } from "react";
import { Box as Box2, Input, Button } from "theme-ui";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ChatInput = ({ onSendMessage, disabled = false, isLoading = false }) => {
  const [message, setMessage] = useState("");
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
  return /* @__PURE__ */ jsxs2(
    Box2,
    {
      sx: {
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "white"
      },
      children: [
        /* @__PURE__ */ jsx2(
          Input,
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
        /* @__PURE__ */ jsx2(
          Button,
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
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
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
  const [isDragging, setIsDragging] = useState2(false);
  const [dragStart, setDragStart] = useState2({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const messagesEndRef = useRef(null);
  useEffect(() => {
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
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs3(
    Box3,
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
        /* @__PURE__ */ jsxs3(
          Box3,
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
              /* @__PURE__ */ jsxs3(
                Box3,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    cursor: "move"
                  },
                  children: [
                    /* @__PURE__ */ jsx3(
                      Box3,
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
                    /* @__PURE__ */ jsx3(
                      Text2,
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
              /* @__PURE__ */ jsxs3(
                Box3,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  },
                  children: [
                    /* @__PURE__ */ jsx3(
                      Button2,
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
                    /* @__PURE__ */ jsx3(
                      Button2,
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
                    /* @__PURE__ */ jsx3(
                      Button2,
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
        !isMinimized && /* @__PURE__ */ jsxs3(Fragment, { children: [
          /* @__PURE__ */ jsxs3(
            Box3,
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
                messages.length === 0 ? /* @__PURE__ */ jsx3(
                  Box3,
                  {
                    sx: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#666",
                      textAlign: "center"
                    },
                    children: /* @__PURE__ */ jsx3(Text2, { sx: { fontSize: "14px" }, children: "Start a conversation with AI" })
                  }
                ) : messages.map((message) => /* @__PURE__ */ jsx3(ChatMessage, { message }, message.id)),
                /* @__PURE__ */ jsx3("div", { ref: messagesEndRef })
              ]
            }
          ),
          /* @__PURE__ */ jsx3(ChatInput, { onSendMessage, isLoading })
        ] })
      ]
    }
  );
};

// src/components/AIChatButton.tsx
import { Button as Button3 } from "theme-ui";
import { jsx as jsx4 } from "react/jsx-runtime";
var AIChatButton = ({ onClick, isVisible }) => {
  return /* @__PURE__ */ jsx4(
    Button3,
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
import { useState as useState3, useCallback } from "react";
var generateId = () => Math.random().toString(36).substr(2, 9);
var useChatState = (initialPosition = { x: window.innerWidth - 370, y: 50 }) => {
  const [chatState, setChatState] = useState3({
    messages: [],
    isMinimized: false,
    position: initialPosition,
    isVisible: false
  });
  const [isLoading, setIsLoading] = useState3(false);
  const addMessage = useCallback((content, sender) => {
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
  const clearMessages = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      messages: []
    }));
  }, []);
  const toggleVisibility = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      isVisible: !prev.isVisible
    }));
  }, []);
  const toggleMinimize = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  }, []);
  const updatePosition = useCallback((position) => {
    setChatState((prev) => ({
      ...prev,
      position
    }));
  }, []);
  const sendMessage = useCallback(async (message) => {
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
      if (data.success) {
        addMessage(data.response, "ai");
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
export {
  AIChatButton,
  AIChatWindow,
  ChatInput,
  ChatMessage as ChatMessageComponent,
  useChatState
};
//# sourceMappingURL=index.mjs.map