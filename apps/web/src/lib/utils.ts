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

/**
 * Formats a number as a percentage with 2 decimal places
 * @param value - The value to format (e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns The formatted percentage as a string (e.g., "25.00%")
 */
export function formatPercentage(
	value: number | null | undefined,
	decimals = 2,
): string {
	const num = value ?? 0;
	return `${(num * 100).toFixed(decimals)}%`;
}
