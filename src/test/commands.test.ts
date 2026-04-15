import { describe, it, expect, vi, beforeEach } from "vitest";
import { invoke } from "@tauri-apps/api/core";

describe("Tauri commands", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call get_directory_tree", async () => {
    vi.mocked(invoke).mockResolvedValueOnce(["folder", "file.md"]);
    const result = await invoke("get_directory_tree", { path: "/test" });
    expect(invoke).toHaveBeenCalledWith("get_directory_tree", { path: "/test" });
    expect(result).toEqual(["folder", "file.md"]);
  });

  it("should call read_file", async () => {
    vi.mocked(invoke).mockResolvedValueOnce("file content");
    const result = await invoke("read_file", { path: "/test/file.md" });
    expect(invoke).toHaveBeenCalledWith("read_file", { path: "/test/file.md" });
    expect(result).toBe("file content");
  });

  it("should call save_file", async () => {
    vi.mocked(invoke).mockResolvedValueOnce(undefined);
    await invoke("save_file", { path: "/test/file.md", content: "new content" });
    expect(invoke).toHaveBeenCalledWith("save_file", { path: "/test/file.md", content: "new content" });
  });

  it("should call markdown_to_html", async () => {
    vi.mocked(invoke).mockResolvedValueOnce("<h1>Hello</h1>");
    const result = await invoke("markdown_to_html", { md: "# Hello" });
    expect(invoke).toHaveBeenCalledWith("markdown_to_html", { md: "# Hello" });
    expect(result).toBe("<h1>Hello</h1>");
  });
});
