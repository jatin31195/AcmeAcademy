import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Ported verbatim from client/src/lib/utils.js.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
