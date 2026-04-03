"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, FileText, Loader2, Search, Send } from "lucide-react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
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
import { useUpdateBlog } from "@/hooks/blogs/use-update-blog";
import { Blog } from "@/types/blogs";
import { Session } from "next-auth";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { ThumbnailUploader } from "./thumbnail-uploader";

/* ---------------- Schema ---------------- */

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  location: z.string().min(1, "Please select a location"),
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }),
  content: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length >= 10,
      "Content must be at least 10 characters",
    ),
  tags: z.array(z.string().min(1)).min(1, "Please add at least one tag"),
  metaTitle: z
    .string()
    .min(3, "Meta title must be at least 3 characters")
    .max(80, "Meta title should be 80 characters or less"),
  metaDescription: z
    .string()
    .min(10, "Meta description must be at least 10 characters")
    .max(180, "Meta description should be 180 characters or less"),
});

export const blogEditSchema = blogSchema.extend({
  thumbnail: z.custom<File | null>().optional(),
});

export type BlogValues = z.infer<typeof blogSchema>;
export type BlogEditValues = z.infer<typeof blogEditSchema>;

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

/* ---------------- Helpers ---------------- */

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  const isOver = len > max;
  const isWarning = len > max * 0.85;

  return (
    <span
      className={`text-xs tabular-nums ${
        isOver ? "text-red-500" : isWarning ? "text-amber-500" : "text-gray-400"
      }`}
    >
      {len}/{max}
    </span>
  );
}

/* ---------------- Component ---------------- */

interface Props {
  cu: Session["user"];
  initianData?: Blog;
}

