import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AddGalleryPayload {
  roomId: number;
  roomName: string;
  images: string[];
}

export function useAddGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddGalleryPayload) => {
      const res = await fetch(`${baseUrl}/gallary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to add gallery");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-gallery"] });
    },
  });
}
