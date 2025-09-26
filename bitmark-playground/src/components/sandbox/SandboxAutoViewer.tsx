import { useMemo } from 'react';
import { Flex, Text } from 'theme-ui';
import { useSnapshot } from 'valtio';

import { bitmarkState } from '../../state/bitmarkState';

import { SandboxViewer } from './SandboxViewer';

type Bit = {
  bit: {
    type: string;
    body?: any;
    id?: string[];
    computerLanguage?: string;
    fromId?: string[];
    prettify?: boolean | number;
  };
  parser?: any;
  properties?: any;
  bitmark?: string;
} & Record<string, any>;

export function SandboxAutoViewer() {
  const snap = useSnapshot(bitmarkState);

  const pairs = useMemo(() => {
    try {
      const unbreakscape = (s: string): string => s.replace(/\^/g, '');
      const arr = JSON.parse(snap.jsonAsString) as Bit[];
      const editors = new Map<string, { language: 'bitmark' | 'json'; text: string }>();
      const outputs: Array<{ fromId: string; format: 'json' | 'bitmark'; prettify?: boolean | number }> = [];

      for (const entry of arr) {
        const t = entry.bit?.type;
        const props = (entry as any).properties || {};
        if (t === 'app-code-editor') {
          // Properties can be in bit object or properties object
          const idArr = entry.bit?.id as string[] | undefined;
          let id = Array.isArray(idArr) && idArr[0] ? idArr[0] : props.id || entry.bit?.id;
          // Handle case where id is a single string rather than array
          if (typeof id !== 'string' && Array.isArray(id)) {
            id = id[0];
          }
          if (!id) continue;

          // Handle computerLanguage which might be an array too
          const langArr = entry.bit?.computerLanguage as string[] | string | undefined;
          const language =
            (Array.isArray(langArr) ? langArr[0] : langArr) ||
            props.computerLanguage ||
            ('bitmark' as 'bitmark' | 'json');
          const bodyVal = (entry.bit as any)?.body;
          let rawText = '';

          if (typeof bodyVal === 'string') {
            rawText = bodyVal;
          } else if (bodyVal?.bodyText || bodyVal?.text) {
            rawText = bodyVal.bodyText || bodyVal.text;
          } else if (Array.isArray(bodyVal)) {
            // Handle array of paragraphs (typical for app-code-editor)
            rawText = bodyVal
              .map((paragraph: any) => {
                if (typeof paragraph === 'string') return paragraph;
                if (paragraph?.content && Array.isArray(paragraph.content)) {
                  return paragraph.content.map((content: any) => content?.text || '').join('');
                }
                return paragraph?.text || '';
              })
              .join('\n');
          }

          const text = language === 'bitmark' ? unbreakscape(String(rawText)) : String(rawText);
          editors.set(String(id), { language, text });
        } else if (t === 'sandbox-output-json' || t === 'sandbox-output-bitmark' || t === '_error') {
          const fromIdArr = entry.bit?.fromId as string[] | undefined;
          let fromId = Array.isArray(fromIdArr) && fromIdArr[0] ? fromIdArr[0] : props.fromId || entry.bit?.fromId;
          // Handle case where fromId is a single string rather than array
          if (typeof fromId !== 'string' && Array.isArray(fromId)) {
            fromId = fromId[0];
          }
          // For _error types, try to extract the actual bit type from the bitmark string
          let actualType = t;
          if (t === '_error' && typeof entry.bitmark === 'string') {
            const match = entry.bitmark.match(/^\[\.([^[\]]+)\]/);
            if (match) {
              actualType = match[1];
            }
          }
          const format = actualType === 'sandbox-output-json' ? 'json' : ('bitmark' as const);
          let prettify = entry.bit?.prettify ?? props.prettify;
          // Handle case where prettify is an array
          if (Array.isArray(prettify)) {
            prettify = prettify[0];
          }

          // Fallback: extract fromId/prettify from original bitmark string if not present in JSON
          if ((!fromId || typeof prettify === 'undefined') && typeof entry.bitmark === 'string') {
            const bm = entry.bitmark as string;
            if (!fromId) {
              const m = bm.match(/\[@fromId:([^\]]+)\]/);
              if (m) fromId = m[1];
            }
            if (typeof prettify === 'undefined') {
              const m2 = bm.match(/\[@prettify:([^\]]+)\]/);
              if (m2) {
                const val = m2[1];
                if (val === 'true' || val === 'false') prettify = val === 'true';
                else {
                  const n = Number(val);
                  if (!Number.isNaN(n)) prettify = n;
                }
              }
            }
          }
          // Only add outputs for actual sandbox output types
          if ((actualType === 'sandbox-output-json' || actualType === 'sandbox-output-bitmark') && fromId) {
            outputs.push({ fromId: String(fromId), format, prettify });
          }
        }
      }
      return { editors, outputs };
    } catch (error) {
      return { editors: new Map(), outputs: [] as Array<any> };
    }
  }, [snap.jsonAsString]);

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3, p: 3 }}>
      {pairs.outputs.length === 0 ? (
        <Text sx={{ color: 'muted', fontSize: 1 }}>
          {`No sandbox outputs found. Add `.concat(
            '.sandbox-output-json',
            ' or ',
            '.sandbox-output-bitmark',
            ' bits referencing an ',
            '.app-code-editor',
            ' by id.',
          )}
        </Text>
      ) : (
        <Flex sx={{ flexDirection: 'column', gap: 3 }}>
          {pairs.outputs.map((o, idx) => {
            const editor = pairs.editors.get(o.fromId);
            if (!editor) {
              return null;
            }
            return (
              <SandboxViewer
                key={`${o.fromId}-${idx}`}
                input={{ id: o.fromId, language: editor.language, text: editor.text }}
                output={{ fromId: o.fromId, format: o.format, prettify: o.prettify }}
              />
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}
