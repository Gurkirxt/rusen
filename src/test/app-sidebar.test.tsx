import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppSidebar } from "../components/sidebar";
import { SidebarProvider } from "../components/ui/sidebar";

describe("AppSidebar", () => {
  it("renders directory tree correctly", () => {
    const mockTree = [
      "file1.md",
      ["folder1", "file2.md"],
    ];
    
    const onFileClick = vi.fn();

    render(
      <SidebarProvider>
        <AppSidebar
          directoryTree={mockTree}
          directoryPath="/test"
          onFileClick={onFileClick}
        />
      </SidebarProvider>
    );

    expect(screen.getByText("file1.md")).toBeInTheDocument();
    expect(screen.getByText("folder1")).toBeInTheDocument();
    
    // Click on file1.md
    fireEvent.click(screen.getByText("file1.md"));
    expect(onFileClick).toHaveBeenCalledWith("/test/file1.md");
  });
});
