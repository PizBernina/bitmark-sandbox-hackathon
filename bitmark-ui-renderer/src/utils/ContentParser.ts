/**
 * ContentParser utility for parsing bitmark content and identifying interactive elements
 * This utility can be used by both standalone renderers and app-code-editor renderer
 */

export interface ParsedContentPart {
  type: 'text' | 'cloze' | 'option' | 'header';
  content?: string;
  correctAnswer?: string;
  placeholder?: string;
  text?: string;
  correct?: boolean;
  value?: string;
  level?: number;
}

export interface ParsedContent {
  parts: ParsedContentPart[];
  hasInteractiveElements: boolean;
  hasCloze: boolean;
  hasMultipleChoice: boolean;
  hasHeader: boolean;
}

/**
 * Parse bitmark content to identify interactive elements
 */
export function parseBitmarkContent(content: string | undefined): ParsedContent {
  if (!content) {
    return {
      parts: [{ type: 'text', content: 'No content available' }],
      hasInteractiveElements: false,
      hasCloze: false,
      hasMultipleChoice: false,
      hasHeader: false,
    };
  }

  const parts: ParsedContentPart[] = [];
  let hasCloze = false;
  let hasMultipleChoice = false;
  let hasHeader = false;

  // Split content by various patterns
  const regex = /(\[!.*?\]|\[_[^\]]*\]|\[[-+][^\]]*\])/g;
  const splitParts = content.split(regex);

  splitParts.forEach((part, index) => {
    if (!part) return;

    // Check for header pattern [!Title]
    if (part.startsWith('[!') && part.endsWith(']')) {
      const title = part.slice(2, -1);
      const level = title.startsWith('#') ? title.split('#').length - 1 : 1;
      parts.push({
        type: 'header',
        content: title.replace(/^#+/, '').trim(),
        level: Math.min(level, 6), // Max level 6
      });
      hasHeader = true;
    }
    // Check for cloze pattern [_answer]
    else if (part.startsWith('[_') && part.endsWith(']')) {
      const correctAnswer = part.slice(2, -1);
      parts.push({
        type: 'cloze',
        correctAnswer,
        placeholder: 'Fill in the blank',
      });
      hasCloze = true;
    }
    // Check for multiple choice pattern [-wrong][+correct]
    else if (part.startsWith('[-') || part.startsWith('[+')) {
      const isCorrect = part.startsWith('[+');
      const text = part.slice(2, -1).trim();
      parts.push({
        type: 'option',
        text,
        correct: isCorrect,
        value: text.toLowerCase().replace(/\s+/g, '-'),
      });
      hasMultipleChoice = true;
    }
    // Regular text
    else {
      parts.push({
        type: 'text',
        content: part,
      });
    }
  });

  return {
    parts,
    hasInteractiveElements: hasCloze || hasMultipleChoice || hasHeader,
    hasCloze,
    hasMultipleChoice,
    hasHeader,
  };
}

/**
 * Extract options from parsed content
 */
export function extractOptions(parts: ParsedContentPart[]): ParsedContentPart[] {
  return parts.filter(part => part.type === 'option');
}

/**
 * Check if content has any interactive elements
 */
export function hasInteractiveContent(content: string | undefined): boolean {
  if (!content) return false;
  
  return /(\[!.*?\]|\[_[^\]]*\]|\[[-+][^\]]*\])/.test(content);
}

/**
 * Get the primary interactive type from content
 */
export function getPrimaryInteractiveType(content: string | undefined): 'cloze' | 'multiple-choice' | 'cloze-and-multiple-choice' | 'header' | 'text' | null {
  if (!content) return null;

  const hasCloze = /\[_[^\]]*\]/.test(content);
  const hasMultipleChoice = /\[[-+][^\]]*\]/.test(content);
  const hasHeader = /\[!.*?\]/.test(content);

  if (hasCloze && hasMultipleChoice) {
    return 'cloze-and-multiple-choice';
  } else if (hasCloze) {
    return 'cloze';
  } else if (hasMultipleChoice) {
    return 'multiple-choice';
  } else if (hasHeader) {
    return 'header';
  }

  return 'text';
}
