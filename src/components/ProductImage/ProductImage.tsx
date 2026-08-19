import { useState } from 'react'
import type { Product } from '../../types/product'
import { usePexelsImage } from '../../hooks/usePexelsImage'
import { getPexelsQuery } from '../../utils/pexelsQuery'

export default function ProductImage({
  product,
  className = '',
  loading = 'lazy',
  showAttribution = false,
  decorative = false,
}: {
  product: Product
  className?: string
  loading?: 'lazy' | 'eager'
  showAttribution?: boolean
  decorative?: boolean
}) {
  const query = getPexelsQuery(product)
  const { url, photo, loading: fetching, error } = usePexelsImage(query)
  const [broken, setBroken] = useState(false)

  // Fall back to the generated placeholder while loading, on error, if Pexels
  // found nothing for this query, or if the real photo URL itself fails to load.
  const src = url && !broken ? url : product.image

  return (
    <div className="absolute inset-0">
      {fetching && <div className="absolute inset-0 shimmer-bg" aria-hidden="true" />}
      <img
        src={src}
        alt={decorative ? '' : product.name}
        aria-hidden={decorative || undefined}
        loading={loading}
        onError={() => setBroken(true)}
        className={className}
      />
      {showAttribution && url && !broken && !error && photo && (
        <a
          href={photo.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1.5 right-1.5 rounded-md bg-ink/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm hover:bg-ink/80"
        >
          Photo: {photo.photographer} / Pexels
        </a>
      )}
    </div>
  )
}
