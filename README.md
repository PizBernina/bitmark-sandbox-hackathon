
## ToDo
- Integrate LLM features

## Context and design options

Goal
- Enable authors to embed runnable Bitmark examples inside content and show the resulting JSON or Bitmark, entirely client‑side.

Options considered
- Option A: Single self‑contained sandbox bit
  - One bit (e.g., `.sandbox`) that holds input text, output format, options, and renders the computed output.
  - Pros: fully self‑contained; easy to copy/paste and share.
  - Cons: less composable for larger docs; harder to reuse the same input for multiple outputs.

- Option B: Multiple bits
  - Reuse an input editor bit (e.g., `.app-code-editor`) and add separate output bits (`.sandbox-output-json`, `.sandbox-output-bitmark`) that reference the input by `@fromId`.
  - Pros: modular and composable; one input can feed multiple outputs; integrates well in long documents.
  - Cons: requires a small viewer to pair inputs with outputs (simple to implement on top of the existing client parser loader).

-> Option A uses a single new bit (e.g., .sandbox) that embeds everything: input, options, and the desired output format. A viewer renders the computed output inline for that one bit. Because the output is shown “inside” the same bit, there’s no need for separate output bits.
### Sandbox Bits (Option B) – Design, changes, and rationale

-> The separate “output” bits only exist in Option B because we intentionally split concerns (input vs output) across multiple bits to enable reuse and composability.

-> Since we want...
- multiple outputs from one input
- potentially place outputs elsewhere in the document

...we suggest Option B

If we tried to support “multiple outputs” inside one Option A bit, we would end up recreating Option B’s composability inside a single schema (more complex). 
Hence: 
- Option A = cohesion/self‑containment
- Option B = composability/reuse

Option A would make sense in our opinion if we wanted to use it for tutorials, slides etc. (theme "single-snippet" tutorials). Option B is cleaner than packing multiple renderings into one bit.

## Overview
The following chapters describe the multi‑bit “sandbox” approach Option B, the exact changes to the parser config, example usage, a viewer for rendering outputs, and how well the result meets the stated requirements.

- We introduce two output bits that compute results from a referenced input bit:
  - `sandbox-output-json`: renders JSON output from a referenced input code bit.
  - `sandbox-output-bitmark`: renders bitmark output from a referenced input code bit.
- We reuse an existing input bit (e.g. `app-code-editor`) to hold the source text and language.
- The parser/generator only defines the schema (bit types and tags). Actual execution is performed client‑side by a viewer (e.g. bitmark‑playground), using the same client‑side parser it already loads from CDN.

Why multiple bits (Option B)
- Clear separation of concerns (input vs. outputs).
- Flexible layout (input and outputs can be placed apart or repeated).
- Scales in larger documents where outputs reference inputs by id.

## Changes

### 1) New properties
Add to `src/model/enum/PropertyKey.ts`:
```ts
property_fromId: '@fromId',
property_parserVersion: '@parserVersion',
property_prettify: '@prettify',
```

Why:
- `@fromId`: link an output bit to its input bit.
- `@parserVersion`: pin the converter version; reproducible results.
- `@prettify`: format output for readability (true|false|number).

### 2) New bit types
Add to `src/model/enum/BitType.ts`:
```ts
sandboxOutputJson: 'sandbox-output-json',
sandboxOutputBitmark: 'sandbox-output-bitmark',
```

Why:
- Explicit output types with minimal tags.
- Keeps schema small and predictable; easy to render.

