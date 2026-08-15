import { GRADIENTS } from '../utils/placeholder'
import type { ProductType } from '../types/product'

export interface CategoryDef {
  slug: string
  type: ProductType
  title: string
  description: string
  gradient: [string, string]
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'costumes',
    type: 'Costume',
    title: 'Costumes',
    description: 'Character, themed and novelty looks.',
    gradient: GRADIENTS.midnight,
  },
  {
    slug: 'fashion',
    type: 'Fashion',
    title: 'Fashion',
    description: 'Wedding and occasion wear.',
    gradient: GRADIENTS.gold,
  },
  {
    slug: 'performance',
    type: 'Performance',
    title: 'Performance',
    description: 'Dance, theatre and stage outfits.',
    gradient: GRADIENTS.rose,
  },
  {
    slug: 'kids',
    type: 'Kids',
    title: 'Kids',
    description: 'Fancy dress and children’s event wear.',
    gradient: GRADIENTS.coral,
  },
  {
    slug: 'accessories',
    type: 'Accessories',
    title: 'Accessories',
    description: 'Footwear, masks, wigs, props, jewellery and more.',
    gradient: GRADIENTS.garba,
  },
]

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}
