import { describe, it, expect, vi, beforeEach } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import { useVaultStore } from "../stores/vault-store";
import { useEditorStore } from "../stores/editor-store";

describe("command pipeline integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useVaultStore.setState({
      activeVaultPath: "",
      directoryTree: [],
      fileList: [],
    });
    useEditorStore.setState({
      activeFilePath: "",
      content: "",
      isDirty: false,
      viewMode: "preview",
      openTabs: [],
    });
  });

  it("loading a vault populates directory tree and file list", async () => {
    const mockTree = [
      "readme.md",
      ["notes", "daily.md", "weekly.md"],
    ];
    vi.mocked(invoke).mockResolvedValueOnce(mockTree);

    const store = useVaultStore.getState();
    store.setActiveVaultPath("/home/user/vault");

    const tree = await invoke("get_directory_tree", { path: "/home/user/vault" });
    store.setDirectoryTree(tree as any[]);

    expect(useVaultStore.getState().activeVaultPath).toBe("/home/user/vault");
    expect(useVaultStore.getState().directoryTree).toEqual(mockTree);
  });

  it("opening a file reads content and adds a tab", async () => {
    vi.mocked(invoke).mockResolvedValueOnce("# Hello World\n\nSome content.");

    const editor = useEditorStore.getState();
    editor.setActiveFilePath("/vault/test.md");

    const content = await invoke("read_file", { path: "/vault/test.md" });
    editor.setContent(content as string);
    editor.setIsDirty(false);

    const state = useEditorStore.getState();
    expect(state.activeFilePath).toBe("/vault/test.md");
    expect(state.content).toBe("# Hello World\n\nSome content.");
    expect(state.openTabs).toContain("/vault/test.md");
    expect(state.isDirty).toBe(false);
  });

  it("editing content marks file as dirty, saving clears dirty flag", async () => {
    vi.mocked(invoke).mockResolvedValue(undefined);

    const editor = useEditorStore.getState();
    editor.setActiveFilePath("/vault/test.md");
    editor.setContent("initial");
    editor.setIsDirty(false);

    editor.setContent("modified content");
    expect(useEditorStore.getState().isDirty).toBe(true);

    await invoke("save_file", {
      path: useEditorStore.getState().activeFilePath,
      content: useEditorStore.getState().content,
    });
    editor.setIsDirty(false);

    expect(useEditorStore.getState().isDirty).toBe(false);
    expect(invoke).toHaveBeenCalledWith("save_file", {
      path: "/vault/test.md",
      content: "modified content",
    });
  });

  it("markdown_to_html produces HTML from markdown", async () => {
    vi.mocked(invoke).mockResolvedValueOnce("<h1>Title</h1>\n<p>Paragraph with <a href=\"rusen://note/other\" class=\"internal-link\">other</a></p>\n");

    const result = await invoke("markdown_to_html", { md: "# Title\n\nParagraph with [[other]]" });
    expect(result).toContain("<h1>");
    expect(result).toContain("internal-link");
  });

  it("opening multiple files creates multiple tabs", () => {
    const editor = useEditorStore.getState();
    editor.openTab("/vault/a.md");
    editor.openTab("/vault/b.md");
    editor.openTab("/vault/c.md");

    const state = useEditorStore.getState();
    expect(state.openTabs).toHaveLength(3);
    expect(state.activeFilePath).toBe("/vault/c.md");

    editor.closeTab("/vault/b.md");
    expect(useEditorStore.getState().openTabs).toHaveLength(2);
    expect(useEditorStore.getState().openTabs).not.toContain("/vault/b.md");
  });

  it("closing the active tab switches to the last remaining tab", () => {
    const editor = useEditorStore.getState();
    editor.openTab("/vault/a.md");
    editor.openTab("/vault/b.md");

    editor.closeTab("/vault/b.md");
    expect(useEditorStore.getState().activeFilePath).toBe("/vault/a.md");
  });

  it("closing all tabs clears activeFilePath", () => {
    const editor = useEditorStore.getState();
    editor.openTab("/vault/a.md");
    editor.closeTab("/vault/a.md");
    expect(useEditorStore.getState().activeFilePath).toBe("");
    expect(useEditorStore.getState().openTabs).toHaveLength(0);
  });
});
