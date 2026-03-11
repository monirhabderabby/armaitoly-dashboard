import { baseUrl } from "@/constants";
import { SingleBlogResponse } from "@/types/blogs";
import { useQuery } from "@tanstack/react-query";

interface UseGetSingleBlogOptions {
  id: string;
}

export function useGetSingleBlog({ id }: UseGetSingleBlogOptions) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async (): Promise<SingleBlogResponse> => {
      const res = await fetch(`${baseUrl}/blog/${id}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch blog");
      }

      return res.json();
    },
    enabled: !!id,
  });
}
