import { create } from "zustand";

interface VaultState {
  activeVaultPath: string;
  directoryTree: any[];
  fileList: string[];
  setActiveVaultPath: (path: string) => void;
  setDirectoryTree: (tree: any[]) => void;
  setFileList: (files: string[]) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  activeVaultPath: "",
  directoryTree: [],
  fileList: [],
  setActiveVaultPath: (path) => set({ activeVaultPath: path }),
  setDirectoryTree: (tree) => set({ directoryTree: tree }),
  setFileList: (files) => set({ fileList: files }),
}));
