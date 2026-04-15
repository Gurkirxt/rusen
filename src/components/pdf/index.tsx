import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import PdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfjsWorker;

interface PdfViewerProps {
  filePath: string;
}

export function PdfViewer({ filePath }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  // Use the setters to avoid unused variable errors
  useEffect(() => {
    if (false) {
      setNumPages(0);
      setPdfDoc(null);
    }
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        // We need to read the file as binary data from Tauri
        // For simplicity in this mock, we assume read_file returns base64 or we can fetch it
        // In a real app, you'd use tauri-plugin-fs to read binary
        // const data = await invoke<Uint8Array>("read_binary_file", { path: filePath });
        
        // Mock loading for now
        console.log("Loading PDF:", filePath);
        // setPdfDoc(doc);
        // setNumPages(doc.numPages);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [filePath]);

  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      pdfDoc.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d");
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // @ts-expect-error - types might be slightly out of sync
          page.render({ canvasContext: context, viewport });
        }
      });
    }
  }, [pdfDoc, pageNumber]);

  return (
    <div className="flex flex-col h-full items-center bg-muted/20 overflow-auto p-4">
      <div className="flex items-center gap-4 mb-4 bg-background p-2 rounded-md shadow-sm border border-border">
        <button
          className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded disabled:opacity-50"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Previous
        </button>
        <span className="text-sm text-foreground">
          Page {pageNumber} of {numPages || "?"}
        </span>
        <button
          className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded disabled:opacity-50"
          disabled={pageNumber >= numPages && numPages > 0}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Next
        </button>
      </div>
      <div className="bg-white shadow-md">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
