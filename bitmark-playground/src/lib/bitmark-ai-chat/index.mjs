// src/components/AIChatWindow.tsx
import { useState as useState3, useRef, useEffect as useEffect2 } from "react";
import { Box as Box5, Text as Text4, Button as Button2 } from "theme-ui";

// src/components/ChatMessage.tsx
import { Box as Box3, Text as Text3 } from "theme-ui";

// src/components/ToolUsageContainer.tsx
import { Box as Box2, Text as Text2 } from "theme-ui";

// src/components/ToolUsageIndicator.tsx
import { useState, useEffect } from "react";
import { Box, Text } from "theme-ui";
import { jsx, jsxs } from "react/jsx-runtime";
var ToolUsageIndicator = ({ tool, index = 0 }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 300);
    return () => clearTimeout(timer);
  }, [index]);
  useEffect(() => {
    if (tool.status === "completed") {
      const timer = setTimeout(() => setIsCompleted(true), 1e3);
      return () => clearTimeout(timer);
    }
  }, [tool.status]);
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxs(
    Box,
    {
      sx: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        margin: "4px",
        borderRadius: "20px",
        background: isCompleted ? "linear-gradient(45deg, #e8f5e8, #d4edda)" : "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
        border: `1px solid ${isCompleted ? "#c3e6cb" : "#ddd"}`,
        fontSize: "14px",
        animation: isCompleted ? "toolComplete 0.5s ease-out" : "toolPulse 1.5s ease-in-out infinite",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease-out"
      },
      children: [
        /* @__PURE__ */ jsx(
          Text,
          {
            sx: {
              fontSize: "16px",
              animation: isCompleted ? "none" : "toolBounce 1s ease-in-out infinite"
            },
            children: tool.emoji
          }
        ),
        /* @__PURE__ */ jsx(
          Text,
          {
            sx: {
              fontWeight: 500,
              color: "#333"
            },
            children: tool.description
          }
        )
      ]
    }
  );
};
var ToolAnimationStyles = () => /* @__PURE__ */ jsx("style", { children: `
      @keyframes toolPulse {
        0%, 100% { 
          transform: scale(1); 
          opacity: 0.8; 
        }
        50% { 
          transform: scale(1.05); 
          opacity: 1; 
        }
      }
      
      @keyframes toolBounce {
        0%, 100% { 
          transform: translateY(0); 
        }
        50% { 
          transform: translateY(-2px); 
        }
      }
      
      @keyframes toolComplete {
        0% { 
          transform: scale(1); 
        }
        50% { 
          transform: scale(1.1); 
        }
        100% { 
          transform: scale(1); 
        }
      }
    ` });

// src/components/ToolUsageContainer.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ToolUsageContainer = ({
  tools,
  isVisible = true
}) => {
  console.log("ToolUsageContainer received:", { tools, isVisible });
  if (!tools || tools.length === 0 || !isVisible) {
    console.log("ToolUsageContainer: Not rendering - no tools or not visible");
    return null;
  }
  return /* @__PURE__ */ jsxs2(
    Box2,
    {
      sx: {
        margin: "10px 0",
        padding: "10px",
        background: "#f8f9fa",
        borderRadius: "8px",
        borderLeft: "4px solid #007bff",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.3s ease-out"
      },
      children: [
        /* @__PURE__ */ jsx2(
          Text2,
          {
            sx: {
              marginBottom: "8px",
              fontSize: "12px",
              color: "#666",
              fontWeight: 500
            },
            children: "\u{1F916} AI is using tools..."
          }
        ),
        /* @__PURE__ */ jsx2(
          Box2,
          {
            sx: {
              display: "flex",
              flexWrap: "wrap",
              gap: "4px"
            },
            children: tools.map((tool, index) => /* @__PURE__ */ jsx2(
              ToolUsageIndicator,
              {
                tool,
                index
              },
              `${tool.function_name}-${index}`
            ))
          }
        )
      ]
    }
  );
};

