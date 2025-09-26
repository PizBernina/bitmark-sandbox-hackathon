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
  BitmarkRenderer: () => BitmarkRenderer_default,
  ClozeAndMultipleChoiceRenderer: () => ClozeAndMultipleChoiceRenderer,
  ClozeRenderer: () => ClozeRenderer,
  ErrorRenderer: () => ErrorRenderer,
  MultipleChoiceRenderer: () => MultipleChoiceRenderer,
  TextRenderer: () => TextRenderer,
  ThemeProvider: () => ThemeProvider
});
module.exports = __toCommonJS(index_exports);

// src/components/BitmarkRenderer.tsx
var import_react4 = require("react");
var import_material6 = require("@mui/material");
var import_framer_motion6 = require("framer-motion");

// src/components/ClozeRenderer.tsx
var import_react = require("react");
var import_material = require("@mui/material");
var import_framer_motion = require("framer-motion");
var import_jsx_runtime = require("react/jsx-runtime");
var ClozeRenderer = ({ bit, onInteraction }) => {
  const [value, setValue] = (0, import_react.useState)("");
  const [isFocused, setIsFocused] = (0, import_react.useState)(false);
  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onInteraction(newValue);
  };
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const parseContent = (content) => {
    if (!content) {
      return [{
        type: "text",
        content: "No content available"
      }];
    }
    const parts = content.split(/(\[_[^\]]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith("[_") && part.endsWith("]")) {
        const correctAnswer = part.slice(2, -1);
        return {
          type: "cloze",
          correctAnswer,
          placeholder: bit.placeholder || "Fill in the blank"
        };
      }
      return {
        type: "text",
        content: part
      };
    });
  };
  const parsedParts = parseContent(bit.content);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_material.Box,
    {
      sx: {
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        mb: 2
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Typography, { variant: "body1", component: "div", sx: { lineHeight: 2.5 }, children: parsedParts.map((part, index) => {
        if (part.type === "cloze") {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_framer_motion.motion.span,
            {
              initial: { scale: 0.95 },
              animate: { scale: 1 },
              transition: { duration: 0.2 },
              style: { display: "inline-block", verticalAlign: "middle" },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_material.TextField,
                {
                  value,
                  onChange: handleChange,
                  onFocus: handleFocus,
                  onBlur: handleBlur,
                  placeholder: part.placeholder,
                  variant: "outlined",
                  size: "small",
                  sx: {
                    mx: 0.5,
                    minWidth: 120,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: isFocused ? "primary.50" : "grey.100",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "primary.100"
                      },
                      "&.Mui-focused": {
                        backgroundColor: "primary.50",
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
                      }
                    }
                  }
                }
              )
            },
            index
          );
        }
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "inline" }, children: part.content }, index);
      }) })
    }
  );
};

// src/components/MultipleChoiceRenderer.tsx
var import_react2 = require("react");
var import_material2 = require("@mui/material");
var import_framer_motion2 = require("framer-motion");
var import_jsx_runtime2 = require("react/jsx-runtime");
var MultipleChoiceRenderer = ({ bit, onInteraction }) => {
  const [selectedValue, setSelectedValue] = (0, import_react2.useState)(bit.selectedValue || "");
  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onInteraction(newValue);
  };
  const parseContent = (content) => {
    if (!content) {
      return [{
        type: "text",
        content: "No content available"
      }];
    }
    const parts = content.split(/(\[[-+][^\]]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith("[-") || part.startsWith("[+")) {
        const isCorrect = part.startsWith("[+");
        const text = part.slice(2, -1).trim();
        return {
          type: "option",
          text,
          correct: isCorrect,
          value: text.toLowerCase().replace(/\s+/g, "-")
        };
      }
      return {
        type: "text",
        content: part
      };
    });
  };
  const parsedParts = parseContent(bit.content);
  const options = parsedParts.filter((part) => part.type === "option");
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_material2.Box,
    {
      sx: {
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        mb: 2
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_material2.Typography, { variant: "body1", component: "div", children: [
        parsedParts.map((part, index) => {
          if (part.type === "option") {
            return null;
          }
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: part.content }, index);
        }),
        options.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_framer_motion2.motion.div,
          {
            initial: { scale: 0.95 },
            animate: { scale: 1 },
            transition: { duration: 0.2 },
            style: { marginTop: 16 },
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_material2.FormControl, { size: "small", sx: { minWidth: 200 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.InputLabel, { children: "Choose an option" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                import_material2.Select,
                {
                  value: selectedValue,
                  onChange: handleChange,
                  label: "Choose an option",
                  sx: {
                    backgroundColor: "grey.100",
                    "&:hover": {
                      backgroundColor: "primary.100"
                    },
                    "&.Mui-focused": {
                      backgroundColor: "primary.50"
                    }
                  },
                  children: options.map((option, optionIndex) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.MenuItem, { value: option.value, children: option.text }, optionIndex))
                }
              )
            ] })
          }
        )
      ] })
    }
  );
};

