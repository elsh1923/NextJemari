"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  type?: "avatar" | "cover" | "general";
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = "nextjemari",
  type = "general",
  maxSize = 10,
  className = "",
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.data.url);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setPreview(value || null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    setError(null);
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        {preview ? (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-[#1A1A1C]">
              <img
                src={preview}
                alt="Preview"
                className={`h-full w-full object-cover ${
                  type === "avatar" ? "aspect-square" : "aspect-video"
                }`}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-500 hover:bg-slate-100 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:hover:border-blue-500 dark:hover:bg-[#1A1A1C] ${
              disabled ? "cursor-not-allowed opacity-50" : ""
            } ${uploading ? "opacity-50" : ""}`}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-slate-400" />
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {uploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Max size: {maxSize}MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        {!preview && !uploading && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Button>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

