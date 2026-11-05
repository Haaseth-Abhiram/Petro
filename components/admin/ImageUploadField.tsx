"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  ImageIcon,
  X,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Image",
  hint = "Upload from device (PNG, JPG, WEBP up to 10MB) or enter an image URL.",
  className = "",
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose a valid image file (PNG, JPG, WEBP, SVG, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setPreviewError(false);

    // Instant local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to upload image.");
      }

      // Update with permanent server URL
      onChange(json.url);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Could not upload image from device.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const hasImage = Boolean(value && value.trim());

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header with Mode Switch */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#17191C]">
          {label}
        </label>
        <div className="flex items-center rounded-lg bg-[#F5F6F7] p-0.5 text-[11px] font-semibold text-[#5F6871]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-md px-2.5 py-1 transition-all ${
              mode === "upload"
                ? "bg-white text-[#17191C] shadow-sm font-bold"
                : "hover:text-[#17191C]"
            }`}
          >
            Upload Device
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-md px-2.5 py-1 transition-all ${
              mode === "url"
                ? "bg-white text-[#17191C] shadow-sm font-bold"
                : "hover:text-[#17191C]"
            }`}
          >
            Enter URL
          </button>
        </div>
      </div>

      {/* Main Upload / Preview Area */}
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] items-start">
        {/* Preview Thumbnail Box */}
        <div className="relative group w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl border-2 border-dashed border-[#D8DDE2] bg-[#FAFBFB] overflow-hidden flex items-center justify-center">
          {hasImage && !previewError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setPreviewError(true)}
              />
              {/* Overlay with Clear Button */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/90 text-[#17191C] hover:bg-white transition-colors"
                  title="View full image"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center p-3 text-[#929DA7]">
              <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
              <span className="text-[10px] font-semibold block leading-tight">
                {previewError ? "Broken Image" : "No Preview"}
              </span>
            </div>
          )}

          {/* Uploading Spinner Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin text-[#F2B93B] mb-1" />
              <span className="text-[10px] font-bold">Uploading…</span>
            </div>
          )}
        </div>

        {/* Action Controls Area */}
        <div className="flex-1 space-y-2">
          {mode === "upload" ? (
            <div>
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {/* Drag & Drop Zone Button */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                  dragActive
                    ? "border-[#C80808] bg-[#FFF1EF]"
                    : "border-[#D8DDE2] bg-white hover:border-[#17191C] hover:bg-[#F5F6F7]/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F6F7] text-[#17191C]">
                    <UploadCloud className="h-5 w-5" />
                  </span>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-[#17191C]">
                      Choose an image from your device
                    </p>
                    <p className="text-[11px] text-[#71717A]">
                      Click to browse or drag & drop (JPG, PNG, WEBP up to 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929DA7]" />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setPreviewError(false);
                    onChange(e.target.value);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D8DDE2] bg-white text-[13px] text-[#17191C] placeholder:text-[#929DA7] focus:border-[#C80808] focus:outline-none transition-colors"
                  placeholder="https://… or /assets/img/…"
                />
              </div>
              <p className="text-[11px] text-[#929DA7]">
                Paste any web image URL or path within <code className="text-[#17191C]">/assets/img/</code>
              </p>
            </div>
          )}

          {/* Current URL indicator if uploaded */}
          {hasImage && (
            <div className="flex items-center gap-2 text-[11px] text-[#5F6871] bg-[#F5F6F7] px-3 py-1.5 rounded-xl truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-mono">{value}</span>
              <button
                type="button"
                onClick={() => onChange("")}
                className="ml-auto text-xs text-rose-600 hover:underline font-bold shrink-0"
              >
                Remove
              </button>
            </div>
          )}

          {/* Error message */}
          {uploadError && (
            <div className="flex items-center gap-1.5 text-[11.5px] text-rose-600 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <p className="text-[11px] text-[#929DA7] leading-relaxed">{hint}</p>
        </div>
      </div>
    </div>
  );
}
