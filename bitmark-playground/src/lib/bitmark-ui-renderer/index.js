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
var import_material9 = require("@mui/material");
var import_framer_motion9 = require("framer-motion");

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

// src/components/AppCodeEditorRenderer.tsx
var import_material5 = require("@mui/material");
var import_framer_motion5 = require("framer-motion");
var import_icons_material = require("@mui/icons-material");
var import_jsx_runtime5 = require("react/jsx-runtime");
var AppCodeEditorRenderer = ({ bit }) => {
  const getContent = () => {
    if (bit.content) return bit.content;
    if (bit.body) {
      if (typeof bit.body === "string") return bit.body;
      if (bit.body.bodyText) return bit.body.bodyText;
      if (bit.body.text) return bit.body.text;
    }
    return "";
  };
  const content = getContent();
  const language = bit.computerLanguage || "bitmark";
  const id = bit.id;
  const getLanguageIcon = () => {
    switch (language) {
      case "json":
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_icons_material.DataObject, { sx: { fontSize: "1rem" } });
      case "bitmark":
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_icons_material.PlayArrow, { sx: { fontSize: "1rem" } });
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_icons_material.Code, { sx: { fontSize: "1rem" } });
    }
  };
  const getLanguageColor = () => {
    switch (language) {
      case "json":
        return "primary";
      case "bitmark":
        return "secondary";
      default:
        return "default";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_framer_motion5.motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        import_material5.Paper,
        {
          elevation: 1,
          sx: {
            p: 2,
            mb: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_material5.Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 2 }, children: [
              getLanguageIcon(),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_material5.Typography, { variant: "h6", sx: { fontSize: "1rem", fontWeight: 600 }, children: "Code Editor" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                import_material5.Chip,
                {
                  label: language.toUpperCase(),
                  size: "small",
                  color: getLanguageColor(),
                  variant: "outlined"
                }
              ),
              id && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                import_material5.Chip,
                {
                  label: `ID: ${id}`,
                  size: "small",
                  variant: "outlined",
                  sx: { ml: "auto" }
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              import_material5.Box,
              {
                component: "pre",
                sx: {
                  backgroundColor: "grey.50",
                  p: 2,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.200",
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  overflow: "auto",
                  maxHeight: "300px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                },
                children: content || "No content available"
              }
            )
          ]
        }
      )
    }
  );
};

// src/components/SandboxOutputGroupRenderer.tsx
var import_material6 = require("@mui/material");
var import_framer_motion6 = require("framer-motion");
var import_icons_material2 = require("@mui/icons-material");
var import_jsx_runtime6 = require("react/jsx-runtime");
var SandboxOutputGroupRenderer = ({
  editor,
  outputs
}) => {
  const getOutputIcon = (type) => {
    switch (type) {
      case "sandbox-output-json":
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_icons_material2.DataObject, { sx: { fontSize: "1rem" } });
      case "sandbox-output-bitmark":
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_icons_material2.PlayArrow, { sx: { fontSize: "1rem" } });
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_icons_material2.Code, { sx: { fontSize: "1rem" } });
    }
  };
  const getOutputTitle = (type) => {
    switch (type) {
      case "sandbox-output-json":
        return "JSON Output";
      case "sandbox-output-bitmark":
        return "Bitmark Output";
      default:
        return "Output";
    }
  };
  const getOutputColor = (type) => {
    switch (type) {
      case "sandbox-output-json":
        return "primary";
      case "sandbox-output-bitmark":
        return "secondary";
      default:
        return "default";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_framer_motion6.motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        import_material6.Paper,
        {
          elevation: 2,
          sx: {
            p: 0,
            mb: 3,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Box, { sx: { p: 2, backgroundColor: "primary.50" }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_icons_material2.Transform, { sx: { fontSize: "1.2rem", color: "primary.main" } }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Typography, { variant: "h6", sx: { fontSize: "1rem", fontWeight: 600, color: "primary.main" }, children: "Sandbox Group" }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                import_material6.Chip,
                {
                  label: `${outputs.length} output${outputs.length !== 1 ? "s" : ""}`,
                  size: "small",
                  color: "primary",
                  variant: "outlined"
                }
              )
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Box, { sx: { p: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(AppCodeEditorRenderer, { bit: editor }) }),
            outputs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Divider, {}),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Box, { sx: { p: 2 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Typography, { variant: "subtitle2", sx: { mb: 2, fontWeight: 600, color: "text.secondary" }, children: "Generated Outputs:" }),
                outputs.map((output, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Box, { sx: { mb: 2 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_material6.Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [
                    getOutputIcon(output.type),
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_material6.Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: getOutputTitle(output.type) }),
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                      import_material6.Chip,
                      {
                        label: output.type.replace("sandbox-output-", "").toUpperCase(),
                        size: "small",
                        color: getOutputColor(output.type),
                        variant: "outlined"
                      }
                    ),
                    output.prettify && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                      import_material6.Chip,
                      {
                        label: `Prettify: ${output.prettify}`,
                        size: "small",
                        variant: "outlined"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                    import_material6.Box,
                    {
                      component: "pre",
                      sx: {
                        backgroundColor: "grey.50",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        overflow: "auto",
                        maxHeight: "200px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                      },
                      children: output.content || `[Generated ${output.type.replace("sandbox-output-", "")} output would appear here]`
                    }
                  )
                ] }, `${output.type}-${index}`))
              ] })
            ] })
          ]
        }
      )
    }
  );
};

