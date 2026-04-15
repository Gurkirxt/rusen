import { useEffect } from "react";
import {
  Search,
  Settings,
  Network,
  FolderOpen,
  FilePlus,
  Moon,
  Sun,
  BookOpen,
  Pencil,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUIStore } from "@/stores/ui-store";
import { useEditorStore } from "@/stores/editor-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useVaultStore } from "@/stores/vault-store";
import { open } from "@tauri-apps/plugin-dialog";

export function CommandMenu() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, activePanel, setActivePanel } = useUIStore();
  const { viewMode, setViewMode } = useEditorStore();
  const { setThemeMode } = useSettingsStore();
  const { setActiveVaultPath, fileList } = useVaultStore();
  const { setActiveFilePath } = useEditorStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "," && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActivePanel("settings");
      }
      if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActivePanel(activePanel === "graph" ? "none" : "graph");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen, activePanel, setActivePanel]);

  const runCommand = (fn: () => void) => {
    setCommandPaletteOpen(false);
    fn();
  };

  const openFolder = async () => {
    const path = (await open({ multiple: false, directory: true })) ?? "";
    if (path) setActiveVaultPath(path);
  };

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {fileList.length > 0 && (
          <CommandGroup heading="Notes">
            {fileList.slice(0, 8).map((path) => {
              const name = path.split("/").pop() ?? path;
              return (
                <CommandItem key={path} onSelect={() => runCommand(() => setActiveFilePath(path))}>
                  <Search className="mr-2 h-4 w-4" />
                  {name}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(openFolder)}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Open Folder
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setViewMode(viewMode === "edit" ? "preview" : "edit"))}>
            {viewMode === "edit" ? <BookOpen className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
            {viewMode === "edit" ? "Reading View" : "Live Edit"}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePanel(activePanel === "graph" ? "none" : "graph"))}>
            <Network className="mr-2 h-4 w-4" />
            Toggle Graph
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Note
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setThemeMode("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setThemeMode("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="App">
          <CommandItem onSelect={() => runCommand(() => setActivePanel("settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings (Cmd+,)
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
