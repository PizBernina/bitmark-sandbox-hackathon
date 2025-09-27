// Main exports for bitmark-ui-renderer
export { default as BitmarkRenderer } from './components/BitmarkRenderer';
export { ThemeProvider } from './components/ThemeProvider';

// Individual component exports
export { ClozeRenderer } from './components/ClozeRenderer';
export { MultipleChoiceRenderer } from './components/MultipleChoiceRenderer';
export { TextRenderer } from './components/TextRenderer';
export { ClozeAndMultipleChoiceRenderer } from './components/ClozeAndMultipleChoiceRenderer';
export { AppCodeEditorRenderer } from './components/AppCodeEditorRenderer';
export { AppCodeEditorInteractiveRenderer } from './components/AppCodeEditorInteractiveRenderer';
export { ErrorRenderer } from './components/ErrorRenderer';

// Type exports
export type {
  BitmarkNode,
  BitmarkRendererProps,
  UserInteraction,
  RendererError,
  BitmarkRendererState,
  ClozeBit,
  MultipleChoiceBit,
  TextBit,
  ClozeAndMultipleChoiceBit,
} from './types';
