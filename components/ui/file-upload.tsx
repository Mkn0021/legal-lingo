"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { FileScanIcon, X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "./button";

export const FileUpload = forwardRef(({
  onChange,
  title = "Upload file",
  description = "Drag or drop your files here or click to upload",
  isLoading = false,
  onFinalize,
}: {
  onChange?: (files: File[]) => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onFinalize?: (files: File[]) => void;
}, ref) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    loadFile: (file: File) => {
      setUploading(true);
      setTimeout(() => {
        setFiles([file]);
        onChange && onChange([file]);
        setUploading(false);
      }, 500);
    },
  }));

  const handleFileChange = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length > 0) {
      setUploading(true);
      // Simulate upload delay for better UX
      setTimeout(() => {
        setFiles([pdfFiles[0]]);
        onChange && onChange([pdfFiles[0]]);
        setUploading(false);
      }, 500);
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    onChange && onChange([]);
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div
        onClick={uploading || isLoading ? undefined : handleClick}
        className={cn("group/file relative block w-full cursor-pointer overflow-hidden bg-white rounded-2xl shadow-xl ring-1 ring-black/10 p-2", (uploading || isLoading) && "opacity-60 cursor-not-allowed")}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={uploading || isLoading}
        />
        <div className="flex flex-col items-center text-center text-balance justify-center rounded-[calc(var(--radius-2xl)-8px)] shadow-xs ring-1 ring-black/5 px-4 py-8 md:px-10 lg:py-12 lg:px-20">
          <p className="relative z-20 font-sans text-2xl md:text-3xl lg:text-4xl tracking-tight font-semibold text-neutral-700 dark:text-neutral-300">
            {title}
          </p>
          <p className="relative z-20 my-4 font-sans text-sm md:text-base lg:text-lg font-normal text-neutral-400 dark:text-neutral-400">
            {description}
          </p>
          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {files.length > 0 &&
              files.map((file, idx) => (
                <div
                  key={"file" + idx}
                  className={cn(
                    "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4  md:h-24 dark:bg-neutral-900",
                    "shadow-sm",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <p className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white"
                      >
                        {file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(2)} KB`
                          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        title="Remove file"
                      >
                        <X className="size-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
                    <p
                      className="rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800"
                    >
                      {file.type}
                    </p>

                    <p
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            {files.length > 0 && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onFinalize?.(files);
                }}
                className="relative z-40 mx-auto py-3 px-4 mt-6"
                disabled={uploading || isLoading}
              >
                Process Document
              </Button>
            )}
            {!files.length && (
              <div
                className={cn(
                  "relative z-40 mx-auto mt-4 flex h-32 md:h-48 w-full max-w-64 items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)] translate-x-5 -translate-y-5 translate-z-5 border border-neutral-100",
                )}
              >
                {uploading || isLoading ? (
                  <div className="flex flex-col items-center text-neutral-600">
                    <Loader2 className="size-16 text-neutral-500 dark:text-neutral-700 animate-spin" />
                    <p className="mt-2 text-sm text-neutral-500">Processing...</p>
                  </div>
                ) : isDragActive ? (
                  <p className="flex flex-col items-center text-neutral-600">
                    Drop it
                    <FileScanIcon className="size-16 text-neutral-500 dark:text-neutral-700" />
                  </p>
                ) : (
                  <FileScanIcon className="size-16 text-neutral-500 text-shadow-lg dark:text-neutral-700" />
                )}
              </div>
            )}

            {!files.length && (
              <div
                className={cn("absolute inset-0 z-30 mx-auto mt-4 flex h-32 md:h-48 w-full max-w-64 items-center justify-center rounded-md border border-neutral-300",
                  "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-fg:var(--color-neutral-300)]",
                )}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export function GridPattern({ className }: { className?: string }) {
  const columns = 48;
  const rows = 11;
  return (
    <div className={cn("flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900", className)}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-xs ${index % 2 === 0
                ? "bg-gray-50 dark:bg-neutral-950"
                : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                }`}
            />
          );
        }),
      )}
    </div>
  );
}
