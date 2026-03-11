"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { baseUrl } from "@/constants";
import { logoSrc } from "@/constants/images";

/* ---------------- Schema ---------------- */

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/* ---------------- API Response Types ---------------- */

type ResetPasswordSuccessResponse = {
  statusCode: number;
  success: true;
  message: string;
  data: {
    accessToken: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      profileImage: string;
      verified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

type ResetPasswordErrorResponse = {
  statusCode: number;
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
};

type ResetPasswordApiResponse =
  | ResetPasswordSuccessResponse
  | ResetPasswordErrorResponse;

/* ---------------- Component ---------------- */

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: ResetPasswordValues) =>
      fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: data.newPassword,
        }),
      }).then((res) => res.json()),

    onSuccess: (data: ResetPasswordApiResponse) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.push("/login");
    },

    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  function onSubmit(data: ResetPasswordValues) {
    mutate(data);
  }

  return (
    <div className="w-full max-w-150 md:min-w-80 rounded-2xl bg-white px-4 py-9 shadow-sm border border-gray-100">
      {/* Logo */}
      <div className="mb-5 flex justify-center">
        <Image
          src={logoSrc}
          height={52}
          width={110}
          alt="Joy Beach Villas"
          className="h-13 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-base font-semibold tracking-tight text-gray-800">
          Reset Password
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Enter your new password and confirm password
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 z-10 pointer-events-none" />
                    <PasswordInput
                      placeholder="New Password"
                      autoComplete="new-password"
                      className="h-9 pl-8.5 text-sm rounded-md border-gray-200 bg-gray-50 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#23A4D2] focus-visible:border-[#23A4D2] transition-shadow"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-normal" />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 z-10 pointer-events-none" />
                    <PasswordInput
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      className="h-9 pl-8.5 text-sm rounded-md border-gray-200 bg-gray-50 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#23A4D2] focus-visible:border-[#23A4D2] transition-shadow"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-normal" />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-9 w-full rounded-md bg-[#23A4D2] text-sm font-medium text-white hover:bg-[#1a8fb8] active:bg-[#1580a5] transition-colors cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
