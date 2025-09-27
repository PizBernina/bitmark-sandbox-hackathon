# Bitmark UI Renderer

A React component library for rendering interactive bitmark content with  UI components. This library transforms structured bitmark data into engaging, interactive user interfaces with smooth animations and responsive design.


## Supported Bit Types

- **Cloze**: Fill-in-the-blank questions with `[_answer]` syntax
- **Multiple Choice**: Dropdown selections with `[-wrong][+correct]` syntax
- **Cloze + Multiple Choice**: Combined interactive elements
- **Text**: Basic text with formatting (`**bold**`, `__italic__`, `==underline==`)
- **Headers**: Title formatting with `[!Title]` syntax
- **App Code Editor**: Code editor with syntax highlighting for JSON, Bitmark, and other languages

## Installation

```bash
npm install bitmark-ui-renderer
```

## Quick Start

```tsx
import React from 'react';
import { BitmarkRenderer, ThemeProvider } from 'bitmark-ui-renderer';

const App = () => {
  const bitmarkData = [
    {
      type: 'cloze',
      content: 'The students completed the [_assignment] with the correct verb forms.'
    },
    {
      type: 'multiple-choice',
      content: 'What color are violets? [-red][+blue][-green]'
    }
  ];

  return (
    <ThemeProvider>
      <BitmarkRenderer
        data={bitmarkData}
        onInteraction={(interaction) => {
          console.log('User interaction:', interaction);
        }}
      />
    </ThemeProvider>
  );
};
```

## API Reference

### BitmarkRenderer

The main component for rendering bitmark content.

#### Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `data` | `BitmarkNode \| BitmarkNode[]` | The bitmark data to render | Required |
| `onInteraction` | `(interaction: UserInteraction) => void` | Callback for user interactions | `undefined` |
| `className` | `string` | CSS class name | `undefined` |
| `style` | `React.CSSProperties` | Inline styles | `undefined` |

#### UserInteraction

```tsx
interface UserInteraction {
  type: 'cloze' | 'multiple-choice' | 'text-input';
  bitId: string;
  value: string;
  timestamp: number;
}
```

### ThemeProvider

Provides Material-UI theming context for the renderer components.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Child components to wrap |

## Examples

### Basic Cloze Question
```tsx
const clozeData = {
  type: 'cloze',
  content: 'Roses are [_red], violets are [_blue]'
};

<BitmarkRenderer data={clozeData} />
```

### Multiple Choice Question
```tsx
const multipleChoiceData = {
  type: 'multiple-choice',
  content: 'What color are violets? [-red][+blue][-green]'
};

<BitmarkRenderer data={multipleChoiceData} />
```

### Combined Interactive Elements
```tsx
const combinedData = {
  type: 'cloze-and-multiple-choice-text',
  content: 'Roses are [_red], violets are [-green][+blue][-yellow]'
};

<BitmarkRenderer data={combinedData} />
```

### Text with Formatting
```tsx
const textData = {
  type: 'text',
  content: 'This is **bold** text and __italic__ text and ==underlined== text.'
};

<BitmarkRenderer data={textData} />
```

### Header
```tsx
const headerData = {
  type: 'header',
  content: 'This is a header',
  level: 1
};

<BitmarkRenderer data={headerData} />
```

### App Code Editor
```tsx
const codeEditorData = {
  type: 'app-code-editor',
  content: '{\n  "message": "Hello, World!"\n}',
  id: 'example-1',
  computerLanguage: 'json'
};

<BitmarkRenderer data={codeEditorData} />
```

### Array of Multiple Bits
```tsx
const multipleBits = [
  {
    type: 'cloze',
    content: 'Complete the sentence: The sky is [_blue].'
  },
  {
    type: 'multiple-choice',
    content: 'What is 2 + 2? [-3][+4][-5]'
  },
  {
    type: 'text',
    content: 'This is a **paragraph** with formatting.'
  }
];

<BitmarkRenderer data={multipleBits} />
```

## External Libraries

This library is built on top of several well-established React and UI libraries:

### Core Dependencies

#### React & React DOM
- **Version**: `>=16.8.0`
- **Purpose**: Core React functionality and DOM rendering
- **Why**: Provides the foundation for component-based UI development

#### Material-UI (MUI)
- **Version**: `^5.14.20`
- **Purpose**: UI component library and theming system
- **Components Used**:
  - `Box`, `Typography` - Layout and text components
  - `TextField`, `Select`, `MenuItem` - Form controls
  - `Alert`, `AlertTitle` - Error and warning displays
  - `CircularProgress` - Loading indicators
  - `ThemeProvider`, `createTheme` - Theming system
- **Why**: Provides consistent, accessible, and beautiful UI components

#### Emotion
- **Versions**: 
  - `@emotion/react`: `^11.11.1`
  - `@emotion/styled`: `^11.11.0`
  - `@emotion/cache`: `^11.11.0`
  - `@emotion/serialize`: `^1.1.2`
  - `@emotion/use-insertion-effect-with-fallbacks`: `^1.0.8`
  - `@emotion/utils`: `^1.2.1`
- **Purpose**: CSS-in-JS styling solution
- **Why**: Provides performant styling with CSS-in-JS, required by Material-UI

