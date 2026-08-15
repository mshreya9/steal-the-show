import { Link, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductListingLayout from '../../components/ProductListing/ProductListingLayout'
import SearchBar from '../../components/SearchBar/SearchBar'
import { PRODUCTS } from '../../data/products'

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''

  const results = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div>
      <div className="border-b border-grey-200 bg-white py-6">
        <div className="container-shell max-w-2xl">
          <SearchBar autoFocus placeholder="Search costumes, outfits, events..." />
        </div>
      </div>

      <ProductListingLayout
        title={query ? `Results for "${query}"` : 'Search'}
        products={results}
        emptyState={
          <>
            <p className="font-display text-xl font-bold text-ink">No looks found.</p>
            <p className="mt-1 max-w-xs text-sm text-grey">
              Try another search or explore what's trending.
            </p>
            <Link to="/shop" className="mt-4 text-sm font-semibold text-plum hover:underline">
              Explore Looks
            </Link>
          </>
        }
      />
    </div>
  )
}
