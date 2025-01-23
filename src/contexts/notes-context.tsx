import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export type Note = {
  path: string;
  content: string;
};

type FileEntry = {
  name: string;
  path: string;
  is_dir: boolean;
  children: FileEntry[];
};

type NotesContextType = {
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  fileTree: FileEntry[];
  loadFileTree: () => void;
};

const NotesContext = createContext<NotesContextType>({
  currentNote: null,
  setCurrentNote: () => { },
  fileTree: [],
  loadFileTree: () => { },
});

export function NotesProvider({ children }: { children: ReactNode }) {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [fileTree, setFileTree] = useState<FileEntry[]>([]);

  const loadFileTree = async () => {
    try {
      // Update this path to your notes directory
      const tree = await invoke<FileEntry>("get_file_tree", {
        path: "/path/to/your/notes"
      });
      setFileTree([tree]);
    } catch (error) {
      console.error("Failed to load file tree:", error);
    }
  };

  return (
    <NotesContext.Provider
      value={{ currentNote, setCurrentNote, fileTree, loadFileTree }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