// src/components/ChatMessage.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var ChatMessage = ({ message }) => {
  console.log("ChatMessage received:", message);
  console.log("Tool usage indicators:", message.toolUsageIndicators);
  console.log("Has tool usage:", message.hasToolUsage);
  const getToolDisplayName = (toolName) => {
    const toolNames = {
      "get_bitmark_general_info": "\u{1F4DA} General Info",
      "get_bitmark_code_info": "\u{1F4BB} Code Info",
      "get_user_input_info": "\u{1F527} Input Info"
    };
    return toolNames[toolName] || `\u{1F527} ${toolName}`;
  };
  const getToolDescription = (tool) => {
    if (tool.function_name === "get_bitmark_general_info") {
      return `Retrieved ${tool.args?.topic || "overview"} information`;
    } else if (tool.function_name === "get_bitmark_code_info") {
      return `Retrieved ${tool.args?.code_type || "syntax"} information`;
    } else if (tool.function_name === "get_user_input_info") {
      return `Retrieved ${tool.args?.input_type || "general"} information`;
    }
    return "Used tool";
  };
  return /* @__PURE__ */ jsxs3(Fragment, { children: [
    /* @__PURE__ */ jsx3(ToolAnimationStyles, {}),
    /* @__PURE__ */ jsx3(
      Box3,
      {
        sx: {
          display: "flex",
          justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
          marginBottom: "8px"
        },
        children: /* @__PURE__ */ jsxs3(Box3, { children: [
          message.sender === "ai" && message.toolUsageIndicators && message.toolUsageIndicators.length > 0 && /* @__PURE__ */ jsx3(ToolUsageContainer, { tools: message.toolUsageIndicators }),
          message.toolsUsed && message.toolsUsed.length > 0 && /* @__PURE__ */ jsx3(
            Box3,
            {
              sx: {
                marginBottom: "6px",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px"
              },
              children: message.toolsUsed.map((tool, index) => /* @__PURE__ */ jsx3(
                Box3,
                {
                  sx: {
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "2px 6px",
                    backgroundColor: "#e8f4fd",
                    border: "1px solid #63019B",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    color: "#63019B",
                    fontWeight: "500"
                  },
                  title: getToolDescription(tool),
                  children: getToolDisplayName(tool.function_name)
                },
                index
              ))
            }
          ),
          /* @__PURE__ */ jsx3(
            Box3,
            {
              sx: {
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: "18px",
                backgroundColor: message.sender === "user" ? "#63019B" : "#f0f0f0",
                color: message.sender === "user" ? "white" : "#333",
                wordWrap: "break-word"
              },
              children: /* @__PURE__ */ jsx3(
                Text3,
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
          /* @__PURE__ */ jsx3(
            Text3,
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
    )
  ] });
};

// src/components/ChatInput.tsx
import { useState as useState2 } from "react";
import { Box as Box4, Input, Button } from "theme-ui";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var ChatInput = ({ onSendMessage, disabled = false, isLoading = false }) => {
  const [message, setMessage] = useState2("");
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
  return /* @__PURE__ */ jsxs4(
    Box4,
    {
      sx: {
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "white"
      },
      children: [
        /* @__PURE__ */ jsx4(
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
        /* @__PURE__ */ jsx4(
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
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
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
  const [isDragging, setIsDragging] = useState3(false);
  const [dragStart, setDragStart] = useState3({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const messagesEndRef = useRef(null);
  useEffect2(() => {
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
  useEffect2(() => {
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
  return /* @__PURE__ */ jsxs5(
    Box5,
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
        /* @__PURE__ */ jsxs5(
          Box5,
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
              /* @__PURE__ */ jsxs5(
                Box5,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    cursor: "move"
                  },
                  children: [
                    /* @__PURE__ */ jsx5(
                      Box5,
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
                    /* @__PURE__ */ jsx5(
                      Text4,
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
              /* @__PURE__ */ jsxs5(
                Box5,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  },
                  children: [
                    /* @__PURE__ */ jsx5(
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
                    /* @__PURE__ */ jsx5(
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
                    /* @__PURE__ */ jsx5(
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
        !isMinimized && /* @__PURE__ */ jsxs5(Fragment2, { children: [
          /* @__PURE__ */ jsxs5(
            Box5,
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
                messages.length === 0 ? /* @__PURE__ */ jsx5(
                  Box5,
                  {
                    sx: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#666",
                      textAlign: "center"
                    },
                    children: /* @__PURE__ */ jsx5(Text4, { sx: { fontSize: "14px" }, children: "Start a conversation with AI" })
                  }
                ) : messages.map((message) => /* @__PURE__ */ jsx5(ChatMessage, { message }, message.id)),
                /* @__PURE__ */ jsx5("div", { ref: messagesEndRef })
              ]
            }
          ),
          /* @__PURE__ */ jsx5(ChatInput, { onSendMessage, isLoading })
        ] })
      ]
    }
  );
};

// src/components/AIChatButton.tsx
import { Button as Button3 } from "theme-ui";
import { jsx as jsx6 } from "react/jsx-runtime";
var AIChatButton = ({ onClick, isVisible }) => {
  return /* @__PURE__ */ jsx6(
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
import { useState as useState4, useCallback } from "react";
var generateId = () => Math.random().toString(36).substr(2, 9);
var useChatState = (initialPosition = { x: window.innerWidth - 370, y: 50 }) => {
  const [chatState, setChatState] = useState4({
    messages: [],
    isMinimized: false,
    position: initialPosition,
    isVisible: false
  });
  const [isLoading, setIsLoading] = useState4(false);
  const addMessage = useCallback((content, sender, toolsUsed, toolUsageIndicators, hasToolUsage) => {
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
  const sendMessage = useCallback(async (message, paneContent) => {
    addMessage(message, "user");
    setIsLoading(true);
    try {
      const conversationHistory = chatState.messages.map((msg) => ({
        role: msg.sender === "ai" ? "assistant" : msg.sender,
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
          conversation_history: conversationHistory,
          pane_content: paneContent
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Backend response:", data);
      console.log("Tools used:", data.tools_used);
      console.log("Tool usage indicators:", data.tool_usage_indicators);
      console.log("Has tool usage:", data.has_tool_usage);
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
export {
  AIChatButton,
  AIChatWindow,
  ChatInput,
  ChatMessage as ChatMessageComponent,
  ToolUsageContainer,
  ToolUsageIndicator,
  useChatState
};
//# sourceMappingURL=index.mjs.map