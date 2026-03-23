import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      imageId,
    }: {
      roomId: string;
      imageId: string;
    }) => {
      const res = await fetch(
        `${baseUrl}/gallary/${roomId}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to delete image");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-gallery"] });
    },
  });
}
