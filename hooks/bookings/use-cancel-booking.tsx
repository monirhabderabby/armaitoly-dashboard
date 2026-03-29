import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CancelBookingResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string): Promise<CancelBookingResponse> => {
      const res = await fetch(`${baseUrl}/booking/${bookId}/cancel`, {
        method: "POST",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to cancel booking");
      }

      return res.json();
    },
    onSuccess: (_, bookId) => {
      // Refresh the bookings list
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Refresh the single booking cache so status reflects "Cancelled"
      queryClient.invalidateQueries({ queryKey: ["booking", bookId] });
    },
  });
}
