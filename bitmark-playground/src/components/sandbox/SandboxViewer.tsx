/** @jsxImportSource theme-ui */
import { useMemo } from 'react';
import { Flex, Text } from 'theme-ui';

import { useBitmarkParserGenerator } from '../../services/BitmarkParserGenerator';

import { SandboxOutput } from './SandboxOutput';

type Input = { id: string; language: 'bitmark' | 'json'; text: string };
type OutputReq = { fromId: string; format: 'json' | 'bitmark'; prettify?: boolean | number };

export function SandboxViewer({ input, output }: { input: Input; output: OutputReq }) {
  const { bitmarkParserGenerator, loadSuccess, loadError } = useBitmarkParserGenerator();

  const { rendered, durationMs, error } = useMemo(() => {
    if (!bitmarkParserGenerator || !loadSuccess || loadError) {
      return {
        rendered: 'Loading...',
        durationMs: undefined as number | undefined,
        error: undefined as string | undefined,
      };
    }

    try {
      const prettify = output.prettify;
      // If the editor language is JSON, parse it to a JS object to avoid any auto-detection ambiguity
      let source: string | unknown = input.text;
      if (input.language === 'json') {
        try {
          const parsed = JSON.parse(input.text);
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
          // leave as string
        }
      }
      const start = performance.now();
      const res = bitmarkParserGenerator.convert(source, {
        outputFormat: output.format,
        jsonOptions:
          typeof prettify !== 'undefined' ? { prettifyJson: prettify === true ? 2 : prettify } : { prettifyJson: 2 },
        bitmarkOptions: typeof prettify !== 'undefined' ? { prettifyJson: !!prettify } : { prettifyJson: true },
      } as any);
      const end = performance.now();
      const text =
        typeof res === 'string'
          ? res
          : JSON.stringify(res, null, prettify === true ? 2 : typeof prettify === 'number' ? prettify : 2);
      return {
        rendered: text,
        durationMs: Math.round(end - start),
        error: undefined as string | undefined,
      };
    } catch (e) {
      const end = performance.now();
      return { rendered: '', durationMs: Math.round(end), error: String(e) };
    }
  }, [bitmarkParserGenerator, loadSuccess, loadError, input.text, output.format, output.prettify]);

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Text sx={{ fontSize: 0, color: 'muted' }}>
        {`fromId=${output.fromId} format=${output.format} ${durationMs ?? ''}ms`}
      </Text>
      {error ? (
        <SandboxOutput text={error} format={'bitmark'} />
      ) : (
        <SandboxOutput text={rendered as string} format={output.format} />
      )}
    </Flex>
  );
}
