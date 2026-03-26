import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely convert price to number
 * Handles: string numbers, currency strings, undefined values
 * @param price - Price value (number, string, or undefined)
 * @returns Numeric price or 0 if invalid
 */
export function toNumber(price: unknown): number {
  if (price === null || price === undefined) return 0

  if (typeof price === "number") {
    return isNaN(price) ? 0 : price
  }

  if (typeof price === "string") {
    // Remove currency symbols and whitespace
    const cleaned = price.replace(/[^\d.-]/g, "").trim()
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }

  return 0
}

/**
 * Calculate cart total with proper type safety
 * @param items - Array of cart items with price and quantity
 * @returns Rounded total
 */
export function calculateTotal(
  items: Array<{ price: unknown; quantity: number }>
): number {
  if (!Array.isArray(items) || items.length === 0) return 0

  const total = items.reduce((sum, item) => {
    const price = toNumber(item.price)
    const quantity = Math.max(0, item.quantity || 0)
    return sum + price * quantity
  }, 0)

  return Math.round(total * 100) / 100
}

/**
 * Calculate tax and total
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate as decimal (e.g., 0.18 for 18%)
 * @returns Object with tax and total
 */
export function calculateTax(subtotal: number, taxRate: number = 0.18) {
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100
  return { tax, total }
}
