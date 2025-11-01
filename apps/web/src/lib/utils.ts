import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a number to 2 decimal places
 * @param amount - The amount to format
 * @returns The formatted amount as a string with exactly 2 decimal places
 */
export function formatAmount(amount: number | null | undefined): string {
	const num = amount ?? 0;
	return num.toFixed(2);
}
