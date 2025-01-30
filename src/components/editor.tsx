import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

// Create a custom theme that uses shadcn CSS variables
const customTheme = createTheme({
  theme: 'light',
  settings: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    caret: 'hsl(var(--foreground))',
    selection: 'hsl(var(--muted))',
    selectionMatch: 'hsl(var(--muted))',
    lineHighlight: 'hsl(var(--muted))',
    gutterBackground: 'hsl(var(--background))',
    gutterForeground: 'hsl(var(--muted-foreground))',
  },
  styles: [
    // { tag: t.heading, color: 'hsl(var(--primary))' },
    // { tag: t.emphasis, fontStyle: 'italic' },
    // { tag: t.strong, fontWeight: 'bold' },
    // { tag: t.keyword, color: 'hsl(var(--primary))' },
    // { tag: t.atom, color: 'hsl(var(--primary))' },
    // { tag: t.bool, color: 'hsl(var(--primary))' },
    // { tag: t.url, color: 'hsl(var(--primary))' },
    // { tag: t.link, color: 'hsl(var(--primary))', textDecoration: 'underline' },
    // { tag: t.string, color: 'hsl(var(--secondary))' },
    // { tag: t.comment, color: 'hsl(var(--muted-foreground))' },
    // // Additional markdown-specific tags
    // { tag: t.processingInstruction, color: 'hsl(var(--secondary))' },
    // { tag: t.list, color: 'hsl(var(--foreground))' },
    // { tag: t.quote, color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' },
  ],
});

// Add CodeMirror specific styles that use shadcn variables
const editorStyles = `
.cm-editor {
  background-color: hsl(var(--background)) !important;
  color: hsl(var(--foreground)) !important;
}

.cm-editor .cm-gutters {
  background-color: hsl(var(--background)) !important;
  color: hsl(var(--muted-foreground)) !important;
  border-right: 1px solid hsl(var(--border)) !important;
}

.cm-editor .cm-activeLineGutter {
  background-color: hsl(var(--muted)) !important;
}

.cm-editor .cm-activeLine {
  background-color: hsl(var(--muted) / 0.3) !important;
}

.cm-editor .cm-selectionMatch {
  background-color: hsl(var(--muted)) !important;
}

.cm-editor .cm-cursor {
  border-left-color: hsl(var(--foreground)) !important;
}

.cm-editor .cm-selectionBackground {
  background-color: hsl(var(--muted)) !important;
}

.cm-editor.cm-focused .cm-selectionBackground {
  background-color: hsl(var(--muted)) !important;
}

.cm-editor .cm-line {
  color: hsl(var(--foreground)) !important;
}

.cm-editor .cm-content {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
`;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Add the CodeMirror specific styles
    if (!document.getElementById('codemirror-theme-styles')) {
      const style = document.createElement('style');
      style.id = 'codemirror-theme-styles';
      style.appendChild(document.createTextNode(editorStyles));
      document.head.appendChild(style);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const extensions = [
    markdown({
      codeLanguages: languages
    })
  ];

  return (
    <div className={`w-full h-full rounded-md border border-border border-t-0 ${className}`}>
      <CodeMirror
        value={value}
        height="h-fit"
        theme={customTheme}
        onChange={onChange}
        extensions={extensions}
        className="overflow-hidden rounded-md"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
