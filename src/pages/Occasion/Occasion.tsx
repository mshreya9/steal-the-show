import { Navigate, useLocation, useParams, useSearchParams, Link } from 'react-router-dom'
import ProductListingLayout from '../../components/ProductListing/ProductListingLayout'
import { getOccasionBySlug } from '../../data/occasions'
import { PRODUCTS } from '../../data/products'
import type { ListingFilters } from '../../utils/listing'

export default function Occasion() {
  const { occasion: slug } = useParams<{ occasion: string }>()
  const [params] = useSearchParams()
  const location = useLocation()
  const occasion = slug ? getOccasionBySlug(slug) : undefined

  if (!occasion) return <Navigate to="/shop" replace />

  const products = PRODUCTS.filter((p) => p.occasionGroup === occasion.group)
  const subSlug = params.get('sub')
  const activeSub = occasion.subcategories.find((s) => s.slug === subSlug)

  const initialFilters: Partial<ListingFilters> = activeSub ? { subcategories: [activeSub.name] } : {}

  return (
    <ProductListingLayout
      key={location.key}
      eyebrow="Shop by Occasion"
      title={occasion.title}
      description={occasion.description}
      products={products}
      initialFilters={initialFilters}
      headerSlot={
        <div className="flex flex-wrap gap-2">
          {occasion.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              to={`/occasion/${occasion.slug}?sub=${sub.slug}`}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeSub?.slug === sub.slug
                  ? 'border-plum bg-plum text-white'
                  : 'border-grey-200 bg-white text-ink hover:border-plum hover:text-plum'
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      }
    />
  )
}
