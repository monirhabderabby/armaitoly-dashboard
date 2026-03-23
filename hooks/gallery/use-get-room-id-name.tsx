import { baseUrl } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface RoomIdName {
  roomId: number;
  roomName: string;
}

export function useGetRoomIdName() {
  return useQuery({
    queryKey: ["room-id-name"],
    queryFn: async (): Promise<RoomIdName[]> => {
      const res = await fetch(`${baseUrl}/property/property-room-names`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch room names");
      }

      const json = await res.json();
      return json.data;
    },
  });
}
