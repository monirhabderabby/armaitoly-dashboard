import { baseUrl } from "@/constants";
import { SingleBlogResponse } from "@/types/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateBlogBody {
  title: string;
  slug: string;
  location: string;
  content: string;
  tags: string[];
  coverImage?: File;
  isPublished?: boolean;
  metaInfo: {
    title: string;
    description: string;
  };
}

interface UseUpdateBlogOptions {
  accessToken: string;
  id: string;
}

export function useUpdateBlog({ accessToken, id }: UseUpdateBlogOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-blog", id],
    mutationFn: async (body: UpdateBlogBody): Promise<SingleBlogResponse> => {
      const formData = new FormData();

      // Only append coverImage if a new file was selected
      if (body.coverImage instanceof File) {
        formData.append("coverImage", body.coverImage);
      }

      formData.append(
        "data",
        JSON.stringify({
          title: body.title,
          slug: body.slug,
          location: body.location,
          content: body.content,
          tags: body.tags,
          isPublished: body.isPublished ?? true,
          metaInfo: body.metaInfo,
        }),
      );

      const res = await fetch(`${baseUrl}/blog/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // DO NOT set Content-Type — browser sets multipart boundary automatically
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to update blog");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
    },
  });
}