// src/components/TextRenderer.tsx
var import_material3 = require("@mui/material");
var import_framer_motion3 = require("framer-motion");
var import_jsx_runtime3 = require("react/jsx-runtime");
var TextRenderer = ({ bit }) => {
  const { content, type, level = 1, formatting } = bit;
  const parseInlineFormatting = (text) => {
    if (!text) {
      return ["No content available"];
    }
    const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|==[^=]+==)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_material3.Typography,
          {
            component: "span",
            sx: { fontWeight: "bold" },
            children: part.slice(2, -2)
          },
          index
        );
      } else if (part.startsWith("__") && part.endsWith("__")) {
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_material3.Typography,
          {
            component: "span",
            sx: { fontStyle: "italic" },
            children: part.slice(2, -2)
          },
          index
        );
      } else if (part.startsWith("==") && part.endsWith("==")) {
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_material3.Typography,
          {
            component: "span",
            sx: {
              textDecoration: "underline",
              textDecorationColor: "primary.main"
            },
            children: part.slice(2, -2)
          },
          index
        );
      }
      return part;
    });
  };
  const renderContent = () => {
    const formattedContent = parseInlineFormatting(content);
    if (type === "header") {
      const variant = level === 1 ? "h4" : level === 2 ? "h5" : "h6";
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_material3.Typography,
        {
          variant,
          component: "div",
          sx: {
            fontWeight: "bold",
            color: "primary.main",
            mb: 1,
            mt: level === 1 ? 0 : 2
          },
          children: formattedContent
        }
      );
    }
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_material3.Typography,
      {
        variant: "body1",
        component: "div",
        sx: {
          mb: 1,
          lineHeight: 1.6,
          ...formatting?.bold && { fontWeight: "bold" },
          ...formatting?.italic && { fontStyle: "italic" },
          ...formatting?.underline && { textDecoration: "underline" }
        },
        children: formattedContent
      }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_framer_motion3.motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_material3.Box,
        {
          sx: {
            mb: type === "header" ? 2 : 1
          },
          children: renderContent()
        }
      )
    }
  );
};

// src/components/ClozeAndMultipleChoiceRenderer.tsx
var import_react3 = require("react");
var import_material4 = require("@mui/material");
var import_framer_motion4 = require("framer-motion");
var import_jsx_runtime4 = require("react/jsx-runtime");
var ClozeAndMultipleChoiceRenderer = ({
  bit,
  onInteraction
}) => {
  const [clozeValue, setClozeValue] = (0, import_react3.useState)("");
  const [selectedValue, setSelectedValue] = (0, import_react3.useState)("");
  const handleClozeChange = (event) => {
    const newValue = event.target.value;
    setClozeValue(newValue);
    onInteraction(`cloze:${newValue}`);
  };
  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onInteraction(`multiple-choice:${newValue}`);
  };
  const parseContent = (content) => {
    if (!content) {
      return [{
        type: "text",
        content: "No content available"
      }];
    }
    const parts = content.split(/(\[_[^\]]*\]|\[[-+][^\]]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith("[_") && part.endsWith("]")) {
        const correctAnswer = part.slice(2, -1);
        return {
          type: "cloze",
          correctAnswer,
          placeholder: "Fill in the blank"
        };
      } else if (part.startsWith("[-") || part.startsWith("[+")) {
        const isCorrect = part.startsWith("[+");
        const text = part.slice(2, -1);
        return {
          type: "option",
          text,
          correct: isCorrect,
          value: text.toLowerCase().replace(/\s+/g, "-")
        };
      }
      return {
        type: "text",
        content: part
      };
    });
  };
  const parsedParts = parseContent(bit.content);
  const options = parsedParts.filter((part) => part.type === "option");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_material4.Box,
    {
      sx: {
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        mb: 2
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_material4.Typography, { variant: "body1", component: "div", sx: { lineHeight: 2.5 }, children: [
        parsedParts.map((part, index) => {
          if (part.type === "cloze") {
            return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              import_framer_motion4.motion.span,
              {
                initial: { scale: 0.95 },
                animate: { scale: 1 },
                transition: { duration: 0.2 },
                style: { display: "inline-block", verticalAlign: "middle" },
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  import_material4.TextField,
                  {
                    value: clozeValue,
                    onChange: handleClozeChange,
                    placeholder: part.placeholder,
                    variant: "outlined",
                    size: "small",
                    sx: {
                      mx: 0.5,
                      minWidth: 120,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "grey.100",
                        "&:hover": {
                          backgroundColor: "primary.100"
                        },
                        "&.Mui-focused": {
                          backgroundColor: "primary.50",
                          boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
                        }
                      }
                    }
                  }
                )
              },
              index
            );
          } else if (part.type === "option") {
            return null;
          }
          return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { display: "inline" }, children: part.content }, index);
        }),
        options.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          import_framer_motion4.motion.span,
          {
            initial: { scale: 0.95 },
            animate: { scale: 1 },
            transition: { duration: 0.2 },
            style: { display: "inline-block", verticalAlign: "middle", marginLeft: 8 },
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_material4.FormControl, { size: "small", sx: { minWidth: 150 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_material4.InputLabel, { children: "Choose" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                import_material4.Select,
                {
                  value: selectedValue,
                  onChange: handleSelectChange,
                  label: "Choose",
                  sx: {
                    backgroundColor: "grey.100",
                    "&:hover": {
                      backgroundColor: "primary.100"
                    },
                    "&.Mui-focused": {
                      backgroundColor: "primary.50"
                    }
                  },
                  children: options.map((option, optionIndex) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_material4.MenuItem, { value: option.value, children: option.text }, optionIndex))
                }
              )
            ] })
          }
        )
      ] })
    }
  );
};

