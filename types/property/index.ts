export interface VillaPrice {
  amount: number;
  currency: string;
  per: string;
}

export interface VillaCapacity {
  baseGuests: number;
  extraGuestFee: number;
  currency: string;
}

export interface VillaMinimumStay {
  months: string;
  nights: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Villa {
  roomId: string;
  name: string;
  locationType: string;
  location: string;
  price: VillaPrice;
  capacity: VillaCapacity;
  minimumStay: VillaMinimumStay[];
  bedroom: string[];
  bathroom: string[];
  description: string;
  amenities: string[];
  internet: string[];
  kitchen: string[];
  locationFeatures: string[];
  pets: string[];
  poolAndWellness: string[];
  services?: string[]; // optional — not present on all villas
  offers: string[];
  cleaningFee: number;
  securityDeposit: number;
  taxPercent: number;
  images: string[];
}

export interface VillaByFilterResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Villa[];
}
