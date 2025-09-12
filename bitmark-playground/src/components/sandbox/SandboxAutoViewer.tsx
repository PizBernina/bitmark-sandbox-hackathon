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
          const idArr = entry.bit?.id as string[] | undefined;
          const id = Array.isArray(idArr) && idArr[0] ? idArr[0] : props.id;
          if (!id) continue;
          const language = (entry.bit?.computerLanguage || props.computerLanguage || 'bitmark') as 'bitmark' | 'json';
          const bodyVal = (entry.bit as any)?.body;
          const rawText = typeof bodyVal === 'string' ? bodyVal : bodyVal?.bodyText || bodyVal?.text || '';
          const text = language === 'bitmark' ? unbreakscape(String(rawText)) : String(rawText);
          editors.set(String(id), { language, text });
        } else if (t === 'sandbox-output-json' || t === 'sandbox-output-bitmark') {
          const fromIdArr = entry.bit?.fromId as string[] | undefined;
          let fromId = Array.isArray(fromIdArr) && fromIdArr[0] ? fromIdArr[0] : props.fromId;
          const format = t === 'sandbox-output-json' ? 'json' : ('bitmark' as const);
          let prettify = entry.bit?.prettify ?? props.prettify;

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
          if (fromId) outputs.push({ fromId: String(fromId), format, prettify });
        }
      }
      return { editors, outputs };
    } catch {
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
            if (!editor) return null;
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
