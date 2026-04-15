import { describe, it, expect, beforeEach } from "vitest";
import { useVaultStore } from "../stores/vault-store";

describe("vault-store", () => {
  beforeEach(() => {
    useVaultStore.setState({
      activeVaultPath: "",
      directoryTree: [],
      fileList: [],
    });
  });

  it("should set active vault path", () => {
    useVaultStore.getState().setActiveVaultPath("/test/path");
    expect(useVaultStore.getState().activeVaultPath).toBe("/test/path");
  });

  it("should set directory tree", () => {
    const tree = ["file.md", ["folder", "file2.md"]];
    useVaultStore.getState().setDirectoryTree(tree);
    expect(useVaultStore.getState().directoryTree).toEqual(tree);
  });

  it("should set file list", () => {
    const files = ["file.md", "folder/file2.md"];
    useVaultStore.getState().setFileList(files);
    expect(useVaultStore.getState().fileList).toEqual(files);
  });
});
