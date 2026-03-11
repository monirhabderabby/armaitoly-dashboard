import { baseUrl } from "@/constants";
import { BlogResponse } from "@/types/blogs";
import { useQuery } from "@tanstack/react-query";

interface UseGetAllBlogsOptions {
  page?: number;
  limit?: number;
}

export function useGetAllBlogs({
  page = 1,
  limit = 10,
}: UseGetAllBlogsOptions) {
  return useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: async (): Promise<BlogResponse> => {
      const res = await fetch(`${baseUrl}/blog?page=${page}&limit=${limit}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch blogs");
      }

      return res.json();
    },
  });
}
