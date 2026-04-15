import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { createTheme } from "@uiw/codemirror-themes";

const customTheme = createTheme({
  theme: "light",
  settings: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    caret: "var(--foreground)",
    selection: "var(--muted)",
    selectionMatch: "var(--muted)",
    lineHighlight: "var(--muted)",
    gutterBackground: "var(--background)",
    gutterForeground: "var(--muted-foreground)",
  },
  styles: [],
});

const editorStyles = `
.cm-editor {
  background-color: var(--background) !important;
  color: var(--foreground) !important;
}
.cm-editor .cm-gutters {
  background-color: var(--background) !important;
  color: var(--muted-foreground) !important;
  border-right: 1px solid var(--border) !important;
}
.cm-editor .cm-activeLineGutter {
  background-color: var(--muted) !important;
}
.cm-editor .cm-activeLine {
  background-color: color-mix(in oklch, var(--muted) 30%, transparent) !important;
}
.cm-editor .cm-selectionMatch {
  background-color: var(--muted) !important;
}
.cm-editor .cm-cursor {
  border-left-color: var(--foreground) !important;
}
.cm-editor .cm-selectionBackground {
  background-color: var(--muted) !important;
}
.cm-editor.cm-focused .cm-selectionBackground {
  background-color: var(--muted) !important;
}
.cm-editor .cm-line {
  color: var(--foreground) !important;
}
.cm-editor .cm-content {
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
`;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CodeEditor({
  value,
  onChange,
  className = "",
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!document.getElementById("codemirror-theme-styles")) {
      const style = document.createElement("style");
      style.id = "codemirror-theme-styles";
      style.appendChild(document.createTextNode(editorStyles));
      document.head.appendChild(style);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const extensions = [
    markdown({
      codeLanguages: languages,
    }),
  ];

  return (
    <div
      className={`h-full rounded-md border border-border border-t-0 ${className}`}
    >
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
}
