import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn merges class names and resolves Tailwind conflicts.
 * - clsx handles conditional composition (strings, arrays, objects)
 * - tailwind-merge deduplicates and resolves conflicting utilities (e.g., px-2 vs px-4)
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(...inputs));
}
