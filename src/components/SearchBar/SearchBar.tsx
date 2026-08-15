import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { PRODUCTS } from '../../data/products'

export default function SearchBar({
  autoFocus,
  onNavigate,
  placeholder = 'Search costumes, outfits, events...',
}: {
  autoFocus?: boolean
  onNavigate?: () => void
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q),
    ).slice(0, 6)
  }, [query])

  const submit = (value?: string) => {
    const q = (value ?? query).trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setFocused(false)
    onNavigate?.()
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex items-center gap-2 rounded-full border border-grey-200 bg-grey-100 px-4 py-2.5 focus-within:border-plum focus-within:bg-white"
      >
        <Search size={18} className="shrink-0 text-grey" aria-hidden="true" />
        <input
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          placeholder={placeholder}
          aria-label="Search products"
          className="w-full flex-1 bg-transparent text-sm text-ink placeholder:text-grey focus:outline-none"
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
            <X size={16} className="text-grey" />
          </button>
        )}
      </form>

      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-auto rounded-2xl border border-grey-200 bg-white p-2 shadow-pop animate-slide-down">
          {suggestions.map((p) => (
            <button
              key={p.id}
              onClick={() => submit(p.name)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-plum-50"
            >
              <img src={p.image} alt="" aria-hidden="true" className="h-11 w-11 rounded-lg object-cover" />
              <span className="flex-1 min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                <span className="block text-xs text-grey">
                  {p.productType} · {p.occasion}
                </span>
              </span>
            </button>
          ))}
          <button
            onClick={() => submit()}
            className="mt-1 flex w-full items-center gap-2 rounded-xl p-2.5 text-left text-sm font-semibold text-plum hover:bg-plum-50"
          >
            <Search size={14} /> See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  )
}
