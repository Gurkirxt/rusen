import { X } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

export function TabBar() {
  const { openTabs, activeFilePath, setActiveFilePath, closeTab, isDirty } = useEditorStore();

  if (openTabs.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="flex items-center gap-0 border-b border-border bg-muted/30 overflow-x-auto shrink-0"
    >
      {openTabs.map((tab) => {
        const name = tab.split("/").pop() ?? tab;
        const isActive = tab === activeFilePath;
        return (
          <div
            key={tab}
            role="tab"
            aria-selected={isActive}
            aria-label={`${name}${isActive && isDirty ? " (unsaved)" : ""}`}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              "group flex items-center gap-1 px-3 py-1.5 text-sm border-r border-border cursor-pointer shrink-0 select-none transition-colors",
              isActive
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
            onClick={() => setActiveFilePath(tab)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveFilePath(tab);
            }}
          >
            <span className="max-w-[120px] truncate">{name}</span>
            {isActive && isDirty && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
            )}
            <button
              aria-label={`Close ${name}`}
              className="h-4 w-4 shrink-0 rounded opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
