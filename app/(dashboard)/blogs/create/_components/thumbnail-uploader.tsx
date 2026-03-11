"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
}

export function ThumbnailUploader({ value, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Derive display state from RHF value — no useEffect needed
  // When form.reset() clears value to undefined/null, preview disappears automatically
  const preview = value ? previewUrl : null;

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

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
  }

  return (
    <div
      {...getRootProps()}
      className={`relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
        isDragActive
          ? "border-[#23A4D2] bg-sky-50"
          : "border-gray-200 bg-gray-50 hover:border-[#23A4D2] hover:bg-sky-50/40"
      }`}
    >
      <input {...getInputProps()} />

      {preview ? (
        <>
          <Image
            src={preview}
            alt="Thumbnail preview"
            fill
            className="rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-red-50"
          >
            <X className="size-3.5 text-red-500" />
          </button>
        </>
      ) : (
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
