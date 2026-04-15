import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "../stores/ui-store";

describe("ui-store", () => {
  beforeEach(() => {
    useUIStore.setState({
      isSidebarOpen: true,
      isCommandPaletteOpen: false,
      activePanel: "none",
    });
  });

  it("should toggle sidebar", () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it("should set command palette state", () => {
    useUIStore.getState().setCommandPaletteOpen(true);
    expect(useUIStore.getState().isCommandPaletteOpen).toBe(true);
  });
});
