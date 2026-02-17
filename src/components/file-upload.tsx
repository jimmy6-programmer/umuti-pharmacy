"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface FileUploadProps {
  onDataParsed: (data: Record<string, string>[]) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({
  onDataParsed,
  accept = ".csv,.xlsx,.xls,.pdf",
  label = "Upload Stock File",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const parseFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            onDataParsed(results.data as Record<string, string>[]);
            toast.success(`Parsed ${results.data.length} rows from CSV`);
          },
          error: () => toast.error("Failed to parse CSV file"),
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
          onDataParsed(json);
          toast.success(`Parsed ${json.length} rows from spreadsheet`);
        };
        reader.readAsArrayBuffer(file);
      } else if (ext === "pdf") {
        toast.info("PDF parsing simulated - in production, use a PDF parsing service");
        onDataParsed([
          { name: "Sample Med 1", currentStock: "10", minThreshold: "50", unit: "tablets" },
          { name: "Sample Med 2", currentStock: "0", minThreshold: "30", unit: "capsules" },
        ]);
      } else {
        toast.error("Unsupported file format");
      }
    },
    [onDataParsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) parseFile(file);
    },
    [parseFile]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragging
          ? "border-primary bg-primary/5"
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
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) parseFile(file);
        }}
      />
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
            <span className="text-xs text-muted-foreground">CSV, XLSX</span>
            <FileText className="w-3 h-3 text-red-600 ml-2" />
            <span className="text-xs text-muted-foreground">PDF</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        {fileName && (
          <p className="text-xs text-emerald-600 font-medium">
            Loaded: {fileName}
          </p>
        )}
      </div>
    </div>
  );
}