export default function BlogCreateForm({ cu, initianData }: Props) {
  const isEditMode = !!initianData;
  const router = useRouter();

  const { mutate: createBlog, isPending: isCreating } = useCreateBlog({
    accessToken: cu.accessToken ?? "",
  });

  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog({
    accessToken: cu.accessToken,
    id: initianData?.slug ?? "",
  });

  const isPending = isCreating || isUpdating;

  const form = useForm<BlogEditValues>({
    resolver: zodResolver(isEditMode ? blogEditSchema : blogSchema),
    defaultValues: {
      title: initianData?.title ?? "",
      slug: initianData?.slug ?? "",
      location: initianData?.location ?? "",
      thumbnail: undefined as unknown as File,
      tags: initianData?.tags ?? [],
      content: initianData?.content ?? "",
      metaTitle: initianData?.metaInfo.title ?? "",
      metaDescription: initianData?.metaInfo.description ?? "",
    },
    mode: "onChange",
  });

  const title = useWatch({ control: form.control, name: "title" });
  const metaTitle = useWatch({ control: form.control, name: "metaTitle" });
  const metaDescription = useWatch({
    control: form.control,
    name: "metaDescription",
  });

  const slug = useWatch({
    control: form.control,
    name: "slug",
  });

  /* Auto-generate slug from title */
  useEffect(() => {
    if (!isEditMode) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      form.setValue("slug", generatedSlug, {
        shouldValidate: generatedSlug.length >= 3,
      });
    }
  }, [title, isEditMode, form]);

  /* Auto-populate meta title from title when empty */
  useEffect(() => {
    if (!isEditMode) {
      const currentMeta = form.getValues("metaTitle");
      if (!currentMeta) {
        form.setValue("metaTitle", title.slice(0, 60), {
          shouldValidate: title.length >= 3,
        });
      }
    }
  }, [title, isEditMode, form]);

  const onSubmit = (data: BlogEditValues) => {
    if (isEditMode) {
      updateBlog(
        {
          title: data.title,
          location: data.location,
          content: data.content,
          tags: data.tags,
          ...(data.thumbnail instanceof File && { coverImage: data.thumbnail }),
          isPublished: true,
          slug: data.slug,
          metaInfo: {
            title: metaTitle,
            description: metaDescription,
          },
        },
        {
          onSuccess: (res) => {
            toast.success(res.message);
            router.push("/blogs");
          },
          onError: (err) => {
            toast.error(err.message);
          },
        },
      );
    } else {
      createBlog(
        {
          title: data.title,
          location: data.location,
          content: data.content,
          tags: data.tags,
          coverImage: data.thumbnail as File,
          isPublished: true,
          slug: data.slug,
          metaInfo: {
            title: metaTitle,
            description: metaDescription,
          },
        },
        {
          onSuccess: (res) => {
            toast.success(res.message);
            form.reset();
            router.push("/blogs");
          },
          onError: (err) => {
            toast.error(err.message);
          },
        },
      );
    }
  };

  /* Google SERP preview values */
  const previewTitle = metaTitle || title || "Page title will appear here";
  const previewDesc =
    metaDescription ||
    "Your meta description will appear here. Write a compelling summary to improve click-through rates from search results.";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumb ── */}
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
          <span className="text-gray-600 font-medium">
            {isEditMode ? "Edit Blog" : "Create Blog"}
          </span>
        </nav>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {/* ── Section 1: Blog Details ── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#23A4D2]/10">
                <FileText className="size-4 text-[#23A4D2]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Blog Details
                </h2>
                <p className="text-xs text-gray-400">
                  Fill in the core information about your blog post
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
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
                name="slug"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. joy-beach-villa-blog"
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
                        value={field.value ?? null}
                        onChange={field.onChange}
                        existingUrl={
                          isEditMode ? initianData?.coverImage : undefined
                        }
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
            </div>
          </div>

          {/* ── Section 2: SEO / Meta ── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Section header */}
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50">
                <Search className="size-4 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  SEO & Meta
                </h2>
                <p className="text-xs text-gray-400">
                  Optimise how this post appears in search engine results
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* Meta Title */}
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Meta Title
                      </FormLabel>
                      <CharCounter value={field.value} max={60} />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="e.g. Best Beach Villas in Bali – Joy Resorts"
                        className="h-10 rounded-lg border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:border-emerald-400"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-400">
                      Recommended: 50–60 characters. Appears as the clickable
                      headline in Google results.
                    </p>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />

              {/* Meta Description */}
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Meta Description
                      </FormLabel>
                      <CharCounter value={field.value} max={160} />
                    </div>
                    <FormControl>
                      <textarea
                        rows={3}
                        placeholder="e.g. Discover the most stunning beach villas in Bali. Explore Joy Resorts' hand-picked collection of luxury stays with ocean views."
                        className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-400">
                      Recommended: 120–160 characters. A concise summary that
                      encourages clicks from search results.
                    </p>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />

              {/* Google SERP Preview */}
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Search className="size-3" />
                  Google Search Preview
                </p>

                {/* SERP card */}
                <div className="rounded-lg border border-gray-100 bg-white px-4 py-3.5 shadow-xs">
                  {/* URL breadcrumb line */}
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <div className="size-4 rounded-full bg-gray-100" />
                    <span className="text-xs text-gray-500">
                      yoursite.com
                      <span className="mx-1 text-gray-300">›</span>
                      blogs
                      <span className="mx-1 text-gray-300">›</span>
                      <span className="text-gray-500">
                        {slug || "post-slug"}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <p
                    className="mt-1 line-clamp-1 text-[17px] font-normal leading-snug text-[#1a0dab]"
                    style={{ fontFamily: "arial, sans-serif" }}
                  >
                    {previewTitle.slice(0, 60)}
                    {previewTitle.length > 60 && (
                      <span className="text-gray-500">...</span>
                    )}
                  </p>

                  {/* Description */}
                  <p
                    className="mt-1 line-clamp-2 text-sm leading-[1.58] text-[#4d5156]"
                    style={{ fontFamily: "arial, sans-serif" }}
                  >
                    {previewDesc.slice(0, 160)}
                    {previewDesc.length > 160 && "..."}
                  </p>
                </div>

                {/* Guidance badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <SerpBadge
                    label="Title"
                    value={metaTitle?.length ?? 0}
                    min={50}
                    max={60}
                    unit="chars"
                  />
                  <SerpBadge
                    label="Description"
                    value={metaDescription?.length ?? 0}
                    min={120}
                    max={160}
                    unit="chars"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 gap-2 rounded-lg bg-[#23A4D2] px-6 text-sm font-medium text-white hover:bg-[#1a8fb8] active:bg-[#1580a5] transition-colors cursor-pointer"
            >
              {isEditMode ? "Update Blog" : "Upload Blog"}
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
  );
}

/* ---------------- SERP Badge ---------------- */

function SerpBadge({
  label,
  value,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}) {
  const isEmpty = value === 0;
  const isGood = value >= min && value <= max;
  const isOver = value > max;

  const status = isEmpty
    ? { text: "Empty", cls: "bg-gray-100 text-gray-400" }
    : isGood
      ? { text: "Good", cls: "bg-emerald-50 text-emerald-600" }
      : isOver
        ? { text: "Too long", cls: "bg-red-50 text-red-500" }
        : { text: "Too short", cls: "bg-amber-50 text-amber-600" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.cls}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isEmpty
            ? "bg-gray-300"
            : isGood
              ? "bg-emerald-500"
              : isOver
                ? "bg-red-400"
                : "bg-amber-400"
        }`}
      />
      {label}: {status.text}
      {!isEmpty && (
        <span className="opacity-60">
          ({value}/{max} {unit})
        </span>
      )}
    </span>
  );
}
