"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
  existingUrl?: string; // used in edit mode to show current cover image
}

export function ThumbnailUploader({ value, onChange, existingUrl }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingRemoved, setExistingRemoved] = useState(false);

  // Priority: new file preview > existing URL (if not removed) > nothing
  const preview = value ? previewUrl : null;
  const showExisting = !value && !existingRemoved && existingUrl;
  const hasImage = !!preview || !!showExisting;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      onChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  function handleRemoveNew(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
  }

  function handleRemoveExisting(e: React.MouseEvent) {
    e.stopPropagation();
    setExistingRemoved(true);
  }

  return (
    <div
      {...getRootProps()}
      className={`relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
        isDragActive
          ? "border-[#23A4D2] bg-sky-50"
          : hasImage
            ? "border-gray-200"
            : "border-gray-200 bg-gray-50 hover:border-[#23A4D2] hover:bg-sky-50/40"
      }`}
    >
      <input {...getInputProps()} />

      {preview ? (
        // New file preview
        <>
          <Image
            src={preview}
            alt="Thumbnail preview"
            fill
            className="rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveNew}
            className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-red-50"
          >
            <X className="size-3.5 text-red-500" />
          </button>
        </>
      ) : showExisting ? (
        // Existing cover image from server
        <>
          <Image
            src={existingUrl!}
            alt="Current thumbnail"
            fill
            className="rounded-xl object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-xs font-medium text-white">Click to replace</p>
          </div>
          <button
            type="button"
            onClick={handleRemoveExisting}
            className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-red-50"
          >
            <X className="size-3.5 text-red-500" />
          </button>
        </>
      ) : (
        // Empty state
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-sky-100">
            <ImagePlus className="size-5 text-[#23A4D2]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? "Drop image here" : "Upload Thumbnail Photo"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Drag & drop or click — PNG, JPG, JPEG, WEBP
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
