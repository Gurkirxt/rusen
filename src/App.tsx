import { Fragment, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import DOMPurify from "dompurify";
import "./input.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import CodeEditor from "./components/editor";
import { open } from "@tauri-apps/plugin-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function App() {
  const [fileContent, setFileContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const [dirPath, setDirPath] = useState("");
  const [directoryTree, setDirectoryTree] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("");

  useEffect(() => {
    invoke<any[]>("get_directory_tree", { path: dirPath })
      .then((tree) => {
        setDirectoryTree(tree);
      })
      .catch(console.error);
  }, [dirPath]);

  useEffect(() => {
    if (filePath) {
      console.log(filePath);
      invoke<string>("read_file", { path: filePath })
        .then(setFileContent)
        .catch(console.error);
    }
  }, [filePath]);

  useEffect(() => {
    if (!editMode && fileContent) {
      invoke<string>("markdown_to_html", { md: fileContent })
        .then((parsedHtml) => {
          console.log(parsedHtml);
          const sanitizedHtml = DOMPurify.sanitize(parsedHtml);
          setHtmlPreview(sanitizedHtml);
        })
        .catch(console.error);
    }
  }, [editMode, fileContent]);

  const handleFileClick = (path: string) => {
    setFilePath(path);
  };

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

  const fileopen = async () => {
    try {
      const path: string =
        (await open({
          multiple: false,
          directory: true,
          defaultPath: dirPath,
        })) ?? "";
      setDirPath(path);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar
            directoryTree={directoryTree}
            directoryPath={dirPath}
            onFileClick={handleFileClick}
          />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {filePath.split("/").map((part, index, parts) => {
                    if (dirPath.includes(part)) {
                      return null;
                    }

                    return (
                      <Fragment key={index}>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">{part}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < parts.length - 1 && <BreadcrumbSeparator />}
                      </Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <button
                  onClick={saveFile}
                  className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <Button onClick={fileopen}>OPEN</Button>
                <ModeToggle></ModeToggle>
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(checked) => setEditMode(checked)}
                    id="edit-mode"
                  />
                  <Label htmlFor="edit-mode">Edit Mode</Label>
                </div>
              </div>
            </header>
            <div className="flex flex-1 flex-col align-middle items-left">
              {editMode ? (
                <CodeEditor value={fileContent} onChange={handleEditorChange} />
              ) : (
                <div
                  className="prose-xl prose-neutral gap-4 p-4"
                  dangerouslySetInnerHTML={{ __html: htmlPreview }}
                ></div>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
