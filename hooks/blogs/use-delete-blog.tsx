import { baseUrl } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteBlogResponse = {
  statusCode: number;
  success: boolean;
  message: string;
};

interface Props {
  accessToken: string;
}

export function useDeleteBlog({ accessToken }: Props) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: async (id: string): Promise<DeleteBlogResponse> => {
      const res = await fetch(`${baseUrl}/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to delete blog");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}
