"use client";

import React, { useState, useRef } from "react";
import { FileText, X, FileUp, AlertCircle } from "lucide-react";

interface AddAttachmentProps {
  notes: string;
  setNotes: (notes: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
}

// Asetetaan rajaksi tasan 250 KB tavuina
const MAX_FILE_SIZE = 250 * 1024; 

export default function AddAttachment({
  notes,
  setNotes,
  file,
  setFile,
}: AddAttachmentProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Tarkistetaan alittaako tiedosto 250 KB rajan
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Tiedosto on liian suuri. Sallittu maksimikoko on 250KB.");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full flex flex-col gap-5">
      
      {/* LIITTEIDEN LATAUSKENTTÄ */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Hakemus tai muu liite
        </label>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
        />

        {!file ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`w-full rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              isDragActive
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                : error 
                  ? "border-red-300 dark:border-red-900/50 bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/10 dark:hover:bg-red-950/20"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800/30 dark:hover:bg-slate-800/50 dark:hover:border-slate-600"
            }`}
          >
            <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border ${error ? "border-red-100 dark:border-red-900/50 text-red-500" : "border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500"}`}>
              <FileUp size={22} className={isDragActive ? "text-indigo-500" : ""} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Klikkaa ladataksesi tai raahaa tiedosto tähän
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                PDF, DOCX, PNG tai JPG (Max 250KB)
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={removeFile}
              className="p-1.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Poista liite"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* VIRHEILMOITUS */}
        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 mt-1">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

    </div>
  );
}