"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ToggleGalleryImageResponse,
  useUpdateGalleryImageAlt,
} from "@/hooks/gallery/use-update-gallery-image-alt";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
  _id: string;
  url: string;
  alt?: string;
  isActive: boolean;
}

interface ImageCardProps {
  img: GalleryImage;
  roomId: string;
  onDeleteClick: (imageId: string) => void;
}

const ImageCard = ({ img, roomId, onDeleteClick }: ImageCardProps) => {
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [altValue, setAltValue] = useState(img.alt ?? "");
  const [isActive, setIsActive] = useState(img.isActive);

  const { mutate: updateAlt, isPending: isUpdatingAlt } =
    useUpdateGalleryImageAlt();
  const { mutate: toggleImage, isPending: isToggling } =
    useUpdateGalleryImageAlt();

  const handleSaveAlt = () => {
    updateAlt(
      { imageId: img._id, roomId, payload: { alt: altValue } },
      { onSuccess: () => setIsEditingAlt(false) },
    );
  };

  const handleCancelAlt = () => {
    setAltValue(img.alt ?? "");
    setIsEditingAlt(false);
  };

  const handleToggle = () => {
    toggleImage(
      { roomId, imageId: img._id, payload: { isActive: !isActive } },
      {
        onSuccess: (data: ToggleGalleryImageResponse) =>
          setIsActive(data.isActive),
      },
    );
  };

  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={img.url}
          alt={altValue || "Room image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      {/* Active badge — clickable toggle */}
      <div className="absolute top-2 left-2">
        <button onClick={handleToggle} disabled={isToggling}>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive
                ? "bg-emerald-500 hover:bg-emerald-600 text-white text-xs cursor-pointer transition-colors"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs cursor-pointer transition-colors"
            }
          >
            {isToggling ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : isActive ? (
              "Active"
            ) : (
              "Inactive"
            )}
          </Badge>
        </button>
      </div>

      {/* Delete button */}
      <Button
        size="icon"
        variant="destructive"
        onClick={() => onDeleteClick(img._id)}
        className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>

      {/* Alt text section */}
      <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50">
        {isEditingAlt ? (
          <div className="flex items-center gap-1.5">
            <Input
              value={altValue}
              onChange={(e) => setAltValue(e.target.value)}
              placeholder="Enter alt text..."
              className="h-7 text-xs flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAlt();
                if (e.key === "Escape") handleCancelAlt();
              }}
              disabled={isUpdatingAlt}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSaveAlt}
              disabled={isUpdatingAlt}
              className="w-6 h-6 shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              {isUpdatingAlt ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancelAlt}
              disabled={isUpdatingAlt}
              className="w-6 h-6 shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingAlt(true)}
            className="flex items-center gap-1.5 w-full text-left group/alt"
          >
            <Pencil className="w-3 h-3 text-gray-400 shrink-0 group-hover/alt:text-gray-600 transition-colors" />
            <span className="text-xs text-gray-500 truncate group-hover/alt:text-gray-700 transition-colors">
              {altValue || (
                <span className="italic text-gray-400">Add alt text...</span>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
