import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Base16Theme } from "@/lib/theme-engine";
import defaultThemes from "@/assets/themes.json";

interface SettingsState {
  themeMode: "light" | "dark" | "system";
  activeTheme: Base16Theme;
  customThemes: Base16Theme[];
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  lineNumbers: boolean;
  wordWrap: boolean;
  tabSize: number;
  autoSaveInterval: number; // seconds; 0 = disabled
  defaultViewMode: "edit" | "preview";
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  setActiveTheme: (theme: Base16Theme) => void;
  addCustomTheme: (theme: Base16Theme) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (lh: number) => void;
  setFontFamily: (family: string) => void;
  setLineNumbers: (show: boolean) => void;
  setWordWrap: (wrap: boolean) => void;
  setTabSize: (size: number) => void;
  setAutoSaveInterval: (seconds: number) => void;
  setDefaultViewMode: (mode: "edit" | "preview") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: "system",
      activeTheme: defaultThemes[0] as Base16Theme,
      customThemes: [],
      fontSize: 16,
      lineHeight: 1.6,
      fontFamily: "JetBrains Mono Variable",
      lineNumbers: true,
      wordWrap: true,
      tabSize: 2,
      autoSaveInterval: 0,
      defaultViewMode: "edit",
      setThemeMode: (themeMode) => set({ themeMode }),
      setActiveTheme: (activeTheme) => set({ activeTheme }),
      addCustomTheme: (theme) =>
        set((state) => ({ customThemes: [...state.customThemes, theme] })),
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setTabSize: (tabSize) => set({ tabSize }),
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
      setDefaultViewMode: (defaultViewMode) => set({ defaultViewMode }),
    }),
    {
      name: "rusen-settings",
    }
  )
);