### 3) Raw bit configs
Add to `src/config/raw/bits.ts`:
```ts
[BitType.sandboxOutputJson]: {
  since: '4.2.0',
  baseBitType: BitType._standard,
  description: 'Displays JSON output computed from a referenced input code bit',
  tags: [
    { key: ConfigKey.property_fromId, description: 'ID of the source input bit' },
    { key: ConfigKey.property_parserVersion, description: 'Parser version to use (e.g. latest or 4.1.2)' },
    { key: ConfigKey.property_prettify, description: 'true|false|number' },
    { key: ConfigKey.property_duration, description: 'Optional, render-time duration (ms)' },
  ],
},

[BitType.sandboxOutputBitmark]: {
  since: '4.2.0',
  baseBitType: BitType._standard,
  description: 'Displays bitmark output computed from a referenced input code bit',
  tags: [
    { key: ConfigKey.property_fromId, description: 'ID of the source input bit' },
    { key: ConfigKey.property_parserVersion, description: 'Parser version to use' },
    { key: ConfigKey.property_prettify, description: 'true|false|number' },
    { key: ConfigKey.property_duration, description: 'Optional, render-time duration (ms)' },
  ],
},
```

Why:
- Minimal surface area; all computation is externalized to the viewer.
- Reuses common properties for consistency with other bits.

### 4) Input bit (reused, not new)
Use `app-code-editor` as input holder:
- `@id`: stable reference for outputs (`@fromId`).
- `@computerLanguage: bitmark|json`: identifies input language.
- `&code:` resource holds the text.

Why:
- Avoids introducing another input bit. `app-code-editor` already supports code text and language.


## Why we reused `app-code-editor` (and alternatives considered)

### Why reuse `app-code-editor`?
- It already exists and inherits from `code`, so it naturally models “a block of code/text” with:
  - `@computerLanguage: bitmark|json` to label the content
  - `&code:` body to hold the raw text
  - optional UX flags (`@codeLineNumbers`, `@codeMinimap`)
- Zero new input-schema to maintain: lowers surface area and avoids duplication of a “code-like input” bit.
- Consistent authoring experience with other code-centric bits in the ecosystem.
- Backwards- and forwards-compatible: documents can use the editor even outside the sandbox flow.


## Viewer implementation (playground/app)

Add a tiny renderer that:
- Resolves `@fromId` to find the input bit (and its language + text).
- Loads the requested `@parserVersion` (or uses global “latest” already loaded).
- Calls `convert()` client‑side.
- Displays output text; optionally shows duration.

Minimal renderer component:
```tsx
import { useMemo } from 'react';
import { useBitmarkParserGenerator } from '../services/BitmarkParserGenerator';

type Props = {
  inputText: string;
  inputLanguage: 'bitmark' | 'json';
  outputFormat: 'json' | 'bitmark';
  prettify?: boolean | number;
};

export function SandboxRenderer({ inputText, inputLanguage, outputFormat, prettify }: Props) {
  const { bitmarkParserGenerator, loadSuccess, loadError } = useBitmarkParserGenerator();

  const result = useMemo(() => {
    if (!bitmarkParserGenerator || !loadSuccess || loadError) return 'Loading...';

    const out = bitmarkParserGenerator.convert(inputText, {
      outputFormat,
      jsonOptions: typeof prettify !== 'undefined'
        ? { prettifyJson: prettify === true ? 2 : prettify }
        : undefined,
      bitmarkOptions: typeof prettify !== 'undefined'
        ? { prettifyJson: !!prettify }
        : undefined,
    } as any);

    return typeof out === 'string'
      ? out
      : JSON.stringify(out, null, prettify === true ? 2 : (prettify as number | undefined));
  }, [bitmarkParserGenerator, loadSuccess, loadError, inputText, inputLanguage, outputFormat, prettify]);

  return <pre>{result as string}</pre>;
}
```

Note: In a full app, we'd scan the parsed Bitmark JSON, collect `app-code-editor` and `sandbox-output-*` bits, resolve `@fromId`, and render output next to the output bit.

## Viewer

Purpose
- Provide a minimal, framework-agnostic way to execute sandbox pairs: an input editor bit and a matching output bit.

Responsibilities
- Discover pairs: `.app-code-editor` with `@id` and `.sandbox-output-json|.sandbox-output-bitmark` with `@fromId`.
- Resolve parser version (`@parserVersion`) and prettify settings (`@prettify`).
- Convert client-side via `convert()` and render the resulting string.

