import { create } from "zustand";

interface EditorState {
  activeFilePath: string;
  content: string;
  isDirty: boolean;
  viewMode: "edit" | "preview";
  openTabs: string[];
  setActiveFilePath: (path: string) => void;
  setContent: (content: string) => void;
  setIsDirty: (dirty: boolean) => void;
  setViewMode: (mode: "edit" | "preview") => void;
  openTab: (path: string) => void;
  closeTab: (path: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeFilePath: "",
  content: "",
  isDirty: false,
  viewMode: "edit",
  openTabs: [],
  setActiveFilePath: (path) => {
    const { openTabs } = get();
    const tabs = openTabs.includes(path) ? openTabs : [...openTabs, path];
    set({ activeFilePath: path, openTabs: tabs });
  },
  setContent: (content) => set({ content, isDirty: true }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  setViewMode: (mode) => set({ viewMode: mode }),
  openTab: (path) => {
    const { openTabs } = get();
    if (!openTabs.includes(path)) {
      set({ openTabs: [...openTabs, path], activeFilePath: path });
    } else {
      set({ activeFilePath: path });
    }
  },
  closeTab: (path) => {
    const { openTabs, activeFilePath } = get();
    const newTabs = openTabs.filter((t) => t !== path);
    const newActive = activeFilePath === path
      ? (newTabs[newTabs.length - 1] ?? "")
      : activeFilePath;
    set({ openTabs: newTabs, activeFilePath: newActive });
  },
}));
