import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatVND(amount:number) {
  // Ensure the amount is a number
  if (isNaN(amount)) return '';

  // Convert to number and format
  const numberFormat = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // No decimal places for VND
  });

  return numberFormat.format(amount);
}