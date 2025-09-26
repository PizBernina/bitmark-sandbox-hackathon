import ReactDOM from 'react-dom/client';
import React from 'react';
import { Parser } from 'web-tree-sitter';

import { App } from './App';
import treeSitterTheme from './monaco-tree-sitter/themes/tomorrow.json';
import { Theme, ThemeConfig } from './monaco-tree-sitter/theme';
// import reportWebVitals from './reportWebVitals';
import './index.css';

// Handle ResizeObserver errors globally
window.addEventListener('error', (event) => {
  if (event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    // This is a benign error that can be safely ignored
    event.preventDefault();
    return false;
  }
});

async function start(): Promise<void> {
  // Load the monaco-tree-sitter theme
  Theme.load(treeSitterTheme as ThemeConfig, 'tomorrow');

  // Init tree-sitter-web
  await Parser.init();

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