// src/components/SandboxPlaceholderRenderer.tsx
var import_material7 = require("@mui/material");
var import_framer_motion7 = require("framer-motion");
var import_icons_material3 = require("@mui/icons-material");
var import_jsx_runtime7 = require("react/jsx-runtime");
var SandboxPlaceholderRenderer = ({ bitType }) => {
  const getSandboxIcon = () => {
    switch (bitType) {
      case "app-code-editor":
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_icons_material3.Code, { sx: { fontSize: "1.2rem" } });
      case "sandbox-output-json":
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_icons_material3.Code, { sx: { fontSize: "1.2rem" } });
      case "sandbox-output-bitmark":
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_icons_material3.PlayArrow, { sx: { fontSize: "1.2rem" } });
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_icons_material3.Code, { sx: { fontSize: "1.2rem" } });
    }
  };
  const getSandboxTitle = () => {
    switch (bitType) {
      case "app-code-editor":
        return "Code Editor";
      case "sandbox-output-json":
        return "Sandbox JSON Output";
      case "sandbox-output-bitmark":
        return "Sandbox Bitmark Output";
      default:
        return "Sandbox Content";
    }
  };
  const getSandboxDescription = () => {
    switch (bitType) {
      case "app-code-editor":
        return "This code editor content is rendered from the JSON pane.";
      case "sandbox-output-json":
        return "This JSON output content is rendered from the JSON pane.";
      case "sandbox-output-bitmark":
        return "This bitmark output content is rendered from the JSON pane.";
      default:
        return "This sandbox content is rendered from the JSON pane.";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_framer_motion7.motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_material7.Box, { sx: { mb: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        import_material7.Alert,
        {
          severity: "info",
          sx: {
            borderRadius: 2,
            border: "2px dashed",
            borderColor: "primary.main",
            backgroundColor: "primary.50",
            "& .MuiAlert-icon": {
              fontSize: "1.2rem"
            }
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_material7.AlertTitle, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
              getSandboxIcon(),
              getSandboxTitle()
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_material7.Typography, { variant: "body2", sx: { mt: 1 }, children: getSandboxDescription() }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_material7.Box, { sx: { mt: 2, display: "flex", alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                import_material7.Chip,
                {
                  label: "Sandbox Integration",
                  size: "small",
                  color: "primary",
                  variant: "outlined"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_material7.Typography, { variant: "caption", sx: { opacity: 0.8 }, children: "Rendering from JSON pane..." })
            ] })
          ]
        }
      ) })
    }
  );
};

