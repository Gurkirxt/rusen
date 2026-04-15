import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  activePanel: "none" | "graph" | "settings";
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActivePanel: (panel: "none" | "graph" | "settings") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isCommandPaletteOpen: false,
  activePanel: "none",
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
