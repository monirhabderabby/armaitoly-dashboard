import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateImageAltPayload {
  alt?: string;
  isActive?: boolean;
}

export interface ToggleGalleryImageResponse {
  url: string;
  isActive: boolean;
  _id: string;
  alt: string;
}

export function useUpdateGalleryImageAlt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageId,
      payload,
      roomId,
    }: {
      imageId: string;
      roomId: string;
      payload: UpdateImageAltPayload;
    }) => {
      const res = await fetch(
        `${baseUrl}/gallary/${roomId}/images/${imageId}/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to update image alt text");
      }

      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-gallery"] });
    },
  });
}
