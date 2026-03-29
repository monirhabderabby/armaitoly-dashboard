import { baseUrl } from "@/constants";
import { useQuery } from "@tanstack/react-query";

interface Guest {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  company: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  arrivalTime: string;
  comments: string;
  voucher: string;
}

interface Payment {
  price: number;
  deposit: number;
  tax: number;
  commission: number;
  currency: string;
}

interface Booking {
  bookId: string;
  roomId: string;
  propId: string;
  status: string;
  statusLabel: string;
  substatus: string;
  substatusLabel: string;
  firstNight: string;
  lastNight: string;
  nights: number;
  numAdult: number;
  numChild: number;
  guest: Guest;
  payment: Payment;
  rateDescription: string;
  offerId: string;
  referer: string;
  flagColor: string;
  flagText: string;
  stripeToken: string;
  bookingTime: string;
  modified: string;
  cancelTime: string;
  notes: string;
}

interface SingleBookingResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Booking;
}

export function useGetSingleBooking(bookId: string) {
  return useQuery({
    queryKey: ["booking", bookId],
    queryFn: async (): Promise<SingleBookingResponse> => {
      const res = await fetch(`${baseUrl}/booking/${bookId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch booking");
      }

      return res.json();
    },
    enabled: !!bookId,
  });
}
