import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "./use-get-profile";

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
}

interface UpdateProfileArgs {
  data: UpdateProfilePayload;
  profileImage?: File;
}

const updateProfileRequest = async (
  accessToken: string,
  { data, profileImage }: UpdateProfileArgs,
): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  const res = await fetch(`${baseUrl}/user/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update profile");
  const json = await res.json();
  return json.data;
};

export const useUpdateProfile = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: UpdateProfileArgs) =>
      updateProfileRequest(accessToken, args),
    onSuccess: (updatedProfile) => {
      // Instantly update the cache so the UI reflects changes without a refetch
      queryClient.setQueryData(["profile", accessToken], updatedProfile);
    },
  });
};
