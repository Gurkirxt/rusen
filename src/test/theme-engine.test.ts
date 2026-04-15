import { describe, it, expect, beforeEach } from "vitest";
import { hexToOklchString, applyTheme, Base16Theme } from "../lib/theme-engine";

const testTheme: Base16Theme = {
  name: "Test Theme",
  colors: {
    base00: "#18181b",
    base01: "#27272a",
    base02: "#3f3f46",
    base03: "#52525b",
    base04: "#71717a",
    base05: "#a1a1aa",
    base06: "#d4d4d8",
    base07: "#f4f4f5",
    base08: "#ef4444",
    base09: "#f97316",
    base0A: "#eab308",
    base0B: "#22c55e",
    base0C: "#06b6d4",
    base0D: "#3b82f6",
    base0E: "#a855f7",
    base0F: "#ec4899",
  },
};

describe("hexToOklchString", () => {
  it("converts black to oklch with zero lightness", () => {
    const result = hexToOklchString("#000000");
    expect(result).toMatch(/^oklch\(/);
    expect(result).toContain("0.000 0.000");
  });

  it("converts white to oklch with ~1.0 lightness", () => {
    const result = hexToOklchString("#ffffff");
    expect(result).toMatch(/^oklch\(1\.000/);
  });

  it("returns oklch() format string", () => {
    const result = hexToOklchString("#3b82f6");
    expect(result).toMatch(/^oklch\(\d+\.\d+ \d+\.\d+ .+\)$/);
  });

  it("handles invalid input gracefully", () => {
    const result = hexToOklchString("invalid");
    expect(result).toBe("oklch(0 0 0)");
  });
});

describe("applyTheme", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("style");
  });

  it("applies dark mode class and sets CSS variables as oklch()", () => {
    applyTheme(testTheme, true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    const bg = document.documentElement.style.getPropertyValue("--background");
    expect(bg).toMatch(/^oklch\(/);
    const primary = document.documentElement.style.getPropertyValue("--primary");
    expect(primary).toMatch(/^oklch\(/);
  });

  it("removes dark class in light mode", () => {
    document.documentElement.classList.add("dark");
    applyTheme(testTheme, false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("maps base0D to --primary", () => {
    applyTheme(testTheme, true);
    const primary = document.documentElement.style.getPropertyValue("--primary");
    const expected = hexToOklchString("#3b82f6");
    expect(primary).toBe(expected);
  });

  it("swaps background between dark and light", () => {
    applyTheme(testTheme, true);
    const darkBg = document.documentElement.style.getPropertyValue("--background");

    applyTheme(testTheme, false);
    const lightBg = document.documentElement.style.getPropertyValue("--background");

    expect(darkBg).not.toBe(lightBg);
  });

  it("sets sidebar variables", () => {
    applyTheme(testTheme, true);
    const sidebar = document.documentElement.style.getPropertyValue("--sidebar");
    expect(sidebar).toMatch(/^oklch\(/);
    const sidebarFg = document.documentElement.style.getPropertyValue("--sidebar-foreground");
    expect(sidebarFg).toMatch(/^oklch\(/);
  });
});