// src/components/ErrorRenderer.tsx
var import_material8 = require("@mui/material");
var import_framer_motion8 = require("framer-motion");
var import_jsx_runtime8 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    import_framer_motion8.motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_material8.Box, { sx: { mb: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        import_material8.Alert,
        {
          severity: getErrorColor(),
          sx: {
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: "1.2rem"
            }
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_material8.AlertTitle, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: getErrorIcon() }),
              getErrorTitle()
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_material8.Typography, { variant: "body2", sx: { mt: 1 }, children: error.message }),
            error.bitType && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_material8.Typography, { variant: "caption", sx: { display: "block", mt: 1, opacity: 0.8 }, children: [
              "Bit type: ",
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("code", { children: error.bitType })
            ] }),
            error.details && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              import_material8.Box,
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
var import_jsx_runtime9 = require("react/jsx-runtime");
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
  const groupSandboxBits = (0, import_react4.useCallback)((bits) => {
    const groups = /* @__PURE__ */ new Map();
    const standaloneBits = [];
    bits.forEach((bit, index) => {
      const bitType = bit.type || bit.bit?.type || "unknown";
      if (bitType === "app-code-editor") {
        let id = bit.id || bit.bit?.id || `editor-${index}`;
        if (Array.isArray(id)) {
          id = id[0] || `editor-${index}`;
        }
        if (!groups.has(id)) {
          groups.set(id, { editor: bit, outputs: [] });
        } else {
          groups.get(id).editor = bit;
        }
      } else if (bitType === "sandbox-output-json" || bitType === "sandbox-output-bitmark") {
        let fromId = bit.fromId || bit.bit?.fromId || bit.properties?.fromId;
        if (Array.isArray(fromId)) {
          fromId = fromId[0];
        }
        if (fromId && groups.has(fromId)) {
          groups.get(fromId).outputs.push({ bit, index });
        } else {
          standaloneBits.push({ bit, index });
        }
      } else {
        standaloneBits.push({ bit, index });
      }
    });
    return { groups, standaloneBits };
  }, []);
  const renderBit = (0, import_react4.useCallback)((bit, index) => {
    const bitId = `bit-${index}-${bit.type}`;
    try {
      const bitType = bit.type || bit.bit?.type || "unknown";
      switch (bitType) {
        case "cloze":
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            TextRenderer,
            {
              bit
            },
            bitId
          );
        case "app-code-editor":
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            AppCodeEditorRenderer,
            {
              bit
            },
            bitId
          );
        case "sandbox-output-json":
        case "sandbox-output-bitmark":
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            SandboxPlaceholderRenderer,
            {
              bitType
            },
            bitId
          );
        default:
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        const supportedTypes = ["cloze", "multiple-choice", "cloze-and-multiple-choice-text", "text", "paragraph", "header", "app-code-editor", "sandbox-output-json", "sandbox-output-bitmark"];
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
  const groupedData = (0, import_react4.useMemo)(() => {
    return groupSandboxBits(parsedData);
  }, [parsedData, groupSandboxBits]);
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      import_material9.Box,
      {
        className,
        style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_material9.CircularProgress, {})
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    import_material9.Box,
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
        errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_material9.Box, { mb: 2, children: errors.map((error, index) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_material9.Alert, { severity: "warning", sx: { mb: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_material9.AlertTitle, { children: error.type === "unsupported" ? "Unsupported Bit Type" : error.type === "parsing" ? "Parsing Error" : "Rendering Error" }),
          error.message,
          error.details && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_material9.Box, { component: "pre", sx: { fontSize: "0.875rem", mt: 1, opacity: 0.8 }, children: error.details })
        ] }, index)) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          import_framer_motion9.motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            children: (() => {
              const { groups, standaloneBits } = groupedData;
              const elements = [];
              groups.forEach((group, groupId) => {
                if (group.editor && group.outputs.length > 0) {
                  const outputs = group.outputs.map(({ bit }) => ({
                    type: bit.type,
                    fromId: bit.fromId || bit.bit?.fromId || bit.properties?.fromId || "",
                    prettify: bit.prettify || bit.bit?.prettify || bit.properties?.prettify,
                    content: bit.content || bit.bit?.content || bit.body?.bodyText || bit.body?.text || ""
                  }));
                  elements.push(
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                      SandboxOutputGroupRenderer,
                      {
                        editor: group.editor,
                        outputs
                      },
                      `group-${groupId}`
                    )
                  );
                } else if (group.editor) {
                  const editorIndex = groupId.startsWith("editor-") ? parseInt(groupId.replace("editor-", "")) : 0;
                  elements.push(renderBit(group.editor, editorIndex));
                }
              });
              standaloneBits.forEach(({ bit, index }) => {
                elements.push(renderBit(bit, index));
              });
              return elements;
            })()
          }
        ),
        typeof process !== "undefined" && process.env?.NODE_ENV === "development" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_material9.Box, { mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_material9.Box, { component: "pre", fontSize: "0.75rem", color: "text.secondary", children: [
          "Interactions: ",
          interactions.length,
          interactions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_material9.Box, { component: "div", mt: 1, children: interactions.map((interaction, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_material9.Box, { component: "div", children: [
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
var import_material10 = require("@mui/material");
var import_jsx_runtime10 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_styles.ThemeProvider, { theme, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_material10.CssBaseline, {}),
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