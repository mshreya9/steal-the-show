import type { Product } from '../types/product'

// Demo-only serviceability model — there's no real logistics/warehouse system
// behind this catalog, so availability is derived from a curated list of major
// Indian city pincode prefixes (first 3 digits) rather than per-product data.
// 24-hour-delivery products are additionally limited to a smaller "metro" subset.
const SERVICEABLE_PREFIXES = new Set([
  '110', // Delhi
  '400', // Mumbai
  '411', // Pune
  '380', // Ahmedabad
  '500', // Hyderabad
  '560', // Bangalore
  '600', // Chennai
  '700', // Kolkata
  '226', // Lucknow
  '302', // Jaipur
  '641', // Coimbatore
  '682', // Kochi
  '160', // Chandigarh
  '122', // Gurgaon
  '201', // Noida
  '452', // Indore
  '462', // Bhopal
  '751', // Bhubaneswar
  '781', // Guwahati
  '800', // Patna
])

const METRO_PREFIXES = new Set(['110', '400', '411', '500', '560', '600', '700', '122', '201'])

export type AvailabilityStatus = 'available-24hr' | 'available-standard' | 'not-serviceable' | 'invalid'

export interface AvailabilityResult {
  status: AvailabilityStatus
  message: string
}

export function checkAvailability(pincode: string, product: Pick<Product, 'is24HourDelivery' | 'deliveryTime'>): AvailabilityResult {
  const clean = pincode.trim()
  if (!/^\d{6}$/.test(clean)) {
    return { status: 'invalid', message: 'Enter a valid 6-digit pincode.' }
  }

  const prefix = clean.slice(0, 3)
  if (!SERVICEABLE_PREFIXES.has(prefix)) {
    return { status: 'not-serviceable', message: `Not deliverable to ${clean} yet.` }
  }

  if (product.is24HourDelivery && METRO_PREFIXES.has(prefix)) {
    return { status: 'available-24hr', message: `Available with 24-hour delivery to ${clean}.` }
  }

  return { status: 'available-standard', message: `Available to ${clean} — ${product.deliveryTime}.` }
}
