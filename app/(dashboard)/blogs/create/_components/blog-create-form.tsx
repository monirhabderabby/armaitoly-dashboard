"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RichTextEditor } from "@/components/shared/rich-text-editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { useCreateBlog } from "@/hooks/blogs/use-create-blog";
import { Session } from "next-auth";
import { ThumbnailUploader } from "./thumbnail-uploader";

/* ---------------- Schema ---------------- */

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(1, "Please select a location"),
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }),
  content: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length >= 10,
      "Content must be at least 10 characters",
    ),
  tags: z.array(z.string().min(1)).min(1, "Please add at least one tag"),
});

export type BlogValues = z.infer<typeof blogSchema>;

/* ---------------- Locations ---------------- */

const locations = [
  "Thailand",
  "Bali, Indonesia",
  "Maldives",
  "Phuket",
  "Koh Samui",
  "Krabi",
  "Langkawi, Malaysia",
  "Boracay, Philippines",
];

/* ---------------- Component ---------------- */

interface Props {
  cu: Session["user"];
}

export default function BlogCreateForm({ cu }: Props) {
  const { mutate: createBlog, isPending } = useCreateBlog({
    accessToken: cu.accessToken ?? "",
  });

  const form = useForm<BlogValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      location: "",
      thumbnail: undefined as unknown as File,
      content: "",
      tags: [],
    },
    mode: "onChange",
  });

  const onSubmit = (data: BlogValues) => {
    createBlog(
      {
        title: data.title,
        location: data.location,
        content: data.content,
        tags: data.tags,
        coverImage: data.thumbnail as File,
        isPublished: true,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          form.reset();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          Blog Management
        </h1>
        <nav className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <Link
            href="/dashboard"
            className="hover:text-[#23A4D2] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href="/dashboard/blogs"
            className="hover:text-[#23A4D2] transition-colors"
          >
            Blog Management
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-gray-600 font-medium">Create Blog</span>
        </nav>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Joy beach villa blog"
                      className="h-10 rounded-lg border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#23A4D2] focus-visible:border-[#23A4D2]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Select Location
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-gray-50 text-sm focus:ring-1 focus:ring-[#23A4D2] focus:border-[#23A4D2] data-placeholder:text-gray-400">
                        <SelectValue placeholder="e.g. Thailand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc} className="text-sm">
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Thumbnail Photo
                  </FormLabel>
                  <FormControl>
                    <ThumbnailUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Tags
                  </FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Type a tag and press Enter"
                      maxItems={10}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Content
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={isPending}
                className="h-10 gap-2 rounded-lg bg-[#23A4D2] px-6 text-sm font-medium text-white hover:bg-[#1a8fb8] active:bg-[#1580a5] transition-colors cursor-pointer"
              >
                Upload Blog
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
