import type { Product, ProductType } from '../types/product'
import type { OccasionGroup } from '../types/product'
import heroImg from '../assets/images/fallback/hero.jpg'
import costumeImg from '../assets/images/fallback/costume.jpg'
import weddingImg from '../assets/images/fallback/wedding.jpg'
import festivalImg from '../assets/images/fallback/festival.jpg'
import performanceImg from '../assets/images/fallback/performance.jpg'
import kidsImg from '../assets/images/fallback/kids.jpg'
import socialImg from '../assets/images/fallback/social.jpg'
import corporateImg from '../assets/images/fallback/corporate.jpg'
import accessoriesImg from '../assets/images/fallback/accessories.jpg'

// Bundled locally so the catalog never falls back to text-initials placeholders —
// these are real photos that ship with the app and always work, even if Pexels
// is unreachable, rate-limited, or a specific search returns zero results.
export const HERO_IMAGE = heroImg

const BY_PRODUCT_TYPE: Record<ProductType, string> = {
  Costume: costumeImg,
  Fashion: weddingImg,
  Performance: performanceImg,
  Kids: kidsImg,
  Accessories: accessoriesImg,
}

const BY_OCCASION_GROUP: Record<OccasionGroup, string> = {
  'Theme Parties': costumeImg,
  'Weddings & Celebrations': weddingImg,
  'Festivals & Culture': festivalImg,
  Performances: performanceImg,
  'Kids & School': kidsImg,
  'Social Events': socialImg,
  Corporate: corporateImg,
}

export function getProductFallbackImage(product: Pick<Product, 'productType' | 'occasionGroup'>): string {
  if (product.occasionGroup === 'Corporate') return corporateImg
  return BY_PRODUCT_TYPE[product.productType] ?? heroImg
}

export function getOccasionFallbackImage(occasionGroup: OccasionGroup): string {
  return BY_OCCASION_GROUP[occasionGroup] ?? heroImg
}
