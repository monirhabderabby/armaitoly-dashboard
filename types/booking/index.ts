export interface Booking {
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

export interface Guest {
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

export interface Payment {
  price: number;
  deposit: number;
  tax: number;
  commission: number;
  currency: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BookingResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Booking[];
}
