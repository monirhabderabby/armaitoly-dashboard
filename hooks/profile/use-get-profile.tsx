import { baseUrl } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  phone?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchProfile = async (accessToken: string): Promise<UserProfile> => {
  const res = await fetch(`${baseUrl}/user/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  return json.data;
};

export const useGetProfile = (accessToken: string) => {
  return useQuery({
    queryKey: ["profile", accessToken],
    queryFn: () => fetchProfile(accessToken),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
