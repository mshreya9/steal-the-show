import type { Product } from '../types/product'

// The approved query set for product imagery, mapped by name/subcategory keywords.
// Rules are checked in order so more specific matches (exact character names) win
// over broader subcategory/occasion fallbacks.
const RULES: { test: (p: Product) => boolean; query: string }[] = [
  { test: (p) => /batman/i.test(p.name), query: 'Batman costume' },
  { test: (p) => /spider-?man/i.test(p.name) || p.subcategory === 'Superhero', query: 'superhero costume' },
  { test: (p) => p.subcategory === 'Christmas', query: 'Christmas costume' },
  { test: (p) => p.subcategory === 'Bollywood', query: 'Bollywood party' },
  { test: (p) => p.subcategory === 'Character Parties' || p.subcategory === 'Hollywood', query: 'Halloween costume' },
  { test: (p) => p.subcategory === 'Lehengas' || p.subcategory === 'Sarees', query: 'Indian wedding lehenga' },
  { test: (p) => p.subcategory === 'Sherwanis' || p.subcategory === 'Nehru Jackets', query: 'Indian sherwani' },
  { test: (p) => /kurta/i.test(p.name), query: 'Indian sherwani' },
  { test: (p) => p.subcategory === 'Garba' || p.subcategory === 'Navratri', query: 'Garba outfit' },
  { test: (p) => p.subcategory === 'Rajasthani', query: 'Garba outfit' },
  { test: (p) => p.subcategory === 'Kasavu', query: 'Indian wedding lehenga' },
  { test: (p) => p.productType === 'Performance', query: 'dance performance costume' },
  { test: (p) => p.productType === 'Kids', query: 'kids fancy dress' },
  { test: (p) => p.productType === 'Accessories', query: 'costume accessories' },
  { test: (p) => p.occasionGroup === 'Corporate' && p.subcategory === 'Mascot', query: 'Halloween costume' },
]

const DEFAULT_QUERY = 'party outfit'

export function getPexelsQuery(product: Product): string {
  const rule = RULES.find((r) => r.test(product))
  return rule?.query ?? DEFAULT_QUERY
}