// src/components/ErrorRenderer.tsx
var import_material5 = require("@mui/material");
var import_framer_motion5 = require("framer-motion");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ErrorRenderer = ({ error }) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case "unsupported":
        return "\u26A0\uFE0F";
      case "parsing":
        return "\u{1F50D}";
      case "validation":
        return "\u274C";
      default:
        return "\u2753";
    }
  };
  const getErrorTitle = () => {
    switch (error.type) {
      case "unsupported":
        return "Unsupported Bit Type";
      case "parsing":
        return "Parsing Error";
      case "validation":
        return "Rendering Error";
      default:
        return "Unknown Error";
    }
  };
  const getErrorColor = () => {
    switch (error.type) {
      case "unsupported":
        return "warning";
      case "parsing":
        return "error";
      case "validation":
        return "error";
      default:
        return "info";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_framer_motion5.motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_material5.Box, { sx: { mb: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        import_material5.Alert,
        {
          severity: getErrorColor(),
          sx: {
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: "1.2rem"
            }
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_material5.AlertTitle, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: getErrorIcon() }),
              getErrorTitle()
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_material5.Typography, { variant: "body2", sx: { mt: 1 }, children: error.message }),
            error.bitType && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_material5.Typography, { variant: "caption", sx: { display: "block", mt: 1, opacity: 0.8 }, children: [
              "Bit type: ",
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { children: error.bitType })
            ] }),
            error.details && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              import_material5.Box,
              {
                component: "pre",
                sx: {
                  mt: 1,
                  p: 1,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  overflow: "auto",
                  maxHeight: "100px"
                },
                children: error.details
              }
            )
          ]
        }
      ) })
    }
  );
};

