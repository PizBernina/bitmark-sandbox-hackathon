/**
 * ContentParser utility for parsing bitmark content and identifying interactive elements
 * This utility can be used by both standalone renderers and app-code-editor renderer
 */

export interface ParsedContentPart {
  type: 'text' | 'cloze' | 'option' | 'header' | 'article';
  content?: string;
  correctAnswer?: string;
  placeholder?: string;
  text?: string;
  correct?: boolean;
  value?: string;
  level?: number;
  title?: string;
}

export interface ParsedContent {
  parts: ParsedContentPart[];
  hasInteractiveElements: boolean;
  hasCloze: boolean;
  hasMultipleChoice: boolean;
  hasHeader: boolean;
  hasArticle: boolean;
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
      hasArticle: false,
    };
  }

  // First, try to parse as JSON to extract bitmark content from JSON structures
  let bitmarkContent = content;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      // Look for bitmark content in the array
      bitmarkContent = parsed
        .map((item: any) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            if (item.body && item.body.bodyText) return item.body.bodyText;
            if (item.body && typeof item.body === 'string') return item.body;
            if (item.content) return item.content;
            if (item.text) return item.text;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
    } else if (parsed && typeof parsed === 'object') {
      // Look for bitmark content in the object
      if (parsed.body && parsed.body.bodyText) {
        bitmarkContent = parsed.body.bodyText;
      } else if (parsed.body && typeof parsed.body === 'string') {
        bitmarkContent = parsed.body;
      } else if (parsed.content) {
        bitmarkContent = parsed.content;
      } else if (parsed.text) {
        bitmarkContent = parsed.text;
      }
    }
  } catch {
    // Not JSON, use content as-is
    bitmarkContent = content;
  }

  const parts: ParsedContentPart[] = [];
  let hasCloze = false;
  let hasMultipleChoice = false;
  let hasHeader = false;
  let hasArticle = false;

  // Check if content starts with [.article] or [^.article] pattern OR if we have JSON with article type
  let isArticle = false;
  let articleTitle = 'Article';
  let articleContent = '';

  // Check for both [.article] and [^.article] patterns (caret indicates escaped/modified article)
  const articleMatch = bitmarkContent.trim().match(/^(\^?\[\.article\])/);
  if (articleMatch) {
    // Handle bitmark article syntax (both regular and escaped with caret)
    isArticle = true;
    
    // Extract title if present
    const titleMatch = bitmarkContent.match(/\[@title:\s*([^\]]+)\]/);
    articleTitle = titleMatch ? titleMatch[1].trim() : 'Article';
    
    // Extract content after the article declaration and any attributes
    // Remove [.article] or [^.article] and any attributes like [@title: ...] from the content
    articleContent = bitmarkContent
      .replace(/^\^?\[\.article\](.*)$/s, '$1') // Extract content after [.article] or [^.article]
      .replace(/\[@title:\s*[^\]]+\]/g, '') // Remove [@title: ...] attributes
      .replace(/\[@[^\]]+\]/g, '') // Remove any other [@...] attributes
      .trim();
  } else {
    // Check if we have JSON with article type
    try {
      const jsonData = JSON.parse(content);
      console.log('ContentParser: Parsed JSON data:', jsonData);
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const firstItem = jsonData[0];
        console.log('ContentParser: First item:', firstItem);
        if (firstItem && firstItem.type === 'article') {
          console.log('ContentParser: Found article in array');
          isArticle = true;
          articleTitle = firstItem.title || firstItem.body?.title || 'Article';
          articleContent = firstItem.body?.bodyText || firstItem.content || firstItem.text || 'No content available';
          console.log('ContentParser: Article content:', articleContent);
        }
      } else if (jsonData && jsonData.type === 'article') {
        console.log('ContentParser: Found article in object');
        isArticle = true;
        articleTitle = jsonData.title || jsonData.body?.title || 'Article';
        articleContent = jsonData.body?.bodyText || jsonData.content || jsonData.text || 'No content available';
        console.log('ContentParser: Article content:', articleContent);
      }
    } catch (error) {
      console.log('ContentParser: JSON parse error:', error);
      // Not valid JSON, continue with normal processing
    }
  }

  if (isArticle) {
    // If no content after processing, use a default
    if (!articleContent) {
      articleContent = 'No content available';
    }
    
    parts.push({
      type: 'article',
      content: articleContent,
      title: articleTitle,
    });
    hasArticle = true;
  } else {
    // Split content by various patterns for other interactive elements
    const regex = /(\[!.*?\]|\[_[^\]]*\]|\[[-+][^\]]*\])/g;
  const splitParts = bitmarkContent.split(regex);

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
  }

  return {
    parts,
    hasInteractiveElements: hasCloze || hasMultipleChoice || hasHeader || hasArticle,
    hasCloze,
    hasMultipleChoice,
    hasHeader,
    hasArticle,
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
  
  // First, try to extract bitmark content from JSON
  let bitmarkContent = content;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      bitmarkContent = parsed
        .map((item: any) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            if (item.body && item.body.bodyText) return item.body.bodyText;
            if (item.body && typeof item.body === 'string') return item.body;
            if (item.content) return item.content;
            if (item.text) return item.text;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
    } else if (parsed && typeof parsed === 'object') {
      if (parsed.body && parsed.body.bodyText) {
        bitmarkContent = parsed.body.bodyText;
      } else if (parsed.body && typeof parsed.body === 'string') {
        bitmarkContent = parsed.body;
      } else if (parsed.content) {
        bitmarkContent = parsed.content;
      } else if (parsed.text) {
        bitmarkContent = parsed.text;
      }
    }
  } catch {
    // Not JSON, use content as-is
    bitmarkContent = content;
  }
  
  return /(\[!.*?\]|\[_[^\]]*\]|\[[-+][^\]]*\]|\^?\[\.article\])/.test(bitmarkContent);
}

/**
 * Get the primary interactive type from content
 */
export function getPrimaryInteractiveType(content: string | undefined): 'cloze' | 'multiple-choice' | 'cloze-and-multiple-choice' | 'header' | 'article' | 'text' | null {
  if (!content) return null;

  // First, check if this is JSON with structured data (like articles)
  try {
    const parsed = JSON.parse(content);
    
    // Check for article type in JSON structure
    if (Array.isArray(parsed)) {
      const hasArticle = parsed.some((item: any) => item && typeof item === 'object' && item.type === 'article');
      if (hasArticle) {
        return 'article';
      }
    } else if (parsed && typeof parsed === 'object' && parsed.type === 'article') {
      return 'article';
    }
  } catch {
    // Not JSON, continue with bitmark parsing
  }

  // For bitmark content, check for different interactive types
  const hasCloze = /\[_[^\]]*\]/.test(content);
  const hasMultipleChoice = /\[[-+][^\]]*\]/.test(content);
  const hasHeader = /\[!.*?\]/.test(content);
  const hasArticle = /\^?\[\.article\]/.test(content);

  if (hasArticle) {
    return 'article';
  } else if (hasCloze && hasMultipleChoice) {
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
