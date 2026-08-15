import { useSearchParams } from 'react-router-dom'
import ProductListingLayout from '../../components/ProductListing/ProductListingLayout'
import { PRODUCTS } from '../../data/products'
import type { ListingFilters } from '../../utils/listing'

export default function Shop() {
  const [params] = useSearchParams()
  const mode = params.get('mode')
  const delivery = params.get('delivery')

  const initialFilters: Partial<ListingFilters> = {}
  if (mode === 'buy' || mode === 'rent') initialFilters.buyRent = [mode]
  if (delivery === '24hr') initialFilters.only24Hour = true

  return (
    <ProductListingLayout
      eyebrow="All Looks"
      title="Shop Steal The Show"
      description="Every costume, outfit and accessory across every occasion — buy or rent, delivered fast."
      products={PRODUCTS}
      initialFilters={initialFilters}
    />
  )
}
