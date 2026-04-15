import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../stores/editor-store";

describe("editor-store", () => {
  beforeEach(() => {
    useEditorStore.setState({
      activeFilePath: "",
      content: "",
      isDirty: false,
      viewMode: "edit",
      openTabs: [],
    });
  });

  it("should set active file path and add it to tabs", () => {
    useEditorStore.getState().setActiveFilePath("/test/file.md");
    expect(useEditorStore.getState().activeFilePath).toBe("/test/file.md");
    expect(useEditorStore.getState().openTabs).toContain("/test/file.md");
  });

  it("should not duplicate tabs when opening same file twice", () => {
    useEditorStore.getState().setActiveFilePath("/test/file.md");
    useEditorStore.getState().setActiveFilePath("/test/file.md");
    expect(useEditorStore.getState().openTabs.length).toBe(1);
  });

  it("should open multiple tabs", () => {
    useEditorStore.getState().openTab("/notes/a.md");
    useEditorStore.getState().openTab("/notes/b.md");
    expect(useEditorStore.getState().openTabs.length).toBe(2);
    expect(useEditorStore.getState().activeFilePath).toBe("/notes/b.md");
  });

  it("should close tab and switch to previous one", () => {
    useEditorStore.getState().openTab("/notes/a.md");
    useEditorStore.getState().openTab("/notes/b.md");
    useEditorStore.getState().closeTab("/notes/b.md");
    expect(useEditorStore.getState().openTabs).not.toContain("/notes/b.md");
    expect(useEditorStore.getState().activeFilePath).toBe("/notes/a.md");
  });

  it("should set content and mark as dirty", () => {
    useEditorStore.getState().setContent("new content");
    expect(useEditorStore.getState().content).toBe("new content");
    expect(useEditorStore.getState().isDirty).toBe(true);
  });

  it("should toggle view mode", () => {
    useEditorStore.getState().setViewMode("edit");
    expect(useEditorStore.getState().viewMode).toBe("edit");
  });
});