Discovery algorithm
```ts
type Bit = { bitType: string; properties?: Record<string, unknown>; body?: any };

function indexEditors(bits: Bit[]) {
  const map = new Map<string, { language: 'bitmark'|'json'; text: string }>();
  for (const b of bits) {
    if (b.bitType !== 'app-code-editor') continue;
    const id = String(b.properties?.id || '');
    if (!id) continue;
    const language = (String(b.properties?.computerLanguage || 'bitmark') as 'bitmark'|'json');
    const text = String(b.body?.bodyText || b.body?.text || '');
    map.set(id, { language, text });
  }
  return map;
}

function findOutputs(bits: Bit[]) {
  return bits.filter(b => b.bitType === 'sandbox-output-json' || b.bitType === 'sandbox-output-bitmark');
}
```

Output mapping
- `sandbox-output-json` → `outputFormat: 'json'`
- `sandbox-output-bitmark` → `outputFormat: 'bitmark'`

Options mapping
- `@prettify: true|false|number`
  - JSON: `jsonOptions.prettifyJson = true?2:number`
  - Bitmark: `bitmarkOptions.prettifyJson = !!prettify`
- `@parserVersion: latest|<semver>`
  - If the app uses the playground loader, pass `?v=<version>` in the URL or programmatically load that UMD bundle before rendering.

Execution
```ts
for (const outBit of findOutputs(bits)) {
  const fromId = String(outBit.properties?.fromId || '');
  const editor = editors.get(fromId);
  if (!editor) continue;

  const outputFormat = outBit.bitType === 'sandbox-output-json' ? 'json' : 'bitmark';
  const prettify = outBit.properties?.prettify as boolean | number | undefined;

  const res = bitmarkParserGenerator.convert(editor.text, {
    outputFormat,
    jsonOptions: typeof prettify !== 'undefined' ? { prettifyJson: prettify === true ? 2 : prettify } : undefined,
    bitmarkOptions: typeof prettify !== 'undefined' ? { prettifyJson: !!prettify } : undefined,
  } as any);

  const rendered = typeof res === 'string' ? res : JSON.stringify(res, null, prettify === true ? 2 : (prettify as number | undefined));
  // Render near the output bit in the UI
}
```

Version handling
- With the existing playground provider, the viewer can rely on a globally loaded parser version (via `?v=`) and does not need to load per-output versions.



## Code changes recap

### Parser: @gmb/bitmark-parser-generator

- File: `src/model/enum/PropertyKey.ts` (added properties)
```ts
property_fromId: '@fromId',
property_parserVersion: '@parserVersion',
property_prettify: '@prettify',
```

- File: `src/model/enum/BitType.ts` (added bit types)
```ts
sandboxOutputJson: 'sandbox-output-json',
sandboxOutputBitmark: 'sandbox-output-bitmark',
```

- File: `src/config/raw/bits.ts` (added raw configs)
```ts
[BitType.sandboxOutputJson]: {
  since: '4.2.0',
  baseBitType: BitType._standard,
  description: 'Displays JSON output computed from a referenced input code bit',
  tags: [
    {
      key: ConfigKey.property_fromId,
      description: 'ID of the source input bit',
    },
    {
      key: ConfigKey.property_parserVersion,
      description: 'Parser version to use (e.g. latest or 4.1.2)',
    },
    {
      key: ConfigKey.property_prettify,
      description: 'true|false|number',
    },
    {
      key: ConfigKey.property_duration,
      description: 'Optional, render-time duration (ms)',
    },
  ],
},

[BitType.sandboxOutputBitmark]: {
  since: '4.2.0',
  baseBitType: BitType._standard,
  description: 'Displays bitmark output computed from a referenced input code bit',
  tags: [
    { key: ConfigKey.property_fromId, description: 'ID of the source input bit' },
    { key: ConfigKey.property_parserVersion, description: 'Parser version to use' },
    { key: ConfigKey.property_prettify, description: 'true|false|number' },
    { key: ConfigKey.property_duration, description: 'Optional, render-time duration (ms)' },
  ],
},
```

### Playground: @gmb/bitmark-playground

