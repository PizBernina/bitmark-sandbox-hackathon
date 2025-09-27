import React$1 from 'react';

interface BitmarkNode {
    type: string;
    content?: string;
    children?: BitmarkNode[];
    attributes?: Record<string, any>;
    [key: string]: any;
}
interface BitmarkRendererProps {
    data: BitmarkNode | BitmarkNode[];
    onInteraction?: (interaction: UserInteraction) => void;
    className?: string;
    style?: React.CSSProperties;
}
interface UserInteraction {
    type: 'cloze' | 'multiple-choice' | 'text-input' | 'app-code-editor';
    bitId: string;
    value: string;
    timestamp: number;
}
interface RendererError {
    type: 'parsing' | 'unsupported' | 'validation';
    message: string;
    bitType?: string;
    details?: string;
}
interface BitmarkRendererState {
    interactions: UserInteraction[];
    errors: RendererError[];
    isLoading: boolean;
}
interface ClozeBit extends BitmarkNode {
    type: 'cloze';
    content?: string;
    correctAnswer?: string;
    placeholder?: string;
}
interface MultipleChoiceBit extends BitmarkNode {
    type: 'multiple-choice';
    content?: string;
    options?: Array<{
        text: string;
        correct: boolean;
        value: string;
    }>;
    selectedValue?: string;
}
interface TextBit extends BitmarkNode {
    type: 'text' | 'header' | 'paragraph';
    content?: string;
    level?: number;
    formatting?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
interface ClozeAndMultipleChoiceBit extends BitmarkNode {
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

declare const BitmarkRenderer: React$1.FC<BitmarkRendererProps>;

interface ThemeProviderProps {
    children: React$1.ReactNode;
}
declare const ThemeProvider: React$1.FC<ThemeProviderProps>;

interface ClozeRendererProps {
    bit: ClozeBit;
    onInteraction: (value: string) => void;
}
declare const ClozeRenderer: React$1.FC<ClozeRendererProps>;

interface MultipleChoiceRendererProps {
    bit: MultipleChoiceBit;
    onInteraction: (value: string) => void;
}
declare const MultipleChoiceRenderer: React$1.FC<MultipleChoiceRendererProps>;

interface TextRendererProps {
    bit: TextBit;
}
declare const TextRenderer: React$1.FC<TextRendererProps>;

interface ClozeAndMultipleChoiceRendererProps {
    bit: ClozeAndMultipleChoiceBit;
    onInteraction: (value: string) => void;
}
declare const ClozeAndMultipleChoiceRenderer: React$1.FC<ClozeAndMultipleChoiceRendererProps>;

interface AppCodeEditorRendererProps {
    bit: {
        type: string;
        content?: string;
        id?: string;
        computerLanguage?: string;
        body?: any;
    };
}
declare const AppCodeEditorRenderer: React$1.FC<AppCodeEditorRendererProps>;

interface AppCodeEditorInteractiveRendererProps {
    bit: {
        type: string;
        content?: string;
        computerLanguage?: string;
        body?: any;
        id?: string;
        bitmark?: string;
        originalBit?: {
            bitmark?: string;
            body?: string | any[];
            markup?: string;
        };
    };
    onInteraction?: (interaction: UserInteraction) => void;
    defaultView?: 'code' | 'interactive';
}
declare const AppCodeEditorInteractiveRenderer: React$1.FC<AppCodeEditorInteractiveRendererProps>;

interface ErrorRendererProps {
    error: RendererError;
}
declare const ErrorRenderer: React$1.FC<ErrorRendererProps>;

export { AppCodeEditorInteractiveRenderer, AppCodeEditorRenderer, type BitmarkNode, BitmarkRenderer, type BitmarkRendererProps, type BitmarkRendererState, type ClozeAndMultipleChoiceBit, ClozeAndMultipleChoiceRenderer, type ClozeBit, ClozeRenderer, ErrorRenderer, type MultipleChoiceBit, MultipleChoiceRenderer, type RendererError, type TextBit, TextRenderer, ThemeProvider, type UserInteraction };
