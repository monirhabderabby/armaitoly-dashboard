import { baseUrl } from "@/constants";
import { useMutation } from "@tanstack/react-query";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const changePasswordRequest = async (
  accessToken: string,
  payload: ChangePasswordPayload,
): Promise<void> => {
  const res = await fetch(`${baseUrl}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to change password");
};

export const useResetPassword = (accessToken: string) => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changePasswordRequest(accessToken, payload),
  });
};
