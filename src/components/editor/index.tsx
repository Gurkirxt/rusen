import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { createTheme } from "@uiw/codemirror-themes";
import { EditorView } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { useSettingsStore } from "@/stores/settings-store";
import { livePreviewPlugin } from "./decorations";

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
  height: 100%;
}
.cm-scroller {
  overflow: auto;
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
.cm-hidden-mark {
  opacity: 0.3;
  font-size: 0.8em;
}
.cm-wikilink {
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
}
.cm-wikilink-active {
  color: var(--primary);
  background: color-mix(in oklch, var(--primary) 20%, transparent);
}
.cm-task-checkbox {
  display: inline-block;
  margin-right: 4px;
}
`;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CodeEditor({ value, onChange, className = "" }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);
  const { lineNumbers, wordWrap, fontSize, tabSize } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
    if (!document.getElementById("codemirror-theme-styles")) {
      const style = document.createElement("style");
      style.id = "codemirror-theme-styles";
      style.appendChild(document.createTextNode(editorStyles));
      document.head.appendChild(style);
    }
  }, []);

  if (!mounted) return null;

  const extensions = [
    markdown({ codeLanguages: languages }),
    livePreviewPlugin,
    EditorView.theme({
      "&": { fontSize: `${fontSize}px` },
      ".cm-content": { fontFamily: "var(--font-mono), ui-monospace, monospace" },
    }),
    indentUnit.of(" ".repeat(tabSize)),
    ...(wordWrap ? [EditorView.lineWrapping] : []),
  ];

  return (
    <div className={`h-full ${className}`}>
      <CodeMirror
        value={value}
        height="100%"
        theme={customTheme}
        onChange={onChange}
        extensions={extensions}
        className="h-full overflow-hidden"
        basicSetup={{
          lineNumbers,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: false,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false,
        }}
      />
    </div>
  );
}
