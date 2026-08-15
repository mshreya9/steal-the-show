export type ProductType = 'Costume' | 'Fashion' | 'Performance' | 'Kids' | 'Accessories'

export type OccasionGroup =
  | 'Theme Parties'
  | 'Weddings & Celebrations'
  | 'Festivals & Culture'
  | 'Performances'
  | 'Kids & School'
  | 'Social Events'
  | 'Corporate'

export interface Product {
  id: number
  name: string
  productType: ProductType
  occasionGroup: OccasionGroup
  occasion: string
  subcategory: string
  image: string
  gradient: [string, string]
  buyPrice: number
  rentalPrice: number
  rentalPeriod: string
  inventory: number
  rating: number
  reviews: number
  deliveryTime: string
  is24HourDelivery: boolean
  sizes: string[]
  isRentable: boolean
  isBuyable: boolean
  groupOrderAvailable: boolean
  groupOrderQuantity: number
  description: string
}
