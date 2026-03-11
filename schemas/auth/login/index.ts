import { z } from "zod";

/* ---------------- Zod Schema ---------------- */

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type LoginValues = z.infer<typeof loginSchema>;