// src/components/BitmarkRenderer.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var BitmarkRenderer = ({
  data,
  onInteraction,
  className,
  style
}) => {
  const [interactions, setInteractions] = (0, import_react4.useState)([]);
  const [errors, setErrors] = (0, import_react4.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react4.useState)(false);
  const handleInteraction = (0, import_react4.useCallback)((interaction) => {
    setInteractions((prev) => [...prev, interaction]);
    onInteraction?.(interaction);
  }, [onInteraction]);
  const renderBit = (0, import_react4.useCallback)((bit, index) => {
    const bitId = `bit-${index}-${bit.type}`;
    try {
      const bitType = bit.type || bit.bit?.type || "unknown";
      switch (bitType) {
        case "cloze":
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            ClozeRenderer,
            {
              bit,
              onInteraction: (value) => handleInteraction({
                type: "cloze",
                bitId,
                value,
                timestamp: Date.now()
              })
            },
            bitId
          );
        case "multiple-choice":
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            MultipleChoiceRenderer,
            {
              bit,
              onInteraction: (value) => handleInteraction({
                type: "multiple-choice",
                bitId,
                value,
                timestamp: Date.now()
              })
            },
            bitId
          );
        case "cloze-and-multiple-choice-text":
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            ClozeAndMultipleChoiceRenderer,
            {
              bit,
              onInteraction: (value) => handleInteraction({
                type: "cloze",
                bitId,
                value,
                timestamp: Date.now()
              })
            },
            bitId
          );
        case "text":
        case "paragraph":
        case "header":
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            TextRenderer,
            {
              bit
            },
            bitId
          );
        default:
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            ErrorRenderer,
            {
              error: {
                type: "unsupported",
                message: `Unsupported bit type: ${bitType}`,
                bitType
              }
            },
            bitId
          );
      }
    } catch (error) {
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        ErrorRenderer,
        {
          error: {
            type: "validation",
            message: `Error rendering ${bit.type} bit`,
            bitType: bit.type,
            details: error instanceof Error ? error.message : "Unknown error"
          }
        },
        bitId
      );
    }
  }, [handleInteraction]);
  const validateData = (0, import_react4.useCallback)((inputData) => {
    const errors2 = [];
    let parsedData2 = [];
    try {
      if (Array.isArray(inputData)) {
        parsedData2 = inputData;
      } else {
        parsedData2 = [inputData];
      }
      parsedData2.forEach((bit, index) => {
        const bitType = bit.type || bit.bit?.type || "unknown";
        const supportedTypes = ["cloze", "multiple-choice", "cloze-and-multiple-choice-text", "text", "paragraph", "header"];
        if (!supportedTypes.includes(bitType)) {
          errors2.push({
            type: "unsupported",
            message: `Unsupported bit type: ${bitType}`,
            bitType
          });
        }
      });
    } catch (error) {
      errors2.push({
        type: "parsing",
        message: "Failed to parse bitmark data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
    return { data: parsedData2, errors: errors2 };
  }, []);
  (0, import_react4.useEffect)(() => {
    setIsLoading(true);
    try {
      const { data: parsedData2, errors: validationErrors } = validateData(data);
      setErrors(validationErrors);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    } catch (error) {
      setErrors([{
        type: "parsing",
        message: "Failed to process bitmark data",
        details: error instanceof Error ? error.message : "Unknown error"
      }]);
      setIsLoading(false);
    }
  }, [data, validateData]);
  const { data: parsedData } = validateData(data);
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_material6.Box,
      {
        className,
        style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.CircularProgress, {})
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    import_material6.Box,
    {
      className,
      style,
      sx: {
        padding: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        overflow: "auto",
        maxHeight: "100%"
      },
      children: [
        errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Box, { mb: 2, children: errors.map((error, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Alert, { severity: "warning", sx: { mb: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.AlertTitle, { children: error.type === "unsupported" ? "Unsupported Bit Type" : error.type === "parsing" ? "Parsing Error" : "Rendering Error" }),
          error.message,
          error.details && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Box, { component: "pre", sx: { fontSize: "0.875rem", mt: 1, opacity: 0.8 }, children: error.details })
        ] }, index)) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          import_framer_motion6.motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            children: parsedData.map((bit, index) => renderBit(bit, index))
          }
        ),
        typeof process !== "undefined" && process.env?.NODE_ENV === "development" && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Box, { mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Box, { component: "pre", fontSize: "0.75rem", color: "text.secondary", children: [
          "Interactions: ",
          interactions.length,
          interactions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Box, { component: "div", mt: 1, children: interactions.map((interaction, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Box, { component: "div", children: [
            interaction.type,
            ": ",
            interaction.value
          ] }, i)) })
        ] }) })
      ]
    }
  );
};
var BitmarkRenderer_default = BitmarkRenderer;

// src/components/ThemeProvider.tsx
var import_styles = require("@mui/material/styles");
var import_material7 = require("@mui/material");
var import_jsx_runtime7 = require("react/jsx-runtime");
var theme = (0, import_styles.createTheme)({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0"
    },
    secondary: {
      main: "#dc004e"
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});
var ThemeProvider = ({ children }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_styles.ThemeProvider, { theme, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_material7.CssBaseline, {}),
    children
  ] });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BitmarkRenderer,
  ClozeAndMultipleChoiceRenderer,
  ClozeRenderer,
  ErrorRenderer,
  MultipleChoiceRenderer,
  TextRenderer,
  ThemeProvider
});
//# sourceMappingURL=index.js.map