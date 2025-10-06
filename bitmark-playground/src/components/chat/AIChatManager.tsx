import React, { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { AIChatWindow, AIChatButton, useChatState } from '../../lib/bitmark-ai-chat/index.js';
import { useBitmarkParserGenerator } from '../../services/BitmarkParserGenerator';
import { bitmarkState } from '../../state/bitmarkState';

export const AIChatManager: React.FC = () => {
  const snap = useSnapshot(bitmarkState);
  const { chatState, isLoading, toggleVisibility, toggleMinimize, updatePosition, sendMessage, clearMessages } =
    useChatState();
  const { bitmarkParserGenerator, loadSuccess } = useBitmarkParserGenerator();

  const handleClose = () => {
    // Close the window by hiding it
    toggleVisibility();
  };

  // Compute sandbox outputs from the current JSON
  const sandboxOutputs = useMemo(() => {
    if (!bitmarkParserGenerator || !loadSuccess || !snap.jsonAsString) {
      return '';
    }

    try {
      const unbreakscape = (s: string): string => s.replace(/\^/g, '');
      const arr = JSON.parse(snap.jsonAsString) as any[];
      const editors = new Map<string, { language: string; text: string }>();
      const outputs: Array<{ fromId: string; format: 'json' | 'bitmark'; result: string }> = [];

      // First pass: collect all code editors
      for (const entry of arr) {
        const t = entry.bit?.type;
        if (t === 'app-code-editor') {
          const idArr = entry.bit?.id;
          const id = Array.isArray(idArr) ? idArr[0] : idArr;
          if (!id) continue;

          const langArr = entry.bit?.computerLanguage;
          const language = Array.isArray(langArr) ? langArr[0] : langArr || 'bitmark';
          const bodyVal = entry.bit?.body;
          let text = typeof bodyVal === 'string' ? bodyVal : '';

          // Apply unbreakscape for bitmark language
          if (language === 'bitmark') {
            text = unbreakscape(text);
          }

          editors.set(String(id), { language, text });
        }
      }

      // Second pass: process sandbox outputs
      for (const entry of arr) {
        const t = entry.bit?.type;
        if (t === 'sandbox-output-json' || t === 'sandbox-output-bitmark') {
          const fromIdArr = entry.bit?.fromId;
          let fromId = Array.isArray(fromIdArr) && fromIdArr[0] ? fromIdArr[0] : entry.bit?.fromId;
          if (typeof fromId !== 'string' && Array.isArray(fromId)) {
            fromId = fromId[0];
          }

          // Fallback: extract fromId from bitmark string if not present
          if (!fromId && typeof entry.bitmark === 'string') {
            const match = entry.bitmark.match(/\[@fromId:([^\]]+)\]/);
            if (match) fromId = match[1];
          }

          if (!fromId) continue;

          const editor = editors.get(String(fromId));
          if (!editor) continue;

          const format = t === 'sandbox-output-json' ? 'json' : 'bitmark';
          let prettify = entry.bit?.prettify;
          if (Array.isArray(prettify)) {
            prettify = prettify[0];
          }

          // Fallback: extract prettify from bitmark string if not present
          if (typeof prettify === 'undefined' && typeof entry.bitmark === 'string') {
            const match = entry.bitmark.match(/\[@prettify:([^\]]+)\]/);
            if (match) {
              const val = match[1];
              if (val === 'true' || val === 'false') prettify = val === 'true';
              else {
                const n = Number(val);
                if (!Number.isNaN(n)) prettify = n;
              }
            }
          }

          const prettifyNum = prettify === true ? 2 : Number(prettify) || 2;

          try {
            let source: string | unknown = editor.text;

            // Parse JSON if the editor language is JSON
            if (editor.language === 'json') {
              try {
                const parsed = JSON.parse(editor.text);
                const toParagraph = (text: string) => ({
                  type: 'paragraph',
                  content: [{ text, type: 'text' }],
                  attrs: {},
                });
                const normalizeBit = (b: any) => {
                  if (b && typeof b === 'object' && 'bit' in b) return b;
                  const type = b?.type ?? 'article';
                  const body = b?.body;
                  if (Array.isArray(body)) return { bit: { type, body } };
                  if (body && typeof body === 'object' && typeof body.bodyText === 'string') {
                    return { bit: { type, body: [toParagraph(body.bodyText)] } };
                  }
                  if (typeof b === 'string') return { bit: { type, body: [toParagraph(b)] } };
                  return { bit: { type } };
                };
                if (Array.isArray(parsed)) source = parsed.map((b) => normalizeBit(b));
                else if (parsed && typeof parsed === 'object') source = [normalizeBit(parsed)];
                else source = parsed;
              } catch {
                // Leave as string if JSON parsing fails
              }
            }

            const res = bitmarkParserGenerator.convert(source, {
              outputFormat: format,
              jsonOptions: { prettifyJson: prettifyNum },
              bitmarkOptions: { prettifyJson: !!prettify },
            } as any);

            const result = typeof res === 'string' ? res : JSON.stringify(res, null, prettifyNum);

            outputs.push({ fromId: String(fromId), format, result });
          } catch (e) {
            outputs.push({ fromId: String(fromId), format, result: `Error: ${String(e)}` });
          }
        }
      }

      // Format all outputs into a readable string
      return outputs
        .map((o) => `[Sandbox Output: fromId=${o.fromId}, format=${o.format}]\n${o.result}`)
        .join('\n\n---\n\n');
    } catch (error) {
      return `Error computing sandbox outputs: ${String(error)}`;
    }
  }, [bitmarkParserGenerator, loadSuccess, snap.jsonAsString]);

  // Extract rendered UI HTML from DOM
  const getRenderedUIHtml = (): string => {
    try {
      // Find the BitmarkRenderer container by ID
      const container = document.getElementById('bitmark-rendered-ui-container');

      if (container) {
        const html = container.innerHTML;
        if (html && html.trim()) {
          // Return a cleaned up version with a reasonable length limit
          return html.length > 5000 ? html.substring(0, 5000) + '...[truncated]' : html;
        }
      }

      return 'No rendered UI content available';
    } catch (error) {
      return `Error extracting rendered UI: ${String(error)}`;
    }
  };

  // Create pane content from current state
  const paneContent = {
    input_json_or_bitmark_pane: snap.markup || '',
    json_content: snap.jsonAsString || '',
    rendered_ui_pane: getRenderedUIHtml(),
    sandbox_output_pane: sandboxOutputs,
  };

  return (
    <>
      <AIChatButton onClick={toggleVisibility} isVisible={chatState.isVisible} />
      <AIChatWindow
        isVisible={chatState.isVisible}
        onMinimize={toggleMinimize}
        onClear={clearMessages}
        onSendMessage={(message) => sendMessage(message, paneContent)}
        messages={chatState.messages}
        isMinimized={chatState.isMinimized}
        position={chatState.position}
        onPositionChange={updatePosition}
        onClose={handleClose}
        isLoading={isLoading}
      />
    </>
  );
};
