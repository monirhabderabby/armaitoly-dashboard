import { baseUrl } from "@/constants";
import { Blog } from "@/types/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* ---------------- Types ---------------- */

export interface CreateBlogBody {
  title: string;
  location: string;
  content: string;
  tags: string[];
  coverImage: File;
  isPublished?: boolean;
  slug: string;
  metaInfo: {
    title: string;
    description: string;
  };
}

export type CreateBlogResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Blog;
};

interface UseCreateBlogOptions {
  accessToken: string;
}

/* ---------------- Hook ---------------- */

export function useCreateBlog({ accessToken }: UseCreateBlogOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-blog"],
    mutationFn: async (body: CreateBlogBody): Promise<CreateBlogResponse> => {
      const formData = new FormData();

      // File field
      formData.append("coverImage", body.coverImage);

      // JSON data field — server expects stringified JSON under "data"
      formData.append(
        "data",
        JSON.stringify({
          title: body.title,
          location: body.location,
          content: body.content,
          tags: body.tags,
          isPublished: body.isPublished ?? true,
          slug: body.slug,
          metaInfo: body.metaInfo,
        }),
      );

      const res = await fetch(`${baseUrl}/blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // DO NOT set Content-Type — browser sets it automatically
          // with the correct multipart boundary for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to create blog");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}
