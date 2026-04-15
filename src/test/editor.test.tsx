import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import CodeEditor from "../components/editor";

describe("CodeEditor", () => {
  it("renders editor correctly", () => {
    const onChange = vi.fn();
    
    render(
      <CodeEditor
        value="# Hello World"
        onChange={onChange}
      />
    );

    // CodeMirror doesn't render text directly in a simple way, but we can check if the editor container is there
    const editorContainer = document.querySelector(".cm-editor");
    expect(editorContainer).toBeInTheDocument();
  });
});