- File: `src/services/BitmarkParserGenerator.tsx` (DEV override to load local bundle during development)
```ts
const DEV = process.env.NODE_ENV === 'development';
const BITMARK_PARSER_GENERATOR_SCRIPT_URL = DEV
  ? 'http://localhost:<port>/browser/bitmark-parser-generator.min.js'
  : 'https://cdn.jsdelivr.net/npm/@gmb/bitmark-parser-generator@${version}/dist/browser/bitmark-parser-generator.min.js';
```

- File: `src/components/sandbox/SandboxViewer.tsx` (minimal renderer for a single pair)
```tsx
// Normalizes simplified JSON to BitWrapperJson, parses JSON strings, times conversion, and renders
import { useMemo } from 'react';
import { Flex, Text } from 'theme-ui';
import { useBitmarkParserGenerator } from '../../services/BitmarkParserGenerator';

type Input = { id: string; language: 'bitmark' | 'json'; text: string };
type OutputReq = { fromId: string; format: 'json' | 'bitmark'; prettify?: boolean | number };

export function SandboxViewer({ input, output }: { input: Input; output: OutputReq }) {
  const { bitmarkParserGenerator, loadSuccess, loadError } = useBitmarkParserGenerator();

  const { rendered, durationMs, error } = useMemo(() => {
    if (!bitmarkParserGenerator || !loadSuccess || loadError) {
      return { rendered: 'Loading...', durationMs: undefined as number | undefined, error: undefined as string | undefined };
    }
    try {
      const prettify = output.prettify;
      let source: string | unknown = input.text;
      if (input.language === 'json') {
        try {
          const parsed = JSON.parse(input.text);
          const toParagraph = (text: string) => ({ type: 'paragraph', content: [{ text, type: 'text' }], attrs: {} });
          const normalizeBit = (b: any) => {
            if (b && typeof b === 'object' && 'bit' in b) return b;
            const type = b?.type ?? 'article';
            const body = b?.body;
            if (Array.isArray(body)) return { bit: { type, body } };
            if (body && typeof body === 'object' && typeof body.bodyText === 'string') return { bit: { type, body: [toParagraph(body.bodyText)] } };
            if (typeof b === 'string') return { bit: { type, body: [toParagraph(b)] } };
            return { bit: { type } };
          };
          if (Array.isArray(parsed)) source = parsed.map((b) => normalizeBit(b));
          else if (parsed && typeof parsed === 'object') source = [normalizeBit(parsed)];
          else source = parsed;
        } catch { /* leave as string */ }
      }
      const start = performance.now();
      const res = bitmarkParserGenerator.convert(source, {
        outputFormat: output.format,
        jsonOptions: typeof prettify !== 'undefined' ? { prettifyJson: prettify === true ? 2 : prettify } : undefined,
        bitmarkOptions: typeof prettify !== 'undefined' ? { prettifyJson: !!prettify } : undefined,
      } as any);
      const end = performance.now();
      const text = typeof res === 'string' ? res : JSON.stringify(res, null, prettify === true ? 2 : (prettify as number | undefined));
      return { rendered: text, durationMs: Math.round(end - start), error: undefined as string | undefined };
    } catch (e) {
      const end = performance.now();
      return { rendered: '', durationMs: Math.round(end), error: String(e) };
    }
  }, [bitmarkParserGenerator, loadSuccess, loadError, input.text, output.format, output.prettify]);

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Text sx={{ fontSize: 0, color: 'muted' }}>{`fromId=${output.fromId} format=${output.format} ${durationMs ?? ''}ms`}</Text>
      {error ? <pre>{error}</pre> : <pre>{rendered as string}</pre>}
    </Flex>
  );
}
```

