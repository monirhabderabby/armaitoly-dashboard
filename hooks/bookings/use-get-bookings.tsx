import { baseUrl } from "@/constants";
import { BookingResponse } from "@/types/booking";
import { useQuery } from "@tanstack/react-query";

interface UseGetBookingsOptions {
  token: string;
  page?: number;
  limit?: number;
}

export function useGetBookings({
  token,
  page = 1,
  limit = 10,
}: UseGetBookingsOptions) {
  return useQuery({
    queryKey: ["bookings", page, limit],
    queryFn: async (): Promise<BookingResponse> => {
      const res = await fetch(
        `${baseUrl}/booking?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch bookings");
      }

      return res.json();
    },
    enabled: !!token,
  });
}
