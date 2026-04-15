import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "../stores/settings-store";

describe("settings-store", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      themeMode: "system",
      fontSize: 16,
      lineHeight: 1.6,
      lineNumbers: true,
      wordWrap: true,
      tabSize: 2,
      autoSaveInterval: 0,
      defaultViewMode: "preview",
    });
  });

  it("should update theme mode", () => {
    useSettingsStore.getState().setThemeMode("dark");
    expect(useSettingsStore.getState().themeMode).toBe("dark");
  });

  it("should update font size", () => {
    useSettingsStore.getState().setFontSize(18);
    expect(useSettingsStore.getState().fontSize).toBe(18);
  });

  it("should update line height", () => {
    useSettingsStore.getState().setLineHeight(1.8);
    expect(useSettingsStore.getState().lineHeight).toBe(1.8);
  });

  it("should toggle line numbers", () => {
    useSettingsStore.getState().setLineNumbers(false);
    expect(useSettingsStore.getState().lineNumbers).toBe(false);
  });

  it("should update tab size", () => {
    useSettingsStore.getState().setTabSize(4);
    expect(useSettingsStore.getState().tabSize).toBe(4);
  });

  it("should update auto-save interval", () => {
    useSettingsStore.getState().setAutoSaveInterval(30);
    expect(useSettingsStore.getState().autoSaveInterval).toBe(30);
  });

  it("should update default view mode", () => {
    useSettingsStore.getState().setDefaultViewMode("edit");
    expect(useSettingsStore.getState().defaultViewMode).toBe("edit");
  });

  it("should add custom theme", () => {
    const theme = {
      name: "My Theme",
      colors: { base00: "#000", base01: "#111", base02: "#222", base03: "#333",
                base04: "#444", base05: "#555", base06: "#666", base07: "#777",
                base08: "#f00", base09: "#f90", base0A: "#ff0", base0B: "#0f0",
                base0C: "#0ff", base0D: "#00f", base0E: "#f0f", base0F: "#f06" },
    };
    useSettingsStore.getState().addCustomTheme(theme);
    expect(useSettingsStore.getState().customThemes).toContain(theme);
  });
});
