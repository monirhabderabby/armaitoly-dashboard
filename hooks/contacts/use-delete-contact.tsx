import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteContactRequest = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  const res = await fetch(`${baseUrl}/contact/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to delete contact");
};

export const useDeleteContact = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContactRequest(accessToken, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", accessToken] });
    },
  });
};
