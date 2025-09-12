/** @jsxImportSource theme-ui */
import { editor } from 'monaco-editor';
import { Flex } from 'theme-ui';

import { MonacoTextArea } from '../monaco/MonacoTextArea';

type Props = {
  text: string;
  format: 'json' | 'bitmark';
};

const DEFAULT_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  minimap: { enabled: false },
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  scrollBeyondLastLine: false,
  renderWhitespace: 'none',
};

export function SandboxOutput({ text, format }: Props) {
  const language = format === 'json' ? 'json' : 'plaintext';
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <MonacoTextArea theme="vs-dark" language={language} value={text} options={DEFAULT_OPTIONS} fitContentHeight />
    </Flex>
  );
}
