import type { Product } from '../types/product'
import { formatINR } from './inventory'

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'availability'

export interface ListingFilters {
  productTypes: string[]
  occasionGroups: string[]
  subcategories: string[]
  buyRent: ('buy' | 'rent')[]
  maxPrice: number
  sizes: string[]
  onlyAvailable: boolean
  only24Hour: boolean
}

export const EMPTY_FILTERS: ListingFilters = {
  productTypes: [],
  occasionGroups: [],
  subcategories: [],
  buyRent: [],
  maxPrice: 0,
  sizes: [],
  onlyAvailable: false,
  only24Hour: false,
}

export function uniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return Array.from(new Set(items.map((i) => i[key])))
}

export function displayPrice(p: Product): number {
  if (p.isRentable) return p.rentalPrice
  return p.buyPrice
}

export function applyFilters(products: Product[], filters: ListingFilters): Product[] {
  return products.filter((p) => {
    if (filters.productTypes.length && !filters.productTypes.includes(p.productType)) return false
    if (filters.occasionGroups.length && !filters.occasionGroups.includes(p.occasionGroup)) return false
    if (filters.subcategories.length && !filters.subcategories.includes(p.subcategory)) return false
    if (filters.buyRent.length) {
      const matchesBuy = filters.buyRent.includes('buy') && p.isBuyable
      const matchesRent = filters.buyRent.includes('rent') && p.isRentable
      if (!matchesBuy && !matchesRent) return false
    }
    if (filters.maxPrice > 0 && displayPrice(p) > filters.maxPrice) return false
    if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false
    if (filters.onlyAvailable && p.inventory <= 0) return false
    if (filters.only24Hour && !p.is24HourDelivery) return false
    return true
  })
}

export interface FilterChip {
  key: string
  label: string
  remove: (filters: ListingFilters) => ListingFilters
}

export function activeFilterChips(filters: ListingFilters): FilterChip[] {
  const chips: FilterChip[] = []

  filters.productTypes.forEach((v) =>
    chips.push({ key: `type-${v}`, label: v, remove: (f) => ({ ...f, productTypes: f.productTypes.filter((x) => x !== v) }) }),
  )
  filters.occasionGroups.forEach((v) =>
    chips.push({
      key: `occ-${v}`,
      label: v,
      remove: (f) => ({ ...f, occasionGroups: f.occasionGroups.filter((x) => x !== v) }),
    }),
  )
  filters.subcategories.forEach((v) =>
    chips.push({
      key: `sub-${v}`,
      label: v,
      remove: (f) => ({ ...f, subcategories: f.subcategories.filter((x) => x !== v) }),
    }),
  )
  filters.buyRent.forEach((v) =>
    chips.push({
      key: `mode-${v}`,
      label: v === 'buy' ? 'Buy' : 'Rent',
      remove: (f) => ({ ...f, buyRent: f.buyRent.filter((x) => x !== v) }),
    }),
  )
  filters.sizes.forEach((v) =>
    chips.push({ key: `size-${v}`, label: `Size ${v}`, remove: (f) => ({ ...f, sizes: f.sizes.filter((x) => x !== v) }) }),
  )
  if (filters.only24Hour) {
    chips.push({ key: '24hr', label: '24-Hour Delivery', remove: (f) => ({ ...f, only24Hour: false }) })
  }
  if (filters.onlyAvailable) {
    chips.push({ key: 'available', label: 'In stock only', remove: (f) => ({ ...f, onlyAvailable: false }) })
  }
  if (filters.maxPrice > 0) {
    chips.push({ key: 'price', label: `Up to ${formatINR(filters.maxPrice)}`, remove: (f) => ({ ...f, maxPrice: 0 }) })
  }

  return chips
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products]
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => displayPrice(a) - displayPrice(b))
    case 'price-desc':
      return arr.sort((a, b) => displayPrice(b) - displayPrice(a))
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating)
    case 'availability':
      return arr.sort((a, b) => b.inventory - a.inventory)
    default:
      return arr
  }
}
