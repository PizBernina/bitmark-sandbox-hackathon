// Core types for bitmark UI rendering

export interface BitmarkNode {
  type: string;
  content?: string;
  children?: BitmarkNode[];
  attributes?: Record<string, any>;
  [key: string]: any;
}

export interface BitmarkRendererProps {
  data: BitmarkNode | BitmarkNode[];
  onInteraction?: (interaction: UserInteraction) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface UserInteraction {
  type: 'cloze' | 'multiple-choice' | 'text-input' | 'app-code-editor';
  bitId: string;
  value: string;
  timestamp: number;
}

export interface RendererError {
  type: 'parsing' | 'unsupported' | 'validation';
  message: string;
  bitType?: string;
  details?: string;
}

export interface BitmarkRendererState {
  interactions: UserInteraction[];
  errors: RendererError[];
  isLoading: boolean;
}

// Specific bit type interfaces
export interface ClozeBit extends BitmarkNode {
  type: 'cloze';
  content?: string;
  correctAnswer?: string;
  placeholder?: string;
}

export interface MultipleChoiceBit extends BitmarkNode {
  type: 'multiple-choice';
  content?: string;
  options?: Array<{
    text: string;
    correct: boolean;
    value: string;
  }>;
  selectedValue?: string;
}

export interface TextBit extends BitmarkNode {
  type: 'text' | 'header' | 'paragraph';
  content?: string;
  level?: number; // for headers
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export interface ClozeAndMultipleChoiceBit extends BitmarkNode {
  type: 'cloze-and-multiple-choice-text';
  content?: string;
  clozeParts?: Array<{
    text: string;
    isCloze: boolean;
    correctAnswer?: string;
  }>;
  multipleChoiceParts?: Array<{
    text: string;
    options: Array<{
      text: string;
      correct: boolean;
      value: string;
    }>;
    selectedValue?: string;
  }>;
}

export interface ArticleBit extends BitmarkNode {
  type: 'article';
  content?: string;
  title?: string;
  level?: number;
}
