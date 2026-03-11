"use client";

import { useGetAllBlogs } from "@/hooks/blogs/use-get-all-blogs";
import { Session } from "next-auth";
import { BlogCard } from "./blog-card";
import BlogCardSkeleton from "./blog-card-skeleton";

interface Props {
  cu: Session["user"];
}

export function BlogList({ cu }: Props) {
  const { data, isLoading, isError } = useGetAllBlogs({});

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">
          Failed to load blogs. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-gray-400">
            No blogs found. Create your first blog!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((blog) => (
            <BlogCard key={blog._id} blog={blog} cu={cu} />
          ))}
        </div>
      )}
    </>
  );
}
