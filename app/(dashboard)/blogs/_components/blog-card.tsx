"use client";

import { Button } from "@/components/ui/button";
import { logoSrc } from "@/constants/images";
import { useDeleteBlog } from "@/hooks/blogs/use-delete-blog";
import { Blog } from "@/types/blogs";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const AlertModal = dynamic(() => import("@/components/ui/custom/alert-modal"), {
  ssr: false,
});

interface Props {
  blog: Blog;
  cu: Session["user"];
}

export function BlogCard({ blog, cu }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog({
    accessToken: cu.accessToken,
  });

  const plainText = "";
  const excerpt =
    plainText.length > 120 ? plainText.slice(0, 120) + "......." : plainText;
  const formattedDate = format(new Date(blog.createdAt), "dd MMM, yyyy");
  const authorName = `${blog.createdBy.firstName} ${blog.createdBy.lastName}`;

  const handleDelete = () => {
    deleteBlog(blog.slug, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Cover image */}
        <div className="relative h-52 w-full shrink-0 bg-gray-100">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <div className="relative size-9 shrink-0 rounded-full overflow-hidden border border-gray-100">
              <Image
                src={blog.createdBy.profileImage || logoSrc}
                alt={authorName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {authorName}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-3">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-gray-500 leading-relaxed flex-1">
            {excerpt}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Link href={`/dashboard/blogs/${blog._id}`} className="flex-1">
              <Button
                variant="outline"
                className="h-9 w-full rounded-lg border-[#23A4D2] text-[#23A4D2] text-xs font-medium hover:bg-[#23A4D2] hover:text-white transition-colors cursor-pointer"
              >
                View Full Blog details
              </Button>
            </Link>

            <Link href={`/blogs/edit/${blog.slug}`}>
              <button className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-[#23A4D2] hover:bg-sky-50 transition-colors cursor-pointer">
                <Pencil className="size-3.5" />
              </button>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Blog?"
        message="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </>
  );
}
