import { useCallback } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/stores/ui-store";
import { useVaultStore } from "@/stores/vault-store";
import { Base16Theme, applyTheme } from "@/lib/theme-engine";
import defaultThemes from "@/assets/themes.json";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "@/components/ui/button";
import { FolderOpen, Upload } from "lucide-react";

const FONT_FAMILIES = [
  "JetBrains Mono Variable",
  "monospace",
  "ui-monospace",
  "Courier New",
];

const KEYBINDINGS: Array<{ key: string; description: string }> = [
  { key: "Cmd+S", description: "Save file" },
  { key: "Cmd+E", description: "Toggle edit / preview" },
  { key: "Cmd+G", description: "Toggle graph panel" },
  { key: "Cmd+J", description: "Open command palette" },
  { key: "Cmd+,", description: "Open settings" },
  { key: "Cmd+W", description: "Close current tab" },
];

export function SettingsPanel() {
  const { activePanel, setActivePanel } = useUIStore();
  const { activeVaultPath, setActiveVaultPath } = useVaultStore();
  const {
    themeMode,
    activeTheme,
    customThemes,
    fontSize,
    lineHeight,
    fontFamily,
    lineNumbers,
    wordWrap,
    tabSize,
    autoSaveInterval,
    defaultViewMode,
    setThemeMode,
    setActiveTheme,
    addCustomTheme,
    setFontSize,
    setLineHeight,
    setFontFamily,
    setLineNumbers,
    setWordWrap,
    setTabSize,
    setAutoSaveInterval,
    setDefaultViewMode,
  } = useSettingsStore();

  const allThemes = [...(defaultThemes as Base16Theme[]), ...customThemes];

  const handleThemeSelect = useCallback(
    (themeName: string) => {
      const t = allThemes.find((th) => th.name === themeName);
      if (!t) return;
      setActiveTheme(t);
      const isDark =
        themeMode === "dark" ||
        (themeMode === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      applyTheme(t, isDark);
    },
    [allThemes, themeMode, setActiveTheme]
  );

  const importTheme = async () => {
    const filePath = (await open({
      multiple: false,
      filters: [{ name: "iTerm Color Scheme", extensions: ["itermcolors"] }],
    })) as string | null;
    if (!filePath) return;
    try {
      const content = await invoke<string>("read_file", { path: filePath });
      const name = filePath.split("/").pop()?.replace(".itermcolors", "") ?? "Imported Theme";
      const parsed = await invoke<Base16Theme>("parse_itermcolors", { name, content });
      addCustomTheme(parsed);
      handleThemeSelect(parsed.name);
    } catch (e) {
      console.error("Failed to import theme:", e);
    }
  };

  const openVaultFolder = async () => {
    const path = (await open({ multiple: false, directory: true })) as string | null;
    if (path) setActiveVaultPath(path);
  };

  return (
    <Dialog
      open={activePanel === "settings"}
      onOpenChange={(open) => setActivePanel(open ? "settings" : "none")}
    >
      <DialogContent className="sm:max-w-[540px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
            <TabsTrigger value="vault" className="flex-1">Vault</TabsTrigger>
            <TabsTrigger value="keys" className="flex-1">Keys</TabsTrigger>
            <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          </TabsList>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-5 pt-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color Mode</Label>
              <Select value={themeMode} onValueChange={(v) => setThemeMode(v as "light" | "dark" | "system")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color Theme</Label>
                <Button variant="outline" size="sm" onClick={importTheme} className="h-7 text-xs gap-1">
                  <Upload className="h-3 w-3" />
                  Import .itermcolors
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {allThemes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleThemeSelect(t.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors border ${
                      activeTheme.name === t.name
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <div className="flex gap-0.5 shrink-0">
                      {["base08", "base0B", "base0D", "base0E"].map((k) => (
                        <span
                          key={k}
                          className="h-3 w-3 rounded-full"
                          style={{ background: t.colors[k] }}
                        />
                      ))}
                    </div>
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Font Size</Label>
                <span className="text-sm text-muted-foreground">{fontSize}px</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={([v]) => setFontSize(v)}
                min={11}
                max={24}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Line Height</Label>
                <span className="text-sm text-muted-foreground">{lineHeight}</span>
              </div>
              <Slider
                value={[lineHeight]}
                onValueChange={([v]) => setLineHeight(v)}
                min={1.2}
                max={2.4}
                step={0.1}
              />
            </div>
          </TabsContent>

          {/* Editor */}
          <TabsContent value="editor" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label>Line Numbers</Label>
              <Switch checked={lineNumbers} onCheckedChange={setLineNumbers} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Word Wrap</Label>
              <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label>Tab Size</Label>
              <Select value={String(tabSize)} onValueChange={(v) => setTabSize(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                  <SelectItem value="8">8 spaces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Auto-save Interval</Label>
              <Select value={String(autoSaveInterval)} onValueChange={(v) => setAutoSaveInterval(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Disabled (manual Cmd+S)</SelectItem>
                  <SelectItem value="5">Every 5 seconds</SelectItem>
                  <SelectItem value="15">Every 15 seconds</SelectItem>
                  <SelectItem value="30">Every 30 seconds</SelectItem>
                  <SelectItem value="60">Every 60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Default View Mode</Label>
              <Select value={defaultViewMode} onValueChange={(v) => setDefaultViewMode(v as "edit" | "preview")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Vault */}
          <TabsContent value="vault" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Vault</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-md truncate">
                  {activeVaultPath || "No vault selected"}
                </code>
                <Button variant="outline" size="sm" onClick={openVaultFolder} className="shrink-0 gap-1">
                  <FolderOpen className="h-4 w-4" />
                  Change
                </Button>
              </div>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              The vault is pre-indexed at startup. Open a new folder to switch vaults.
            </p>
          </TabsContent>

          {/* Keybindings */}
          <TabsContent value="keys" className="space-y-3 pt-4">
            <p className="text-xs text-muted-foreground mb-2">
              Global keyboard shortcuts (non-configurable).
            </p>
            <div className="space-y-1">
              {KEYBINDINGS.map(({ key, description }) => (
                <div key={key} className="flex items-center justify-between py-1.5 text-sm">
                  <span>{description}</span>
                  <Badge variant="outline" className="font-mono text-xs">{key}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="space-y-4 pt-4 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-lg">Rusen</p>
              <p className="text-muted-foreground">A fast, minimal Obsidian-like note-taking app built on Tauri + Rust.</p>
            </div>
            <Separator />
            <div className="space-y-1 text-muted-foreground">
              <p>Stack: Tauri 2 · React 19 · Vite 8 · Tailwind CSS 4 · CodeMirror 6 · D3 · pulldown-cmark · SQLite</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
