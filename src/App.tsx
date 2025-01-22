import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Editor from "@monaco-editor/react";
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
  const [fileContent, setFileContent] = useState("");
  const [filePath, setFilePath] = useState("../test.md");

  useEffect(() => {
    invoke<string>("read_file", { path: filePath })
      .then((content) => {
        setFileContent(content);
      })
      .catch((error) => {
        console.error("Failed to read file:", error);
      });
  }, [filePath]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContent(value);
    }
  };

  const saveFile = () => {
    invoke<void>("save_file", { path: filePath, content: fileContent })
      .then(() => console.log("File saved successfully"))
      .catch((error) => console.error("Failed to save file:", error));
  };

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
            <button
              onClick={saveFile}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Editor
              height="90vh"
              defaultLanguage="markdown"
              value={fileContent}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: "on",
                roundedSelection: false,
                scrollbar: {
                  horizontalSliderSize: 4,
                  verticalSliderSize: 8,
                },
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
