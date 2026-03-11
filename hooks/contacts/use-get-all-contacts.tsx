import { baseUrl } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ContactsResponse {
  data: Contact[];
  meta: ContactMeta;
}

const fetchAllContacts = async (
  accessToken: string,
  page: number,
  limit: number,
): Promise<ContactsResponse> => {
  const res = await fetch(`${baseUrl}/contact?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch contacts");
  const json = await res.json();
  return {
    data: json.data,
    meta: json.meta,
  };
};

export const useGetAllContacts = (
  accessToken: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ["contacts", accessToken, page, limit],
    queryFn: () => fetchAllContacts(accessToken, page, limit),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev, // keeps previous page data while fetching next
  });
};
