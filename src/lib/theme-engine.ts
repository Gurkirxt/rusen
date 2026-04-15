import { converter, Oklch } from "culori";

const toOklch = converter("oklch");

export interface Base16Theme {
  name: string;
  colors: Record<string, string>; // base00 to base0F
}

export function hexToOklchString(hex: string): string {
  const color = toOklch(hex) as Oklch;
  if (!color) return "oklch(0 0 0)";
  const l = color.l !== undefined ? color.l.toFixed(3) : "0";
  const c = color.c !== undefined ? color.c.toFixed(3) : "0";
  const h = color.h !== undefined ? color.h.toFixed(1) : "0";
  return `oklch(${l} ${c} ${h})`;
}

export function applyTheme(theme: Base16Theme, isDark: boolean) {
  const root = document.documentElement;

  const mapping: Record<string, string> = {
    // Core UI
    "--background": isDark ? theme.colors.base00 : theme.colors.base07,
    "--foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--card": isDark ? theme.colors.base01 : theme.colors.base06,
    "--card-foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--popover": isDark ? theme.colors.base01 : theme.colors.base06,
    "--popover-foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--primary": theme.colors.base0D,
    "--primary-foreground": isDark ? theme.colors.base00 : theme.colors.base07,
    "--secondary": isDark ? theme.colors.base02 : theme.colors.base05,
    "--secondary-foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--muted": isDark ? theme.colors.base01 : theme.colors.base06,
    "--muted-foreground": isDark ? theme.colors.base03 : theme.colors.base04,
    "--accent": isDark ? theme.colors.base02 : theme.colors.base05,
    "--accent-foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--destructive": theme.colors.base08,
    "--border": isDark ? theme.colors.base02 : theme.colors.base05,
    "--input": isDark ? theme.colors.base02 : theme.colors.base05,
    "--ring": theme.colors.base0D,
    // Sidebar
    "--sidebar": isDark ? theme.colors.base01 : theme.colors.base06,
    "--sidebar-foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--sidebar-primary": theme.colors.base0D,
    "--sidebar-primary-foreground": isDark ? theme.colors.base00 : theme.colors.base07,
    "--sidebar-accent": isDark ? theme.colors.base02 : theme.colors.base05,
    "--sidebar-accent-foreground": isDark ? theme.colors.base05 : theme.colors.base02,
    "--sidebar-border": isDark ? theme.colors.base02 : theme.colors.base05,
    "--sidebar-ring": theme.colors.base0D,
  };

  for (const [cssVar, hexColor] of Object.entries(mapping)) {
    if (hexColor) {
      root.style.setProperty(cssVar, hexToOklchString(hexColor));
    }
  }

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
