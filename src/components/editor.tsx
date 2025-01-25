import Editor from "@monaco-editor/react";
import { type EditorProps } from "@monaco-editor/react";

const editorOptions: EditorProps["options"] = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  lineNumbers: "on",
  roundedSelection: false,
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 8,
  },
  tabSize: 2,
  insertSpaces: true,
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="90vh"
      defaultLanguage="markdown"
      value={value}
      onChange={onChange}
      options={editorOptions}
    />
  );
}
