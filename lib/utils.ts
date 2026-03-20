import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractUuid(cdnUrl: string): string {
  const parts = cdnUrl.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}
