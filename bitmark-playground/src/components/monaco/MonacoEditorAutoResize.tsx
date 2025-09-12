import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import type { monaco } from 'react-monaco-editor';
import React, { createRef } from 'react';

export interface MonacoEditorAutoResizeProps extends MonacoEditorProps {
  // When true, automatically grows the editor height to fit its content
  // so the outer container can own scrolling.
  fitContentHeight?: boolean;
  // Optional hard cap for auto height to avoid unbounded growth
  maxContentHeight?: number;
}

interface State {
  width: number;
  height: number;
}

class MonacoEditorAutoResize extends React.Component<MonacoEditorAutoResizeProps, State> {
  private divRef = createRef<HTMLDivElement>();
  private resizeObserver: ResizeObserver | undefined;
  private width = 0;
  private height = 0;
  private editor: monaco.editor.IStandaloneCodeEditor | undefined;
  private disposables: Array<() => void> = [];

  constructor(props: MonacoEditorProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };

    this.divResize = this.divResize.bind(this);
    this.resizeObserver = new ResizeObserver(this.divResize);
  }

  componentDidMount(): void {
    const div = this.divRef.current;
    if (div && this.resizeObserver) {
      this.resizeObserver.observe(div);
    }
  }

  componentWillUnmount(): void {
    const div = this.divRef.current;
    if (div && this.resizeObserver) {
      this.resizeObserver.unobserve(div);
    }
    // Dispose listeners
    for (const dispose of this.disposables) {
      try {
        dispose();
      } catch (_err) {
        // Intentionally ignore errors during dispose
        void 0;
      }
    }
  }

  divResize(_entries: ResizeObserverEntry[], _observer: ResizeObserver): void {
    const div = this.divRef.current;

    if (div) {
      this.width = div.clientWidth ?? 0;
      this.height = div.clientHeight ?? 0;

      // Always update width; height depends on mode
      const nextState: State = {
        width: this.width,
        height: this.props.fitContentHeight ? this.state.height : this.height,
      };
      this.setState(nextState);

      // If we already have an editor, re-layout on width changes
      if (this.editor) {
        const targetHeight = this.props.fitContentHeight ? this.state.height : this.height;
        try {
          this.editor.layout({ width: this.width, height: targetHeight });
        } catch (_err) {
          // Ignore layout errors (editor may be tearing down)
          void 0;
        }
      }
    }
  }

  private onEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, m: typeof monaco) => {
    this.editor = editor;

    if (this.props.fitContentHeight) {
      const updateHeight = () => {
        const contentHeight = editor.getContentHeight();
        const max = this.props.maxContentHeight ?? Number.POSITIVE_INFINITY;
        const targetHeight = Math.min(contentHeight, max);
        // Update state and layout editor
        this.setState({ height: targetHeight });
        try {
          editor.layout({ width: this.width, height: targetHeight });
        } catch (_err) {
          // Ignore layout errors (editor may not be ready)
          void 0;
        }
      };

      // Initial layout and then subscribe to content size changes
      updateHeight();
      const disposable = editor.onDidContentSizeChange(updateHeight);
      this.disposables.push(() => disposable.dispose());
    }

    // Pass through to consumer's handler if provided
    if (this.props.editorDidMount) {
      this.props.editorDidMount(editor, m);
    }
  };

  render() {
    const { className, fitContentHeight, maxContentHeight, editorDidMount, ...rest } = this
      .props as MonacoEditorAutoResizeProps & {
      editorDidMount?: MonacoEditorProps['editorDidMount'];
    };
    return (
      <>
        <div
          className={className ?? undefined}
          ref={this.divRef}
          style={{ display: 'block', width: '100%', height: fitContentHeight ? 'auto' : '100%' }}
        >
          <MonacoEditor
            {...rest}
            editorDidMount={this.onEditorDidMount}
            width={this.width}
            height={fitContentHeight ? this.state.height : this.height}
          />
        </div>
      </>
    );
  }
}

export { MonacoEditorAutoResize };
