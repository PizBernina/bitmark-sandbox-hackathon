// src/components/BitmarkRenderer.tsx
import { useState as useState4, useEffect, useCallback } from "react";
import { Box as Box6, Alert as Alert2, AlertTitle as AlertTitle2, CircularProgress } from "@mui/material";
import { motion as motion6 } from "framer-motion";

// src/components/ClozeRenderer.tsx
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { jsx } from "react/jsx-runtime";
var ClozeRenderer = ({ bit, onInteraction }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
  return /* @__PURE__ */ jsx(
    Box,
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
      children: /* @__PURE__ */ jsx(Typography, { variant: "body1", component: "div", sx: { lineHeight: 2.5 }, children: parsedParts.map((part, index) => {
        if (part.type === "cloze") {
          return /* @__PURE__ */ jsx(
            motion.span,
            {
              initial: { scale: 0.95 },
              animate: { scale: 1 },
              transition: { duration: 0.2 },
              style: { display: "inline-block", verticalAlign: "middle" },
              children: /* @__PURE__ */ jsx(
                TextField,
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
        return /* @__PURE__ */ jsx("span", { style: { display: "inline" }, children: part.content }, index);
      }) })
    }
  );
};

// src/components/MultipleChoiceRenderer.tsx
import { useState as useState2 } from "react";
import { Box as Box2, FormControl, InputLabel, Select, MenuItem, Typography as Typography2 } from "@mui/material";
import { motion as motion2 } from "framer-motion";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var MultipleChoiceRenderer = ({ bit, onInteraction }) => {
  const [selectedValue, setSelectedValue] = useState2(bit.selectedValue || "");
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
  return /* @__PURE__ */ jsx2(
    Box2,
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
      children: /* @__PURE__ */ jsxs(Typography2, { variant: "body1", component: "div", children: [
        parsedParts.map((part, index) => {
          if (part.type === "option") {
            return null;
          }
          return /* @__PURE__ */ jsx2("span", { children: part.content }, index);
        }),
        options.length > 0 && /* @__PURE__ */ jsx2(
          motion2.div,
          {
            initial: { scale: 0.95 },
            animate: { scale: 1 },
            transition: { duration: 0.2 },
            style: { marginTop: 16 },
            children: /* @__PURE__ */ jsxs(FormControl, { size: "small", sx: { minWidth: 200 }, children: [
              /* @__PURE__ */ jsx2(InputLabel, { children: "Choose an option" }),
              /* @__PURE__ */ jsx2(
                Select,
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
                  children: options.map((option, optionIndex) => /* @__PURE__ */ jsx2(MenuItem, { value: option.value, children: option.text }, optionIndex))
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
import { Box as Box3, Typography as Typography3 } from "@mui/material";
import { motion as motion3 } from "framer-motion";
import { jsx as jsx3 } from "react/jsx-runtime";
var TextRenderer = ({ bit }) => {
  const { content, type, level = 1, formatting } = bit;
  const parseInlineFormatting = (text) => {
    if (!text) {
      return ["No content available"];
    }
    const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|==[^=]+==)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return /* @__PURE__ */ jsx3(
          Typography3,
          {
            component: "span",
            sx: { fontWeight: "bold" },
            children: part.slice(2, -2)
          },
          index
        );
      } else if (part.startsWith("__") && part.endsWith("__")) {
        return /* @__PURE__ */ jsx3(
          Typography3,
          {
            component: "span",
            sx: { fontStyle: "italic" },
            children: part.slice(2, -2)
          },
          index
        );
      } else if (part.startsWith("==") && part.endsWith("==")) {
        return /* @__PURE__ */ jsx3(
          Typography3,
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
      return /* @__PURE__ */ jsx3(
        Typography3,
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
    return /* @__PURE__ */ jsx3(
      Typography3,
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
  return /* @__PURE__ */ jsx3(
    motion3.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ jsx3(
        Box3,
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
import { useState as useState3 } from "react";
import { Box as Box4, TextField as TextField2, FormControl as FormControl2, InputLabel as InputLabel2, Select as Select2, MenuItem as MenuItem2, Typography as Typography4 } from "@mui/material";
import { motion as motion4 } from "framer-motion";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var ClozeAndMultipleChoiceRenderer = ({
  bit,
  onInteraction
}) => {
  const [clozeValue, setClozeValue] = useState3("");
  const [selectedValue, setSelectedValue] = useState3("");
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
  return /* @__PURE__ */ jsx4(
    Box4,
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
      children: /* @__PURE__ */ jsxs2(Typography4, { variant: "body1", component: "div", sx: { lineHeight: 2.5 }, children: [
        parsedParts.map((part, index) => {
          if (part.type === "cloze") {
            return /* @__PURE__ */ jsx4(
              motion4.span,
              {
                initial: { scale: 0.95 },
                animate: { scale: 1 },
                transition: { duration: 0.2 },
                style: { display: "inline-block", verticalAlign: "middle" },
                children: /* @__PURE__ */ jsx4(
                  TextField2,
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
          return /* @__PURE__ */ jsx4("span", { style: { display: "inline" }, children: part.content }, index);
        }),
        options.length > 0 && /* @__PURE__ */ jsx4(
          motion4.span,
          {
            initial: { scale: 0.95 },
            animate: { scale: 1 },
            transition: { duration: 0.2 },
            style: { display: "inline-block", verticalAlign: "middle", marginLeft: 8 },
            children: /* @__PURE__ */ jsxs2(FormControl2, { size: "small", sx: { minWidth: 150 }, children: [
              /* @__PURE__ */ jsx4(InputLabel2, { children: "Choose" }),
              /* @__PURE__ */ jsx4(
                Select2,
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
                  children: options.map((option, optionIndex) => /* @__PURE__ */ jsx4(MenuItem2, { value: option.value, children: option.text }, optionIndex))
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
import { Box as Box5, Alert, AlertTitle, Typography as Typography5 } from "@mui/material";
import { motion as motion5 } from "framer-motion";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx5(
    motion5.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ jsx5(Box5, { sx: { mb: 2 }, children: /* @__PURE__ */ jsxs3(
        Alert,
        {
          severity: getErrorColor(),
          sx: {
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: "1.2rem"
            }
          },
          children: [
            /* @__PURE__ */ jsxs3(AlertTitle, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ jsx5("span", { children: getErrorIcon() }),
              getErrorTitle()
            ] }),
            /* @__PURE__ */ jsx5(Typography5, { variant: "body2", sx: { mt: 1 }, children: error.message }),
            error.bitType && /* @__PURE__ */ jsxs3(Typography5, { variant: "caption", sx: { display: "block", mt: 1, opacity: 0.8 }, children: [
              "Bit type: ",
              /* @__PURE__ */ jsx5("code", { children: error.bitType })
            ] }),
            error.details && /* @__PURE__ */ jsx5(
              Box5,
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
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var BitmarkRenderer = ({
  data,
  onInteraction,
  className,
  style
}) => {
  const [interactions, setInteractions] = useState4([]);
  const [errors, setErrors] = useState4([]);
  const [isLoading, setIsLoading] = useState4(false);
  const handleInteraction = useCallback((interaction) => {
    setInteractions((prev) => [...prev, interaction]);
    onInteraction?.(interaction);
  }, [onInteraction]);
  const renderBit = useCallback((bit, index) => {
    const bitId = `bit-${index}-${bit.type}`;
    try {
      const bitType = bit.type || bit.bit?.type || "unknown";
      switch (bitType) {
        case "cloze":
          return /* @__PURE__ */ jsx6(
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
          return /* @__PURE__ */ jsx6(
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
          return /* @__PURE__ */ jsx6(
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
          return /* @__PURE__ */ jsx6(
            TextRenderer,
            {
              bit
            },
            bitId
          );
        default:
          return /* @__PURE__ */ jsx6(
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
      return /* @__PURE__ */ jsx6(
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
  const validateData = useCallback((inputData) => {
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
  useEffect(() => {
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
    return /* @__PURE__ */ jsx6(
      Box6,
      {
        className,
        style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        children: /* @__PURE__ */ jsx6(CircularProgress, {})
      }
    );
  }
  return /* @__PURE__ */ jsxs4(
    Box6,
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
        errors.length > 0 && /* @__PURE__ */ jsx6(Box6, { mb: 2, children: errors.map((error, index) => /* @__PURE__ */ jsxs4(Alert2, { severity: "warning", sx: { mb: 1 }, children: [
          /* @__PURE__ */ jsx6(AlertTitle2, { children: error.type === "unsupported" ? "Unsupported Bit Type" : error.type === "parsing" ? "Parsing Error" : "Rendering Error" }),
          error.message,
          error.details && /* @__PURE__ */ jsx6(Box6, { component: "pre", sx: { fontSize: "0.875rem", mt: 1, opacity: 0.8 }, children: error.details })
        ] }, index)) }),
        /* @__PURE__ */ jsx6(
          motion6.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            children: parsedData.map((bit, index) => renderBit(bit, index))
          }
        ),
        typeof process !== "undefined" && process.env?.NODE_ENV === "development" && /* @__PURE__ */ jsx6(Box6, { mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1, children: /* @__PURE__ */ jsxs4(Box6, { component: "pre", fontSize: "0.75rem", color: "text.secondary", children: [
          "Interactions: ",
          interactions.length,
          interactions.length > 0 && /* @__PURE__ */ jsx6(Box6, { component: "div", mt: 1, children: interactions.map((interaction, i) => /* @__PURE__ */ jsxs4(Box6, { component: "div", children: [
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
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var theme = createTheme({
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
  return /* @__PURE__ */ jsxs5(MuiThemeProvider, { theme, children: [
    /* @__PURE__ */ jsx7(CssBaseline, {}),
    children
  ] });
};
export {
  BitmarkRenderer_default as BitmarkRenderer,
  ClozeAndMultipleChoiceRenderer,
  ClozeRenderer,
  ErrorRenderer,
  MultipleChoiceRenderer,
  TextRenderer,
  ThemeProvider
};
//# sourceMappingURL=index.mjs.map