- File: `src/components/sandbox/SandboxAutoViewer.tsx` (auto-discovers pairs from right-pane JSON)
```tsx
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
          {`No sandbox outputs found. Add `.concat('.sandbox-output-json', ' or ', '.sandbox-output-bitmark', ' bits referencing an ', '.app-code-editor', ' by id.',)}
        </Text>
      ) : (
        pairs.outputs.map((o, idx) => {
          const editor = pairs.editors.get(o.fromId);
          if (!editor) return null;
          return (
            <SandboxViewer
              key={`${o.fromId}-${idx}`}
              input={{ id: o.fromId, language: editor.language, text: editor.text }}
              output={{ fromId: o.fromId, format: o.format, prettify: o.prettify }}
            />
          );
        })
      )}
    </Flex>
  );
}
```

- File: `src/App.tsx` (render the auto-viewer below editors)
```tsx
// Right column layout: JSON editor (top), Sandbox outputs (bottom)
<Flex sx={{ resize: 'none', variant: 'textarea.code', flex: '1 1 55%', minHeight: 0 }}>
  <BitmarkJsonTextBox className={'json-editor'} sx={{ border: '1px solid', borderColor: 'accent' }} options={{ wordWrap: 'on' }} />
</Flex>
<Flex sx={{ alignItems: 'flex-end', mt: 2 }}>
  <Text sx={{ variant: 'header.code' }}>Sandbox outputs</Text>
</Flex>
<Flex sx={{ flexDirection: 'column', border: '1px solid', borderColor: 'accent', overflowY: 'auto', flex: '1 1 45%', minHeight: 0 }}>
  <SandboxAutoViewer />
</Flex>
```

### UI notes: single-scroll outputs and auto-fitting editor

- To avoid nested scrollbars, let the outer Sandbox outputs pane own scrolling and remove any hidden overflow from inner wrappers (see `overflowY: 'auto'` above).
- Make the code viewer auto-fit its content height so only the pane scrolls. If you use Monaco, enable an auto-fit mode and do not hardcode heights.

Example (Monaco-based output component):

```tsx
// SandboxOutput.tsx
import { Flex } from 'theme-ui';
import { MonacoTextArea } from '../components/monaco/MonacoTextArea';

export function SandboxOutput({ text, format }: { text: string; format: 'json' | 'bitmark' }) {
  const language = format === 'json' ? 'json' : 'plaintext';
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <MonacoTextArea theme="vs-dark" language={language} value={text} fitContentHeight options={{ readOnly: true }} />
    </Flex>
  );
}
```

This approach keeps a single scrollbar for the whole outputs pane and prevents nested scroll regions.

## Why we ended up with this design

- Parser schema vs. execution: The parser defines bit types and validates structure. Executing conversions in the parser would tie UI/behavior to the library and break the “pure” PARSE→AST/JSON contract. We therefore added only minimal new bits (Option B) and kept conversion in the viewer layer.
- Local-first and privacy: All conversions happen client-side (same as the playground). No network calls for content; results are instant and private.
- Composability needs: We wanted one input to drive multiple outputs and allow outputs to be placed elsewhere. Splitting into `.app-code-editor` (+id) and `.sandbox-output-*` (+fromId) gives that flexibility.
- Robust authoring: Real-world inputs vary. We normalized simplified JSON to BitWrapper JSON and unbreakscaped caret-escaped Bitmark so authors can paste common shapes and still see results.
- Developer ergonomics: Using the existing editor bit avoided a new input bit with overlapping semantics. The auto-viewer is small and framework-agnostic, and we can port it to other apps easily.

## How to test

Parser-level (schema):
- Build and tests in `@gmb/bitmark-parser-generator`:
  - `npm ci && npm run build && npm run test`
- Paste the example markup into any parser harness (or a small unit test) and verify the new bit types appear in JSON with the expected properties/tags (no errors).

End‑to‑end (playground/app):
- Paste the example markup on the left of the playground; the right pane should show JSON with the new bit types (proves schema is recognized).
- Add the `SandboxRenderer` to a simple test page; hardcode the `inputText` from the `app-code-editor` bit and show both `sandbox-output-*` variants.
- For version pinning, pass `?v=<semver>` in the playground URL to switch parser versions (already supported by the loader).

## Rationale and trade‑offs

