import { baseUrl } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface RoomImage {
  _id: string;
  url: string;
  isActive: boolean;
}

export interface GalleryItem {
  _id: string;
  roomId: number;
  roomName: string;
  images: RoomImage[];
  isActive: boolean;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  __v: number;
}

export interface GalleryResponse {
  data: GalleryItem[];
  total?: number;
  page?: number;
  limit?: number;
}

export function useGetAllGallery() {
  return useQuery<GalleryResponse>({
    queryKey: ["all-gallery"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/gallary?page=1&limit=25`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch gallery");
      }

      return res.json();
    },
  });
}
