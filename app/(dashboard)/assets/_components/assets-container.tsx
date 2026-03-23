"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/ui/custom/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteGalleryImage } from "@/hooks/gallery/use-delete-gallery-image";
import { useGetAllGallery } from "@/hooks/gallery/use-get-all-gallery";

import { useGetRoomIdName } from "@/hooks/gallery/use-get-room-id-name";
import { ImageIcon, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import RoomImageUploader from "./room-image-uploader";

const AssetsContainer = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    roomId: string;
    imageId: string;
  } | null>(null);

  const { data, isLoading, isError } = useGetAllGallery();
  const { data: rooms, isLoading: isRoomsLoading } = useGetRoomIdName();
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteGalleryImage();

  const galleryRooms = data?.data ?? [];
  const selectedRoom = galleryRooms.find(
    (r) => r.roomId === Number(selectedRoomId),
  );
  const selectedRoomImages = selectedRoom?.images ?? [];

  const selectedRoomMeta = rooms?.find(
    (r) => r.roomId === Number(selectedRoomId),
  );

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteImage(
      { roomId: deleteTarget.roomId, imageId: deleteTarget.imageId },
      { onSuccess: () => setDeleteTarget(null) },
    );
  };

  if (isLoading || isRoomsLoading) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <p className="text-sm">Loading gallery...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-red-400 gap-3">
        <ImageIcon className="w-10 h-10 opacity-30" />
        <p className="text-sm">Failed to load gallery. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Image?"
        message="Are you sure you want to delete this image? This action cannot be undone."
      />

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Assets</h1>
              {selectedRoom && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedRoomImages.length} image
                  {selectedRoomImages.length !== 1 ? "s" : ""} in{" "}
                  {selectedRoom.roomName}
                </p>
              )}
            </div>

            <Select onValueChange={(val) => setSelectedRoomId(val)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms?.map((room) => (
                  <SelectItem key={room.roomId} value={String(room.roomId)}>
                    {room.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {!selectedRoomId ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400 gap-3">
              <ImageIcon className="w-10 h-10 opacity-30" />
              <p className="text-sm">Select a room to view its images</p>
            </div>
          ) : selectedRoomImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400 gap-3">
              <ImageIcon className="w-10 h-10 opacity-30" />
              <p className="text-sm">No images found for this room</p>

              {selectedRoomMeta && (
                <div className="relative top-70">
                  <RoomImageUploader
                    roomId={selectedRoomMeta.roomId.toString()}
                    roomName={selectedRoomMeta.roomName}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
                {selectedRoomImages.map((img) => (
                  <div
                    key={img._id}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={img.url}
                        alt="Room"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>

                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={img.isActive ? "default" : "secondary"}
                        className={
                          img.isActive
                            ? "bg-emerald-500 hover:bg-emerald-500 text-white text-xs"
                            : "bg-gray-200 text-gray-600 text-xs"
                        }
                      >
                        {img.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        setDeleteTarget({
                          roomId: String(selectedRoom?.roomId),
                          imageId: img._id,
                        })
                      }
                      className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {selectedRoomMeta && (
                <div className="w-100 shrink-0 sticky top-6 p-4 rounded-xl">
                  <RoomImageUploader
                    roomId={selectedRoomMeta.roomId.toString()}
                    roomName={selectedRoomMeta.roomName}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetsContainer;
