import type { Occasion } from '../data/occasions'
import type { OccasionGroup } from '../types/product'

const QUERY_BY_GROUP: Record<OccasionGroup, string> = {
  'Theme Parties': 'Halloween costume',
  'Weddings & Celebrations': 'Indian wedding lehenga',
  'Festivals & Culture': 'Garba outfit',
  Performances: 'dance performance costume',
  'Kids & School': 'kids fancy dress',
  'Social Events': 'party outfit',
  Corporate: 'corporate event',
}

export function getOccasionQuery(occasion: Occasion): string {
  return QUERY_BY_GROUP[occasion.group]
}
