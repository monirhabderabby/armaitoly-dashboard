import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteBookingResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string): Promise<DeleteBookingResponse> => {
      const res = await fetch(`${baseUrl}/booking/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to delete booking");
      }

      return res.json();
    },
    onSuccess: (_, bookId) => {
      // Invalidate the bookings list so the table refreshes
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Remove the cached single booking entry
      queryClient.removeQueries({ queryKey: ["booking", bookId] });
    },
  });
}
