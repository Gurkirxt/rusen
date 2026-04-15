import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { applyTheme } from "@/lib/theme-engine";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode, activeTheme } = useSettingsStore();

  useEffect(() => {
    const isDark =
      themeMode === "dark" ||
      (themeMode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    applyTheme(activeTheme, isDark);
  }, [themeMode, activeTheme]);

  return <>{children}</>;
}
