import { editor, languages, MarkerSeverity, Range } from 'monaco-editor';
import * as MonacoModule from 'monaco-editor';
import { createPortal } from 'react-dom';
import { EditorDidMount } from 'react-monaco-editor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Flex } from 'theme-ui';
import { useSnapshot } from 'valtio';
import { Parser } from 'web-tree-sitter';

import treeSitterBitmarkGrammar from '../../monaco-tree-sitter/grammars/bitmark.json';
// import treeSitterCppGrammar from '../../monaco-tree-sitter/grammars/cpp.json';
// import treeSitterTypescriptGrammar from '../../monaco-tree-sitter/grammars/typescript.json';
import { Language } from '../../monaco-tree-sitter/language';
import { MonacoTreeSitter } from '../../monaco-tree-sitter/monaco-tree-sitter';
import { Grammar } from '../../monaco-tree-sitter/types/grammer';
import { useBitmarkConverter } from '../../services/BitmarkConverter';
import { useBitmarkParserGenerator } from '../../services/BitmarkParserGenerator';
import { bitmarkState } from '../../state/bitmarkState';
import { MonacoTextArea, MonacoTextAreaUncontrolledProps } from '../monaco/MonacoTextArea';

const DEFAULT_MONACO_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  renderWhitespace: 'all',
  insertSpaces: false,
};

export interface BitmarkMarkupTextBoxProps extends MonacoTextAreaUncontrolledProps {
  initialMarkup?: string;
}

