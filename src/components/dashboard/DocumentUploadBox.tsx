"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DocumentUploadBoxProps {
  onFileSelect?: (file: File) => void;
}

export function DocumentUploadBox({ onFileSelect }: DocumentUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect?.(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect?.(file);
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center text-center",
        "border-2 border-dashed rounded-[16px] px-8 py-14",
        "transition-all duration-200 ease-out",
        dragging
          ? "border-foreground bg-muted scale-[1.01]"
          : "border-border hover:border-foreground-muted"
      )}
    >
      <div className="mb-4 p-4 rounded-full bg-muted">
        {dragging ? (
          <FileText size={22} className="text-foreground" strokeWidth={1.5} />
        ) : (
          <Upload size={22} className="text-foreground-muted" strokeWidth={1.5} />
        )}
      </div>
      <p className="text-[16px] font-serif font-medium text-foreground mb-1.5">
        {dragging ? "Suelta el PDF aquí" : "Suelta un PDF para comenzar"}
      </p>
      <p className="text-[13px] text-foreground-muted font-sans mb-6 max-w-xs leading-relaxed">
        PDF de hasta 20 MB. Extraemos el texto y preparamos tus herramientas de
        estudio.
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        Elegir archivo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Seleccionar archivo PDF"
      />
    </div>
  );
}
