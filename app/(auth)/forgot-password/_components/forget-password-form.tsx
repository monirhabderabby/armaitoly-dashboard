"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { baseUrl } from "@/constants";
import { logoSrc } from "@/constants/images";

/* ---------------- Schema ---------------- */

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/* ---------------- API Response Types ---------------- */

type ForgotPasswordSuccessResponse = {
  statusCode: number;
  success: true;
  message: string;
  data: {
    message: string;
  };
};

type ForgotPasswordErrorResponse = {
  statusCode: number;
  success: false;
  message: string;
  errorSources?: {
    path: string;
    message: string;
  }[];
};

type ForgotPasswordApiResponse =
  | ForgotPasswordSuccessResponse
  | ForgotPasswordErrorResponse;

/* ---------------- Component ---------------- */

export default function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (data: ForgotPasswordValues) =>
      fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      }).then((res) => res.json()),

    onSuccess: (data: ForgotPasswordApiResponse, variables) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.push(
        `/forgot-password/otp-verify?email=${encodeURIComponent(variables.email)}`,
      );
    },

    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  function onSubmit(data: ForgotPasswordValues) {
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
        Forgot Password
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

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-9 w-full rounded-md bg-[#23A4D2] text-sm font-medium text-white hover:bg-[#1a8fb8] active:bg-[#1580a5] transition-colors cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Send Otp"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
