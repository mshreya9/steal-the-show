import { useEffect, useState } from 'react'
import { usePexelsImage } from '../../hooks/usePexelsImage'

export default function PexelsImage({
  query,
  seed = 0,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy',
  showAttribution = false,
}: {
  query: string
  seed?: number
  fallbackSrc: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  showAttribution?: boolean
}) {
  const { url, photo, loading: fetching, error } = usePexelsImage(query, seed)
  const [broken, setBroken] = useState(false)

  // A failed load must not permanently lock the card onto the fallback — give
  // each new URL (e.g. once the real photo resolves) a fresh chance to load.
  useEffect(() => {
    setBroken(false)
  }, [url])

  // Fall back to the generated placeholder while loading, on error, if Pexels
  // found nothing for this query, or if the real photo URL itself fails to load.
  const src = url && !broken ? url : fallbackSrc

  return (
    <div className="absolute inset-0">
      {fetching && <div className="absolute inset-0 shimmer-bg" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === '' || undefined}
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
