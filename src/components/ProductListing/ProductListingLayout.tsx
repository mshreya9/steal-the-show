import { useMemo, useState, type ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Product } from '../../types/product'
import ProductCard from '../ProductCard/ProductCard'
import FilterPanel from '../Filters/FilterPanel'
import {
  activeFilterChips,
  applyFilters,
  EMPTY_FILTERS,
  sortProducts,
  uniqueValues,
  type ListingFilters,
  type SortKey,
} from '../../utils/listing'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'availability', label: 'Availability' },
]

export default function ProductListingLayout({
  eyebrow,
  title,
  description,
  products,
  emptyState,
  initialFilters,
  headerSlot,
}: {
  eyebrow?: string
  title: string
  description?: string
  products: Product[]
  emptyState?: ReactNode
  initialFilters?: Partial<ListingFilters>
  headerSlot?: ReactNode
}) {
  const [filters, setFilters] = useState<ListingFilters>({ ...EMPTY_FILTERS, ...initialFilters })
  const [sort, setSort] = useState<SortKey>('recommended')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const priceCeiling = useMemo(() => {
    const prices = products.map((p) => (p.isRentable ? p.rentalPrice : p.buyPrice))
    return Math.max(500, ...prices)
  }, [products])

  const productTypeOptions = useMemo(() => uniqueValues(products, 'productType') as string[], [products])
  const occasionGroupOptions = useMemo(() => uniqueValues(products, 'occasionGroup') as string[], [products])
  const subcategoryOptions = useMemo(() => uniqueValues(products, 'subcategory') as string[], [products])
  const sizeOptions = useMemo(() => {
    const all = products.flatMap((p) => p.sizes)
    return Array.from(new Set(all))
  }, [products])

  const filtered = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort])

  const activeFilterCount =
    filters.productTypes.length +
    filters.occasionGroups.length +
    filters.subcategories.length +
    filters.buyRent.length +
    filters.sizes.length +
    (filters.onlyAvailable ? 1 : 0) +
    (filters.only24Hour ? 1 : 0) +
    (filters.maxPrice > 0 ? 1 : 0)

  const resetFilters = () => setFilters(EMPTY_FILTERS)
  const chips = useMemo(() => activeFilterChips(filters), [filters])

  const filterPanelProps = {
    filters,
    onChange: setFilters,
    productTypeOptions: productTypeOptions.length > 1 ? productTypeOptions : [],
    occasionGroupOptions: occasionGroupOptions.length > 1 ? occasionGroupOptions : [],
    subcategoryOptions: occasionGroupOptions.length <= 1 && subcategoryOptions.length > 1 ? subcategoryOptions : [],
    sizeOptions,
    priceCeiling,
    onReset: resetFilters,
  }

  return (
    <div className="container-shell py-8">
      <div className="mb-6">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-coral-600">{eyebrow}</p>}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
          <span className="text-sm font-medium text-grey">{products.length} looks</span>
        </div>
        {description && <p className="mt-2 max-w-2xl text-sm text-grey-DEFAULT">{description}</p>}
        {headerSlot && <div className="mt-4">{headerSlot}</div>}
      </div>

      <div className="flex items-center justify-between gap-3 border-y border-grey-200 py-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-grey-200 px-3.5 py-2 text-sm font-semibold text-ink lg:hidden"
        >
          <SlidersHorizontal size={15} /> Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-plum text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="hidden text-sm text-grey lg:block">
          Showing <span className="font-semibold text-ink">{filtered.length}</span> of {products.length}
        </p>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="hidden text-grey sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm font-semibold text-ink focus:border-plum focus:outline-none"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chips.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1" aria-label="Active filters">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setFilters(chip.remove(filters))}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-plum-200 bg-plum-50 px-3 py-1.5 text-xs font-semibold text-plum-600 hover:bg-plum-100"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button onClick={resetFilters} className="shrink-0 text-xs font-semibold text-coral-700 hover:underline">
            Clear all
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel {...filterPanelProps} />
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-grey-300 py-20 text-center">
              {emptyState ?? (
                <>
                  <p className="font-display text-xl font-bold text-ink">No looks found.</p>
                  <p className="mt-1 text-sm text-grey">Try adjusting your filters.</p>
                </>
              )}
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="mt-4 text-sm font-semibold text-plum hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] flex lg:hidden">
          <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto flex h-full w-[88%] max-w-sm flex-col bg-white p-5 animate-slide-up">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
              <button aria-label="Close filters" onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 hover:bg-grey-100">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterPanel {...filterPanelProps} />
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-4 shrink-0 rounded-xl bg-plum py-3 text-sm font-bold text-white"
            >
              Show {filtered.length} looks
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
