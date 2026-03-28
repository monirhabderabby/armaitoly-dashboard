import { baseUrl } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface EarningsEntry {
  label: string;
  revenue: number;
}

export interface BookingEntry {
  label: string;
  count: number;
}

export interface EarningsOverview {
  weekly: EarningsEntry[];
  monthly: EarningsEntry[];
}

export interface BookingOverview {
  weekly: BookingEntry[];
  monthly: BookingEntry[];
}

export interface DashboardData {
  totalBookings: number;
  totalRevenue: number;
  currency: string;
  earningsOverview: EarningsOverview;
  bookingOverview: BookingOverview;
}

export interface DashboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardData;
}

export function useGetDashboardInfo() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard-info"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/dashboard`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch dashboard info");
      }

      return res.json();
    },
  });
}
