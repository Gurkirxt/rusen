import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./input.css";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function App() {

  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    // Replace with the path to your markdown file
    const filePath = "/home/guri/Projects/note-taking-app/rusen/test.md";

    invoke<string>("render_markdown", { filePath }) // Explicitly specify the return type as string
      .then((html) => {
        setMarkdownContent(html); // Now TypeScript knows `html` is a string
      })
      .catch((error) => {
        console.error("Failed to render markdown:", error);
      });
  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">ui</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>test.md</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div
              className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4"
              dangerouslySetInnerHTML={{ __html: markdownContent }}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