- Minimal additions to the schema; no changes to conversion logic.
- Keeps runtime execution outside the parser library, preserving browser‑only, privacy, and performance properties.
- Multi‑bit composition makes large docs manageable; single input can feed multiple outputs.

## Requirements evaluation

- Approach (several bits, one bit – up to you): Achieved
  - We implement multiple bits (input + two outputs). Clear, modular, and composable.

- Performance (goal: live editing and rendering): Achieved
  - Client‑side conversion uses the same fast parser as the playground; live editing is already proven there. Outputs update instantly on input changes in a viewer.

- Production readiness (bug‑free, working demo, easily usable in other projects): Somewhat Achieved
  - Schema is straightforward; relies on the mature parser. A basic viewer works quickly.

- Security (no issues; browser usage; preferred no extra libs beyond bitmark parser): Achieved
  - No new libs required; runs purely in browser; treat outputs as plain text; no HTML eval.
  - Improvements: enforce size/time limits in the viewer; sanitize display in hosting app.

- Runs fully in the browser: Achieved
  - Uses the same CDN‑loaded parser as the playground; all conversion in the client.

- Published as open source on GitHub (bitmark Association repo, MIT): Somewhat Achieved
  - Code changes are trivial to publish under existing license. To fully achieve:

- Tech stack (up to you; many members use Angular): Achieved
  - Viewer is framework‑agnostic; example provided in React matches the playground. Angular/Vue/Svelte wrappers are trivial since the API is a single `convert()` call.


## Breakscaping rules and fixes

Breakscaping escapes characters in Bitmark text by inserting carets (^) so they aren’t parsed as markup. The inverse (unbreakscaping) removes those carets. Rules differ by context:

- Bitmark body (bitmark++): escape repeated marks, code/title/list-leading markers, tag triggers, dividers, and caret runs.
- Bitmark tag: escape repeated marks, end-of-tag bracket, and caret runs.
- Plain tag: escape end-of-tag and caret runs.
- Plain body: escape start-of-bit triggers only.

In the playground editor:
- Linting shows red squiggles where current text differs from the expected breakscaped form.
- Quick Fix offers “Insert caret(s)” or “Remove unnecessary caret(s)”.
- “Fix all related issues” applies to the selection if present, otherwise the whole document.
- A paste infobar appears when issues are detected in the pasted region; click “Fix pasted region” to apply.
- Warnings are Bitmark-only and can be toggled in the UI (no live auto-fix).

Implementation notes:
- Expected text is computed as breakscape(unbreakscape(input)) with v2 disabled.
- Code/pre/inline-code lines are ignored to reduce false positives.
- Use AST (when available) for precise context; otherwise, safe heuristics are applied.

### Editor bits and ignored regions

- `.app-code-editor` bodies are context-sensitive:
  - If `@computerLanguage: json` OR the body parses as JSON (starts with `{`/`[` and JSON.parse succeeds) → ignored for breakscaping (no warnings/fixes), because it is literal data.
  - If `@computerLanguage: bitmark` → treated as “sample markup” by default and ignored (no warnings/fixes), because authors commonly paste runnable Bitmark examples here.
  - Optional: a per-editor toggle can switch a specific `.app-code-editor` to “literal text” mode, in which case breakscaping lint/fix applies to its body as if it were normal body text. This is useful when the editor holds prose that must be caret-escaped.

- Paste notifications only appear when the pasted region actually differs from the normalized result; if no change is needed, no toast is shown.


## Changes Summary

Code changes in:
- `@gmb/bitmark-parser-generator`
  - `src/model/enum/PropertyKey.ts` (add properties)
  - `src/model/enum/BitType.ts` (add bit types)
  - `src/config/raw/bits.ts` (add bit configs)
- Optional viewer in any chosen app (e.g., bitmark‑playground):
  - `src/components/bitmark/SandboxRenderer.tsx` (or equivalent)

- Defined new properties and bit types in the parser config and provided example usage.
- Provided a minimal viewer to execute conversions client‑side.
- Assessed each requirement with status and suggested improvements where needed.