#### Framer Motion
- **Version**: `^10.16.16`
- **Purpose**: Animation library for smooth transitions
- **Features Used**:
  - `motion.div` - Animated container components
  - `initial`, `animate`, `transition` - Animation properties
- **Why**: Provides smooth, performant animations that enhance user experience

#### Material-UI Icons
- **Version**: `^5.14.19`
- **Purpose**: Icon library for Material-UI components
- **Why**: Provides consistent iconography that matches Material-UI design system

### Development Dependencies

#### TypeScript
- **Version**: `^5.3.3`
- **Purpose**: Type checking and development experience
- **Why**: Provides type safety and better developer experience

#### TSUP
- **Version**: `^8.0.1`
- **Purpose**: Build tool for TypeScript libraries
- **Why**: Fast, zero-config bundler for modern libraries

#### @types/node
- **Version**: `^24.5.2`
- **Purpose**: TypeScript definitions for Node.js
- **Why**: Provides type safety for Node.js APIs

## Architecture

### Component Structure

```
BitmarkRenderer (Main Component)
├── ThemeProvider (Material-UI theming)
├── ClozeRenderer (Fill-in-the-blank questions)
├── MultipleChoiceRenderer (Dropdown selections)
├── ClozeAndMultipleChoiceRenderer (Combined elements)
├── TextRenderer (Formatted text and headers)
├── AppCodeEditorRenderer (Code editor with syntax highlighting)
└── ErrorRenderer (Error display)
```

### Data Flow

1. **Input**: Bitmark data (JSON objects or arrays)
2. **Parsing**: Data is validated and structured
3. **Rendering**: Appropriate renderer component is selected
4. **Interaction**: User interactions are captured and reported
5. **Updates**: Real-time updates as data changes

## Customization

### Theming

You can customize the appearance by providing a custom Material-UI theme:

```tsx
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from 'bitmark-ui-renderer';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
});

<ThemeProvider theme={customTheme}>
  <BitmarkRenderer data={data} />
</ThemeProvider>
```

### Styling

Components accept `className` and `style` props for custom styling:

```tsx
<BitmarkRenderer
  data={data}
  className="my-custom-class"
  style={{ backgroundColor: '#f5f5f5' }}
/>
```

## Error Handling

The library provides comprehensive error handling:

- **Parsing Errors**: Invalid JSON or malformed data
- **Unsupported Types**: Unknown bit types
- **Validation Errors**: Component-specific validation failures

Errors are displayed with user-friendly messages and can be customized through the error renderer.

## Troubleshooting

### Multiple Choice Questions Not Showing Options

If multiple choice questions display only the question text without options:

1. **Check data format**: Ensure your bitmark data includes options in either the `body` or `quizzes` structure
2. **Verify bitmark input**: Options can be on separate lines or inline with the question
3. **Check console logs**: Enable debug logging to see content extraction details
4. **Supported formats**: Both `[-option]` and `[- option ]` (with spaces) formats are supported

### Input Fields Not Aligned with Text

If input fields appear misaligned with surrounding text:

1. **Check CSS conflicts**: Ensure no conflicting styles are applied to the container
2. **Verify line height**: The component uses `lineHeight: 2.5` for proper alignment
3. **Check Material-UI theme**: Ensure Material-UI theme is properly configured

### Content Not Rendering

If content shows "No content available":

1. **Check data structure**: Ensure data follows the expected BitWrapperJson format
2. **Verify bit types**: Supported types are 'cloze', 'multiple-choice', 'cloze-and-multiple-choice-text'
3. **Check console logs**: Look for content extraction errors in the browser console

## Performance

- **Lazy Loading**: Components are loaded only when needed
- **Memoization**: Expensive operations are memoized
- **Efficient Updates**: Only changed components re-render
- **Bundle Size**: Optimized for minimal bundle impact

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020+ features are used

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch for changes during development
npm run dev

# Type check
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Changelog

### v1.0.3
- **Added App Code Editor support**: New `app-code-editor` bit type with beautiful UI rendering
- **Enhanced content extraction**: Improved content extraction for various bit structures
- **Fixed React key warnings**: Resolved duplicate key issues for better React performance
- **Updated documentation**: Added examples and documentation for app-code-editor bit type

### v1.0.2
- **Fixed multiple choice rendering**: Multiple choice questions now properly display options from the `quizzes` structure in parsed bitmark JSON
- **Enhanced data conversion**: Added support for both `body` and `quizzes` data structures from bitmark parser
- **Improved option parsing**: Fixed regex pattern to handle spaces around option text (e.g., `[- red ]` format)
- **Better error handling**: More robust content extraction for different bitmark input formats
- **Code quality improvements**: Fixed all ESLint and Prettier formatting issues

### v1.0.1
- **Fixed multiple choice rendering**: Multiple choice questions now properly display options from separate lines with `====` separator
- **Improved content extraction**: Enhanced data conversion from BitWrapperJson to BitmarkNode format
- **Better formatting and alignment**: Input fields and dropdowns now properly align with surrounding text
- **Enhanced debugging**: Added comprehensive logging for content extraction and data conversion
- **Fixed TypeScript issues**: Resolved implicit type errors and improved type safety
- **Code quality improvements**: Fixed all ESLint and Prettier formatting issues

### v1.0.0
- Initial release
- Support for cloze, multiple-choice, and text rendering
- Material-UI theming integration
- TypeScript support
- Animation support with Framer Motion