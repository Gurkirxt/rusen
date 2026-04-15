import { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { invoke } from "@tauri-apps/api/core";
import DOMPurify from "dompurify";
import { AppSidebar } from "@/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/settings/theme-provider";
import { ModeToggle } from "@/components/settings/mode-toggle";
import CodeEditor from "@/components/editor";
import { BookOpen, Pencil, Network, Settings, Command } from "lucide-react";
import { CommandMenu } from "@/components/layout/command-menu";
import { TabBar } from "@/components/layout/tab-bar";
import { useVaultStore } from "@/stores/vault-store";
import { useEditorStore } from "@/stores/editor-store";
import { useUIStore } from "@/stores/ui-store";
import { SettingsPanel } from "@/components/settings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSettingsStore } from "@/stores/settings-store";

const KnowledgeGraph = lazy(() =>
  import("@/components/graph").then((m) => ({ default: m.KnowledgeGraph }))
);
const PdfViewer = lazy(() =>
  import("@/components/pdf").then((m) => ({ default: m.PdfViewer }))
);

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function App() {
  const { activeVaultPath, directoryTree, setDirectoryTree } = useVaultStore();
  const { activeFilePath, content, viewMode, isDirty, setContent, setActiveFilePath, setIsDirty, setViewMode } = useEditorStore();
  const { activePanel, setActivePanel, isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { autoSaveInterval } = useSettingsStore();
  const [htmlPreview, setHtmlPreview] = useState("");
  const saveInFlightRef = useRef(false);

  // Debounce content for markdown preview (200ms) to avoid re-rendering on every keystroke
  const debouncedContent = useDebounce(content, 200);

  useEffect(() => {
    if (activeVaultPath) {
      invoke<any[]>("get_directory_tree", { path: activeVaultPath })
        .then((tree) => setDirectoryTree(tree))
        .catch(console.error);
    }
  }, [activeVaultPath, setDirectoryTree]);

  useEffect(() => {
    if (activeFilePath && !activeFilePath.endsWith(".pdf")) {
      invoke<string>("read_file", { path: activeFilePath })
        .then((text) => {
          setContent(text);
          setIsDirty(false);
        })
        .catch(console.error);
    }
  }, [activeFilePath, setContent, setIsDirty]);

  useEffect(() => {
    if (viewMode === "preview" && debouncedContent) {
      invoke<string>("markdown_to_html", { md: debouncedContent })
        .then((parsedHtml) => {
          setHtmlPreview(DOMPurify.sanitize(parsedHtml));
        })
        .catch(console.error);
    }
  }, [viewMode, debouncedContent]);

  const saveFile = useCallback(() => {
    if (!activeFilePath || !isDirty || saveInFlightRef.current) return;
    saveInFlightRef.current = true;
    invoke<void>("save_file", { path: activeFilePath, content })
      .then(() => setIsDirty(false))
      .catch(console.error)
      .finally(() => { saveInFlightRef.current = false; });
  }, [activeFilePath, content, isDirty, setIsDirty]);

  // Auto-save
  useEffect(() => {
    if (!autoSaveInterval || autoSaveInterval <= 0) return;
    const id = setInterval(saveFile, autoSaveInterval * 1000);
    return () => clearInterval(id);
  }, [autoSaveInterval, saveFile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveFile();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        setViewMode(viewMode === "edit" ? "preview" : "edit");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveFile, viewMode, setViewMode]);

  const fileName = activeFilePath
    ? activeFilePath.split("/").pop() ?? activeFilePath
    : null;

  const handleEditorChange = useCallback(
    (v: string | undefined) => { if (v !== undefined) setContent(v); },
    [setContent]
  );

  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar
            directoryTree={directoryTree}
            directoryPath={activeVaultPath}
            onFileClick={setActiveFilePath}
          />
          <SidebarInset className="flex flex-col min-h-0">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm flex h-11 shrink-0 items-center gap-2 border-b border-border px-3">
              <SidebarTrigger className="-ml-1 h-7 w-7" />
              <Separator orientation="vertical" className="h-4" />

              <Breadcrumb className="flex-1 min-w-0">
                <BreadcrumbList>
                  {activeVaultPath && (
                    <>
                      <BreadcrumbItem className="text-xs text-muted-foreground truncate">
                        {activeVaultPath.split("/").pop()}
                      </BreadcrumbItem>
                      {fileName && <BreadcrumbSeparator />}
                    </>
                  )}
                  {fileName && (
                    <BreadcrumbItem className="text-xs font-medium truncate">
                      {fileName}
                      {isDirty && <span className="ml-1 text-muted-foreground">•</span>}
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCommandPaletteOpen(!isCommandPaletteOpen)}
                    >
                      <Command className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Command Palette (Cmd+J)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setActivePanel(activePanel === "graph" ? "none" : "graph")}
                    >
                      <Network className={`h-4 w-4 ${activePanel === "graph" ? "text-primary" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Graph (Cmd+G)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
                    >
                      {viewMode === "edit"
                        ? <BookOpen className="h-4 w-4" />
                        : <Pencil className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {viewMode === "edit" ? "Reading View (Cmd+E)" : "Live Edit (Cmd+E)"}
                  </TooltipContent>
                </Tooltip>

                <ModeToggle />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setActivePanel(activePanel === "settings" ? "none" : "settings")}
                    >
                      <Settings className={`h-4 w-4 ${activePanel === "settings" ? "text-primary" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings (Cmd+,)</TooltipContent>
                </Tooltip>
              </div>
            </header>

            <TabBar />

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-1 flex-col min-w-0 overflow-auto">
                {activeFilePath.endsWith(".pdf") ? (
                  <Suspense fallback={<div className="p-4 text-muted-foreground">Loading PDF viewer...</div>}>
                    <PdfViewer filePath={activeFilePath} />
                  </Suspense>
                ) : viewMode === "edit" ? (
                  <CodeEditor value={content} onChange={handleEditorChange} />
                ) : (
                  <div
                    className="prose prose-neutral dark:prose-invert max-w-none p-6 lg:p-10"
                    dangerouslySetInnerHTML={{ __html: htmlPreview }}
                  />
                )}
              </div>

              {activePanel === "graph" && (
                <div className="w-80 shrink-0 border-l border-border overflow-hidden">
                  <Suspense fallback={<div className="p-4 text-muted-foreground">Loading graph...</div>}>
                    <KnowledgeGraph />
                  </Suspense>
                </div>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
        <CommandMenu />
        <SettingsPanel />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
