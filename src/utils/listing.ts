import type { Product } from '../types/product'

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
