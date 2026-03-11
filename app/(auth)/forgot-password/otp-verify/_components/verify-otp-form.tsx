"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { baseUrl } from "@/constants";
import { logoSrc } from "@/constants/images";

/* ---------------- Schema ---------------- */

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "The code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "Only numbers are allowed"),
});

type OtpValues = z.infer<typeof otpSchema>;

/* ---------------- API Response Types ---------------- */

type OtpApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
};

/* ---------------- Constants ---------------- */

const RESEND_SECONDS = 30;

/* ---------------- Component ---------------- */

export default function OtpVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const canResend = secondsLeft <= 0;

  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = useWatch({ control: form.control, name: "otp" }) ?? "";
  const hasError = !!form.formState.errors.otp?.message;

  /* --- Verify OTP --- */
  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationKey: ["otp-verify"],
    mutationFn: (values: OtpValues) =>
      fetch(`${baseUrl}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      }).then((res) => res.json()),

    onSuccess: (data: OtpApiResponse) => {
      if (!data.success) {
        form.setError("otp", { message: data.message });
        return;
      }
      toast.success(data.message);
      router.push(
        `/forgot-password/otp-verify/reset?email=${encodeURIComponent(email)}`,
      );
    },

    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  /* --- Resend OTP --- */
  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationKey: ["otp-resend"],
    mutationFn: () =>
      fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),

    onSuccess: (data: OtpApiResponse) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("A new OTP has been sent to your email.");
      setSecondsLeft(RESEND_SECONDS);
    },

    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  const resendLabel = useMemo(
    () => (canResend ? "Resend" : `Resend in ${secondsLeft}s`),
    [canResend, secondsLeft],
  );

  function onSubmit(values: OtpValues) {
    verifyOtp(values);
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
        OTP Verification
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* OTP Input */}
        <div className="flex flex-col items-center gap-2">
          <InputOTP
            maxLength={6}
            value={otpValue}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(v: any) => {
              form.clearErrors("otp");
              form.setValue("otp", v, { shouldValidate: true });
            }}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  aria-invalid={hasError}
                  className="size-10 rounded-md border-gray-200 bg-gray-50 text-sm font-medium aria-invalid:border-red-400 aria-invalid:ring-red-400"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {/* Error / hint */}
          {hasError ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.otp?.message}
            </p>
          ) : (
            <p className="text-xs text-gray-400 text-center">
              Enter the 6-digit code sent to <br />
              <span className="font-medium text-gray-600">{email}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isVerifying || otpValue.length < 6}
          className="h-9 w-full rounded-md bg-[#23A4D2] text-sm font-medium text-white hover:bg-[#1a8fb8] active:bg-[#1580a5] transition-colors cursor-pointer disabled:opacity-60"
        >
          {isVerifying ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Verify Now"
          )}
        </Button>

        {/* Resend */}
        <p className="text-center text-xs text-gray-400">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            disabled={!canResend || isResending}
            onClick={() => resendOtp()}
            className="font-medium text-[#23A4D2] hover:underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-opacity"
          >
            {isResending ? "Sending..." : resendLabel}
          </button>
        </p>
      </form>
    </div>
  );
}
