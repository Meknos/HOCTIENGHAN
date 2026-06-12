import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gộp class Tailwind, xử lý xung đột. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