const BitmarkMarkupTextBox = (props: BitmarkMarkupTextBoxProps) => {
  const { initialMarkup, options, ...restProps } = props;
  const bitmarkStateSnap = useSnapshot(bitmarkState);
  const { loadSuccess, loadError, markupToJson } = useBitmarkConverter();
  const { bitmarkParserGenerator } = useBitmarkParserGenerator();

  // Debug parser loading
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('DEBUG: bitmarkParserGenerator changed', { hasBPG: !!bitmarkParserGenerator });
  }, [bitmarkParserGenerator]);

  // Local UI state for paste notification
  const [pasteRegion, setPasteRegion] = useState<Range | undefined>(undefined);
  const [showPasteInfo, setShowPasteInfo] = useState(false);
  const analysisTimerRef = useRef<number | undefined>(undefined);
  const editorRef = useRef<editor.IStandaloneCodeEditor | undefined>(undefined);
  const monacoRef = useRef<typeof MonacoModule | undefined>(undefined);
  const codeActionDisposableRef = useRef<MonacoModule.IDisposable | undefined>(undefined);
  const decorationIdsRef = useRef<string[]>([]);

  const onInput = useCallback(
    async (markup: string) => {
      await markupToJson(markup, {
        jsonOptions: {
          enableWarnings: true,
          // textAsPlainText: true,
        },
      });
    },
    [markupToJson],
  );

  const editorDidMount = useCallback<EditorDidMount>((ed, _monaco) => {
    // HACK: Init monaco-tree-sitter language

    // editor.updateOptions({
    //   // Disable the default monaco highlighter
    //   // This is needed because monaco-tree-sitter will handle the highlighter
    //   // and monaco will not be able to handle the tree-sitter highlighter
    //   wordWrap: 'on',
    //   bracketPairColorization: {
    //     enabled: false,
    //   },
    // });

    // Load the tree-sitter language WASM file
    // const languageWasmPath = new URL('./tree-sitter-languages.wasm', import.meta.url).toString();
    // const language = new Language(treeSitterTypescriptGrammar as Grammar);
    // const language = new Language(treeSitterCppGrammar as Grammar);
    const language = new Language(treeSitterBitmarkGrammar as Grammar);

    // TODO - this loads the language WASM file (is async, should be awaited)
    // const languageWasmPath = new URL('../../tree-sitter-typescript.wasm', import.meta.url).toString();
    const languageWasmPath = new URL('../../tree-sitter-bitmark.wasm', import.meta.url).toString();
    language.init(languageWasmPath, Parser).then(() => {
      // Apply the language to the editor
      new MonacoTreeSitter(MonacoModule, ed, language);
    });

    // Store editor refs for diagnostics
    editorRef.current = ed;
    monacoRef.current = _monaco as unknown as typeof MonacoModule;

    // Ensure validation decorations (squiggles) are rendered by Monaco
    ed.updateOptions({ renderValidationDecorations: 'on' });

    // Listen for paste to trigger paste infobar
    ed.onDidPaste?.((e: { range: Range }) => {
      setPasteRegion(e?.range);
      // Only show if pasted region actually differs after normalization (and not ignored)
      const model = ed.getModel();
      if (model) {
        const orig = model.getValueInRange(e.range);
        const norm = computeNormalizedForRange(model, e.range);
        setShowPasteInfo(norm !== orig);
      } else {
        setShowPasteInfo(false);
      }
      // Kick off a focused analysis for the pasted region
      scheduleAnalysis(50);
    });

    // Register code action provider for breakscaping
    registerBreakscapeCodeActions();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (codeActionDisposableRef.current) {
        codeActionDisposableRef.current.dispose();
        codeActionDisposableRef.current = undefined;
      }
    };
  }, []);

  // Run breakscape analysis and set Monaco markers
  const runAnalysis = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('DEBUG: runAnalysis called');
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco || !bitmarkParserGenerator) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: runAnalysis early return', {
        hasEditor: !!ed,
        hasMonaco: !!monaco,
        hasBPG: !!bitmarkParserGenerator,
        breakscapeEnabled: bitmarkStateSnap.breakscapeWarningsEnabled,
      });
      return;
    }

    const model = ed.getModel();
    if (!model) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: no model found');
      return;
    }
    const text = model.getValue() ?? '';
    // eslint-disable-next-line no-console
    console.log('DEBUG: analysis text', { textLength: text.length, text: text.substring(0, 100) });

    const ignoredLines = getIgnoredLineSet(model);
    // eslint-disable-next-line no-console
    console.log('DEBUG: ignored lines', { count: ignoredLines.size, lines: Array.from(ignoredLines) });

    // Compute canonical breakscaped form: breakscape(unbreakscape(text))
    let normalized = text;
    try {
      // eslint-disable-next-line no-console
      console.log('DEBUG: available methods', Object.getOwnPropertyNames(bitmarkParserGenerator));

      // Check for breakscaping in global scope
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const global = window as any;
      // eslint-disable-next-line no-console
      console.log('DEBUG: global breakscaping methods', {
        hasBreakscape: !!global.breakscape,
        hasUnbreakscape: !!global.unbreakscape,
        hasBreakscapeText: !!global.breakscapeText,
        hasUnbreakscapeText: !!global.unbreakscapeText,
        globalKeys: Object.keys(global).filter((k) => k.includes('breakscape') || k.includes('Breakscape')),
      });

      // Simple breakscaping implementation since parser methods are not available
      // eslint-disable-next-line no-console
      console.log('DEBUG: using simple breakscaping implementation');

      // Breakscaping rules: only add carets for unescaped brackets with trigger characters
      // that are followed by text content (not other brackets or structural elements)
      // Trigger characters: . @ # ▼ ► % ! ? + - $ _ = &
      // Find brackets that need breakscaping (have trigger chars, no caret, followed by text)
      const needsBreakscaping = /\[(?![^[\]]*\^)([.@#\u25BC\u25BA%!?+\-$_=&][^[\]]*)\](?=\s*[^[\s])/g;

      // Apply breakscaping: add caret only to brackets that need it
      const br = text.replace(needsBreakscaping, '[^$1]');

      normalized = br;
      // eslint-disable-next-line no-console
      console.log('DEBUG: breakscaping computation', {
        original: text.substring(0, 50),
        breakscaped: br.substring(0, 50),
        normalized: normalized.substring(0, 50),
        changed: normalized !== text,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: breakscaping failed', error);
      // If breakscape fails, clear markers and exit gracefully
      monaco.editor.setModelMarkers(model, 'breakscape', []);
      return;
    }

    // eslint-disable-next-line no-console
    console.log('DEBUG: breakscaping check', {
      enabled: bitmarkStateSnap.breakscapeWarningsEnabled,
      normalized: normalized === text,
      textLength: text.length,
      normalizedLength: normalized.length,
    });

    if (!bitmarkStateSnap.breakscapeWarningsEnabled || normalized === text) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: clearing markers', {
        enabled: bitmarkStateSnap.breakscapeWarningsEnabled,
        normalized: normalized === text,
      });
      monaco.editor.setModelMarkers(model, 'breakscape', []);
      if (decorationIdsRef.current.length) {
        decorationIdsRef.current = ed.deltaDecorations(decorationIdsRef.current, []);
      }
      return;
    }

    // Build diff markers between text and normalized
    let markers: editor.IMarkerData[] = buildDiffMarkers(text, normalized, model, ignoredLines);
    // Heuristic fallback: if none found, search for unescaped start-of-tag triggers in non-ignored lines
    if (markers.length === 0) {
      const heuristic = findHeuristicMarkers(model, ignoredLines);
      if (heuristic.length > 0) markers = heuristic;
    }

    // eslint-disable-next-line no-console
    console.log('DEBUG: setting markers', { markerCount: markers.length, markers });
    monaco.editor.setModelMarkers(model, 'breakscape', markers);
    // Also decorate with squiggles explicitly to ensure visibility with custom highlighter
    if (markers.length > 0) {
      const decorations = markers.map((m) => ({
        range: new Range(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn),
        options: {
          className: m.severity === MarkerSeverity.Error ? 'breakscape-error-underline' : 'breakscape-warn-underline',
          inlineClassName:
            m.severity === MarkerSeverity.Error ? 'breakscape-error-underline' : 'breakscape-warn-underline',
          overviewRulerColor: m.severity === MarkerSeverity.Error ? '#ff5c5c' : '#ffcc66',
          overviewRulerLane: 4,
          stickiness: 1,
        },
      }));
      decorationIdsRef.current = ed.deltaDecorations(decorationIdsRef.current, decorations);
    } else if (decorationIdsRef.current.length) {
      decorationIdsRef.current = ed.deltaDecorations(decorationIdsRef.current, []);
    }
  }, [bitmarkParserGenerator, bitmarkStateSnap.breakscapeWarningsEnabled]);

  // Schedule debounced analysis
  const scheduleAnalysis = useCallback(
    (delayMs: number = 300) => {
      if (analysisTimerRef.current) window.clearTimeout(analysisTimerRef.current);
      analysisTimerRef.current = window.setTimeout(() => {
        runAnalysis();
      }, delayMs);
    },
    [runAnalysis],
  );

  // Trigger initial breakscaping analysis after editor mounts and parser loads
  useEffect(() => {
    if (editorRef.current && monacoRef.current && bitmarkParserGenerator) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: triggering initial analysis - all dependencies ready');
      scheduleAnalysis(100);
    }
  }, [scheduleAnalysis, bitmarkParserGenerator]);

  // Build minimal diff markers for display and quick fix
  const buildDiffMarkers = useCallback(
    (orig: string, canon: string, model: editor.ITextModel, ignoredLines: Set<number>): editor.IMarkerData[] => {
      const markers: editor.IMarkerData[] = [];
      // Simple linear diff: walk both strings and accumulate mismatch runs
      let i = 0;
      let j = 0;
      const lenA = orig.length;
      const lenB = canon.length;
      while (i < lenA || j < lenB) {
        if (i < lenA && j < lenB && orig[i] === canon[j]) {
          i++;
          j++;
          continue;
        }

        // start of a mismatch run
        const startOffsetA = i;
        const startOffsetB = j;
        // advance until we realign or reach end
        // naive strategy: advance the shorter lookahead until chars align or window exceeded
        let window = 0;
        const WINDOW_MAX = 64;
        while (i < lenA && j < lenB && orig[i] !== canon[j] && window < WINDOW_MAX) {
          // Heuristic: if next char matches current other, step one side
          if (i + 1 < lenA && orig[i + 1] === canon[j]) {
            i++;
          } else if (j + 1 < lenB && canon[j + 1] === orig[i]) {
            j++;
          } else {
            i++;
            j++;
          }
          window++;
        }
        // extend to include any remaining unequal tail up to alignment
        while (i < lenA && j < lenB && orig[i] !== canon[j]) {
          i++;
          j++;
        }

        const endOffsetA = i;
        const endOffsetB = j;

        // Create a marker for the original mismatch region
        const startPos = model.getPositionAt(startOffsetA);
        const endPos = model.getPositionAt(Math.max(startOffsetA, endOffsetA));

        // Skip if region intersects ignored lines
        for (let ln = startPos.lineNumber; ln <= endPos.lineNumber; ln++) {
          if (ignoredLines.has(ln)) {
            // move on to next mismatch
            continue;
          }
        }

        // Classify severity: if issue involves ']' or '[' without caret, escalate to error; else warning
        const sliceA = orig.slice(startOffsetA, endOffsetA);
        const sliceB = canon.slice(startOffsetB, endOffsetB);
        const isBracketIssue = /\]|\[/.test(sliceA) || /\]|\[/.test(sliceB);
        const severity = isBracketIssue ? MarkerSeverity.Error : MarkerSeverity.Warning;

        markers.push({
          severity,
          source: 'breakscape',
          code: sliceB.length > sliceA.length ? 'breakscape.missingCaret' : 'breakscape.unnecessaryCaret',
          message:
            (sliceB.length > sliceA.length
              ? 'Missing caret(s) for breakscaping in this context.'
              : 'Unnecessary caret(s) found; not required by breakscaping rules.') +
            ' See README: Breakscaping rules and fixes.',
          startLineNumber: startPos.lineNumber,
          startColumn: startPos.column,
          endLineNumber: endPos.lineNumber,
          endColumn: endPos.column,
        });
      }

      return markers;
    },
    [],
  );

  // Heuristic: flag '[.' style tag triggers lacking a caret in non-ignored lines
  const findHeuristicMarkers = useCallback(
    (model: editor.ITextModel, ignoredLines: Set<number>): editor.IMarkerData[] => {
      const res: editor.IMarkerData[] = [];
      const total = model.getLineCount();
      const trigger = /(?<!\^)\[(?=[.@#\u25BC\u25BA%!?+\-$_=&])/g; // '[' before a trigger, not preceded by '^'
      for (let ln = 1; ln <= total; ln++) {
        if (ignoredLines.has(ln)) continue;
        const line = model.getLineContent(ln);
        let m: RegExpExecArray | null;
        trigger.lastIndex = 0;
        while ((m = trigger.exec(line))) {
          const col = m.index + 1; // 1-based
          res.push({
            severity: MarkerSeverity.Warning,
            source: 'breakscape',
            code: 'breakscape.missingCaret',
            message: 'Possible tag trigger without escape (add ^ after [).',
            startLineNumber: ln,
            startColumn: col,
            endLineNumber: ln,
            endColumn: col + 1,
          });
        }
      }
      return res;
    },
    [],
  );

  // Determine lines to ignore (code/pre/inline-code heuristics)
  const getIgnoredLineSet = useCallback((model: editor.ITextModel): Set<number> => {
    const set = new Set<number>();
    const total = model.getLineCount();
    // Heuristics: ignore code lines and app-code-editor bodies
    let inAppCodeEditor = false;
    let inAppCodeBody = false;
    const TAG_START = /^\[(?:[.@#\u25BC\u25BA%!?+\-$_=&])/; // simplified tag triggers
    for (let ln = 1; ln <= total; ln++) {
      const line = model.getLineContent(ln);

      // Detect start of an app-code-editor bit (allow inline properties on same line)
      if (/^\[\.app-code-editor[^\]]*\]/.test(line)) {
        inAppCodeEditor = true;
        inAppCodeBody = false;
        continue;
      }

      if (inAppCodeEditor) {
        // If we see another unescaped tag line, we are still in header/properties; body hasn't started yet
        if (TAG_START.test(line) && !/^\^\[/.test(line)) {
          // header or next bit. If it's next bit (not properties), exit body/header
          // Properties are also tags starting with [@...], treat still header; remain in app-code-editor until body begins
          // To detect transition to next bit, look for bit-type tag [.xxx]
          if (/^\[\./.test(line)) {
            // next bit starts; exit app-code-editor
            inAppCodeEditor = false;
            inAppCodeBody = false;
          }
          // do not ignore this tag line
        } else {
          // This is body content of app-code-editor (could be JSON/bitmark code)
          inAppCodeBody = true;
        }
      }

      // If inside app-code-editor body, ignore line
      if (inAppCodeBody) {
        set.add(ln);
        continue;
      }

      // Generic code/pre heuristics
      if (/^\|/.test(line)) {
        set.add(ln);
        continue;
      }
      if (/^(```|~~~)/.test(line)) {
        set.add(ln);
        continue;
      }
      const backticks = (line.match(/`/g) || []).length;
      if (backticks >= 4) set.add(ln);
    }
    return set;
  }, []);

  // Register code actions for quick fix and fix all
  const registerBreakscapeCodeActions = useCallback(() => {
    if (!monacoRef.current) return;
    if (codeActionDisposableRef.current) {
      codeActionDisposableRef.current.dispose();
      codeActionDisposableRef.current = undefined;
    }
    codeActionDisposableRef.current = monacoRef.current.languages.registerCodeActionProvider('bitmark', {
      provideCodeActions: (model, range, context) => {
        const hasBreakscapeIssues = context.markers?.some((m) => m.source === 'breakscape');
        if (!hasBreakscapeIssues) return { actions: [], dispose: () => undefined };

        // Quick Fix for current marker
        const quickFix: languages.CodeAction = {
          title: 'Insert/remove caret(s) (Quick Fix)',
          kind: 'quickfix',
          diagnostics: context.markers,
          edit: buildWorkspaceEdit(model, range, computeNormalizedForRange(model, range)),
          isPreferred: true,
        } as unknown as languages.CodeAction;

        // Fix all related issues (selection if any else whole doc)
        const selection = editorRef.current?.getSelection();
        const targetRange =
          selection && !selection.isEmpty()
            ? selection
            : new Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount()));
        const fixAll: languages.CodeAction = {
          title: 'Fix all breakscaping issues',
          kind: 'quickfix',
          edit: buildWorkspaceEdit(model, targetRange, computeNormalizedForRange(model, targetRange)),
        } as unknown as languages.CodeAction;

        return { actions: [quickFix, fixAll], dispose: () => undefined };
      },
    });
  }, []);

  // Helper: build WorkspaceEdit from a single range replacement
  const buildWorkspaceEdit = useCallback(
    (model: editor.ITextModel, r: Range, text: string): languages.WorkspaceEdit => {
      return {
        edits: [
          {
            resource: model.uri,
            textEdit: { range: r, text },
            versionId: model.getVersionId(),
          },
        ],
      } as languages.WorkspaceEdit;
    },
    [],
  );

  // Compute normalized breakscaped text for a model range
  const computeNormalizedForRange = useCallback(
    (model: editor.ITextModel, r: Range): string => {
      const ignored = getIgnoredLineSet(model);
      const startLine = r.startLineNumber;
      const endLine = r.endLineNumber;
      const lines: string[] = [];
      for (let ln = startLine; ln <= endLine; ln++) {
        const lineRange = new Range(ln, 1, ln, model.getLineMaxColumn(ln));
        const lineText = model.getValueInRange(lineRange);
        if (ignored.has(ln)) {
          lines.push(lineText);
          continue;
        }
        try {
          // In tag lines, respect leading caret if present to prevent double-escaping
          if (/^\^?\[/.test(lineText)) {
            const un = bitmarkParserGenerator?.unbreakscapeText(lineText) as string;
            const br = bitmarkParserGenerator?.breakscapeText(un) as string;
            lines.push((br ?? lineText) as string);
          } else {
            const un = bitmarkParserGenerator?.unbreakscapeText(lineText) as string;
            const br = bitmarkParserGenerator?.breakscapeText(un) as string;
            lines.push((br ?? lineText) as string);
          }
        } catch {
          lines.push(lineText);
        }
      }
      // Reconstruct with original EOLs
      const eol = model.getEOL();
      return lines.join(eol);
    },
    [bitmarkParserGenerator],
  );

  // Do initial conversion with the initial markup
  useEffect(() => {
    if (!initialMarkup) return;
    onInput(initialMarkup ?? '');
  }, [initialMarkup, onInput]);

  // Debounced analysis when value changes (defer to animation frame to avoid ResizeObserver warning)
  useEffect(() => {
    let raf = 0;
    raf = window.requestAnimationFrame(() => scheduleAnalysis(300));
    return () => window.cancelAnimationFrame(raf);
  }, [bitmarkStateSnap.markup]);

  // Auto-hide paste toast after a short delay
  useEffect(() => {
    if (!showPasteInfo) return;
    const t = window.setTimeout(() => setShowPasteInfo(false), 6000);
    return () => window.clearTimeout(t);
  }, [showPasteInfo]);

  if (loadSuccess) {
    const opts = {
      ...DEFAULT_MONACO_OPTIONS,
      ...options,
    };

    const value = bitmarkStateSnap.markupErrorAsString ?? bitmarkStateSnap.markup;
    return (
      <Flex sx={{ position: 'relative', width: '100%', flex: '1 1 auto' }}>
        <MonacoTextArea
          {...restProps}
          theme="vs-dark"
          language={'bitmark'}
          value={value}
          options={opts}
          onInput={(v) => {
            onInput(v);
            scheduleAnalysis(300);
          }}
          editorDidMount={editorDidMount}
        />
        {showPasteInfo && pasteRegion
          ? createPortal(
              <Flex
                sx={{
                  position: 'fixed',
                  right: 16,
                  bottom: 16,
                  zIndex: 2147483647,
                  alignItems: 'center',
                  gap: 2,
                  px: 3,
                  py: 2,
                  bg: 'background',
                  border: '1px solid',
                  borderColor: 'accent',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
                  borderRadius: 4,
                }}
              >
                {`Breakscaping issues detected in pasted content.`}
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    const ed = editorRef.current;
                    const model = ed?.getModel();
                    if (!ed || !model) return;
                    const text = computeNormalizedForRange(model, pasteRegion);
                    ed.executeEdits('breakscape', [{ range: pasteRegion, text, forceMoveMarkers: true }]);
                    setShowPasteInfo(false);
                    scheduleAnalysis(150);
                  }}
                >
                  Fix pasted region
                </button>
                <button style={{ marginLeft: 6 }} onClick={() => setShowPasteInfo(false)}>
                  Dismiss
                </button>
              </Flex>,
              document.body,
            )
          : null}
      </Flex>
    );
  } else {
    let text = 'Loading...';
    if (loadError) {
      text = 'Load failed.';
    }
    return (
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {text}
      </Flex>
    );
  }
};

export { BitmarkMarkupTextBox };
