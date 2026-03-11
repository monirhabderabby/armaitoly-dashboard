"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { baseUrl } from "@/constants";
import { logoSrc } from "@/constants/images";
import { loginSchema, LoginValues } from "@/schemas/auth/login";

/* ---------------- API Response Types ---------------- */

type LoginSuccessResponse = {
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

type LoginErrorResponse = {
  statusCode: number;
  success: false;
  message: string;
  errorSources?: {
    path: string;
    message: string;
  }[];
};

type LoginApiResponse = LoginSuccessResponse | LoginErrorResponse;

/* ---------------- Component ---------------- */

export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginValues) =>
      fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }).then((res) => res.json()),

    onSuccess: async (data: LoginApiResponse) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const { accessToken, user } = data.data;

      await signIn("credentials", {
        data: JSON.stringify({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          verified: user.verified,
          accessToken,
        }),
        redirect: true,
        redirectTo: "/",
      });
    },

    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  function onSubmit(data: LoginValues) {
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
      <h1 className="mb-6 text-center text-base font-semibold tracking-tight text-gray-800">
        Login to Your Account
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Email"
                      autoComplete="email"
                      className="h-9 pl-8.5 text-sm rounded-md border-gray-200 bg-gray-50 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#23A4D2] focus-visible:border-[#23A4D2] transition-shadow"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-normal" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 z-10 pointer-events-none" />
                    <PasswordInput
                      placeholder="Password"
                      autoComplete="current-password"
                      className="h-9 pl-8.5 text-sm rounded-md border-gray-200 bg-gray-50 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#23A4D2] focus-visible:border-[#23A4D2] transition-shadow"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-normal" />
              </FormItem>
            )}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between py-0.5">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-1.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="size-3.5 rounded-[3px] border-gray-300 data-[state=checked]:bg-[#23A4D2] data-[state=checked]:border-[#23A4D2]"
                    />
                  </FormControl>
                  <label className="text-xs text-gray-500 cursor-pointer select-none">
                    Remember me
                  </label>
                </FormItem>
              )}
            />

            <Link
              href="/forgot-password"
              className="text-xs text-[#23A4D2] hover:underline underline-offset-2"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-9 w-full rounded-md bg-[#23A4D2] text-sm font-medium text-white hover:bg-[#1a8fb8] active:bg-[#1580a5] transition-colors cursor-pointer"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Log in"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
