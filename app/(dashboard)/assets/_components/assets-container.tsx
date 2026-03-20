"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import RoomImageUploader from "./room-image-uploader";

const rooms = [
  { roomId: 1, name: "Living Room" },
  { roomId: 2, name: "Bedroom" },
  { roomId: 3, name: "Kitchen" },
  { roomId: 4, name: "Bathroom" },
  { roomId: 5, name: "Office" },
];

const initialRoomImages = [
  {
    roomId: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
        status: "used",
      },
      {
        url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400",
        status: "not-used",
      },
    ],
  },
  {
    roomId: 2,
    images: [
      {
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400",
        status: "used",
      },
      {
        url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
        status: "not-used",
      },
    ],
  },
  {
    roomId: 3,
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        status: "used",
      },
      {
        url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400",
        status: "not-used",
      },
    ],
  },
  {
    roomId: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400",
        status: "used",
      },
      {
        url: "https://images.unsplash.com/photo-1620626011761-996317702149?w=400",
        status: "not-used",
      },
    ],
  },
  {
    roomId: 5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
        status: "used",
      },
      {
        url: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=400",
        status: "not-used",
      },
    ],
  },
];

const AssetsContainer = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomImages, setRoomImages] = useState(initialRoomImages);

  const selectedRoom = rooms.find((r) => r.roomId === Number(selectedRoomId));
  const selectedRoomImages =
    roomImages.find((r) => r.roomId === Number(selectedRoomId))?.images ?? [];

  const handleDeleteImage = (url: string) => {
    setRoomImages((prev) =>
      prev.map((r) =>
        r.roomId === Number(selectedRoomId)
          ? { ...r, images: r.images.filter((img) => img.url !== url) }
          : r,
      ),
    );
  };

  return (
    // ✅ Outer flex: left content + right sticky panel
    <div className="flex gap-6 items-start">
      {/* LEFT: scrollable content area */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Assets</h1>
            {selectedRoom && (
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedRoomImages.length} image
                {selectedRoomImages.length !== 1 ? "s" : ""} in{" "}
                {selectedRoom.name}
              </p>
            )}
          </div>

          <Select onValueChange={(val) => setSelectedRoomId(val)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.roomId} value={String(room.roomId)}>
                  {room.name}
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
          </div>
        ) : (
          <div className="flex items-start gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
              {selectedRoomImages.map((img) => (
                <div
                  key={img.url}
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
                      variant={img.status === "used" ? "default" : "secondary"}
                      className={
                        img.status === "used"
                          ? "bg-emerald-500 hover:bg-emerald-500 text-white text-xs"
                          : "bg-gray-200 text-gray-600 text-xs"
                      }
                    >
                      {img.status === "used" ? "Used" : "Not Used"}
                    </Badge>
                  </div>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteImage(img.url)}
                    className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {selectedRoom && (
              <div className="w-100  shrink-0 sticky top-6 p-4 rounded-xl">
                <RoomImageUploader roomId={selectedRoomId} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: sticky upload panel — always visible regardless of selected room */}
    </div>
  );
};

export default AssetsContainer;
