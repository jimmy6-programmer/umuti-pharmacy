"use client";

import { useRef, useState, useCallback } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  id?: string;
  accept?: string;
  onFileSelect?: (file: File) => void;
  onDataParsed?: (data: Record<string, string>[]) => void;
  label?: string;
  error?: string;
}

export function FileUpload({
  id,
  accept = ".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png",
  onFileSelect,
  onDataParsed,
  label = "Upload Document",
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const parseFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            onDataParsed?.(results.data as Record<string, string>[]);
          } else {
            toast.error("No data found in CSV file");
          }
        },
        error: (err) => {
          toast.error(`Failed to parse CSV: ${err.message}`);
        }
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const wb = XLSX.read(evt.target?.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
          if (data && data.length > 0) {
            onDataParsed?.(data);
          } else {
            toast.error("No data found in Excel file");
          }
        } catch (err) {
          toast.error("Failed to parse Excel file");
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsBinaryString(file);
    } else if (onFileSelect) {
      // For non-CSV/Excel files (PDF, images), just pass the file
      onFileSelect(file);
    }
  }, [onFileSelect, onDataParsed]);

  const handleFileSelect = useCallback(
    (file: File) => {
      setFileName(file.name);
      parseFile(file);
      if (onFileSelect) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
          onFileSelect(file);
        }
      }
      toast.success(`${file.name} selected successfully`);
    },
    [parseFile, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    setFileName(null);
    onFileSelect(null as any);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onFileSelect]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragging
          ? "border-primary bg-primary/5"
          : fileName
          ? "border-green-500 bg-green-50"
          : "border-border hover:border-primary/50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {!fileName ? (
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-muted">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag & drop or click to upload
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
              <span className="text-xs text-muted-foreground">CSV, Excel, PDF, JPG, PNG</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-green-100">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-600">File Selected</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
              {fileName}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Change
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-3">{error}</p>
      )}
    </div>
  );
}
