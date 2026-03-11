"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCamera, FiEdit2 } from "react-icons/fi";
import { toast } from "sonner";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { useGetProfile } from "@/hooks/profile/use-get-profile";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PersonalInformationProps {
  accessToken: string;
  user: Session["user"];
}

const PersonalInformation = ({
  accessToken,
  user,
}: PersonalInformationProps) => {
  const { data: profile, isLoading: profileLoading } =
    useGetProfile(accessToken);
  const { mutateAsync: updateProfile, isPending: updating } =
    useUpdateProfile(accessToken);

  const [isEditing, setIsEditing] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Seed form with session data immediately — no loading flicker
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] ?? "",
      lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
      email: user?.email ?? "",
      phone: "",
      bio: "",
    },
  });

  // Once the full profile loads, override with richer API data
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile({
        data: values,
        profileImage: imageFile ?? undefined,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setPreviewImg(null);
      setImageFile(null);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImg(null);
    setImageFile(null);
    form.reset({
      firstName: profile?.firstName ?? user?.name?.split(" ")[0] ?? "",
      lastName:
        profile?.lastName ?? user?.name?.split(" ").slice(1).join(" ") ?? "",
      email: profile?.email ?? user?.email ?? "",
      phone: profile?.phone ?? "",
      bio: profile?.bio ?? "",
    });
  };

  // Priority: local preview > API profileImage > session image > placeholder
  const avatarSrc =
    previewImg ??
    profile?.profileImage ??
    user?.image ??
    "/placeholder-avatar.png";

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : (user?.name ?? "");

  const displayEmail = profile?.email ?? user?.email ?? "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Profile header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-linear-to-r from-sky-50/60 to-white">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-sky-200 ring-offset-2">
            <Image
              src={avatarSrc}
              alt="Profile avatar"
              width={56}
              height={56}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shadow-md hover:bg-sky-600 transition"
                aria-label="Change avatar"
              >
                <FiCamera className="text-white" size={10} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {displayEmail}
          </p>
        </div>
      </div>

      {/* ── Form body ───────────────────────────────────────────────────── */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-700">
            Personal Information
          </h3>
          {!isEditing && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-sky-500 border-sky-200 hover:bg-sky-50 hover:text-sky-600 h-8 text-xs px-3"
            >
              <FiEdit2 size={12} />
              Edit
            </Button>
          )}
        </div>

        {/* Skeleton — only shown on initial fetch, form is already seeded */}
        {profileLoading && !profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-10 rounded-lg bg-gray-100 animate-pulse",
                  i === 4 ? "md:col-span-2 h-24" : "",
                )}
              />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-500">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default text-sm h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-500">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default text-sm h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-500">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default text-sm h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-500">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="(307) 555-0133"
                          className="bg-gray-50 border-gray-200 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default text-sm h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-gray-500">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Tell us about yourself…"
                        className="bg-gray-50 border-gray-200 focus-visible:ring-sky-400 disabled:opacity-100 disabled:cursor-default resize-none text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Actions */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={updating}
                    className="text-gray-500 border-gray-200 hover:bg-gray-50 text-sm h-9 px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updating}
                    className="bg-sky-500 hover:bg-sky-600 text-white text-sm h-9 px-5"
                  >
                    {updating ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

// needed for cn() inside the skeleton map
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default PersonalInformation;
