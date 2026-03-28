"use client";

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
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import ImageCard from "./image-card";
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
                  <ImageCard
                    key={img._id}
                    img={img}
                    roomId={String(selectedRoom?.roomId)}
                    onDeleteClick={(imageId) =>
                      setDeleteTarget({
                        roomId: String(selectedRoom?.roomId),
                        imageId,
                      })
                    }
                  />
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
