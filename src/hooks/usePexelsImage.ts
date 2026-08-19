import { useEffect, useState } from 'react'
import { searchPhoto, type PexelsPhoto } from '../services/pexelsService'

interface PexelsImageState {
  url: string | null
  photo: PexelsPhoto | null
  loading: boolean
  error: string | null
}

/**
 * Resolves a real product photo for a search query via the Pexels service.
 * Callers should always render a fallback `src` (e.g. the generated placeholder)
 * until `url` is non-null, and keep using it if `error` is set.
 */
export function usePexelsImage(query: string): PexelsImageState {
  const [state, setState] = useState<PexelsImageState>({ url: null, photo: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ url: null, photo: null, loading: true, error: null })

    searchPhoto(query)
      .then((result) => {
        if (cancelled) return
        if (!result.ok) {
          setState({ url: null, photo: null, loading: false, error: result.error })
          return
        }
        const photo = result.data
        setState({ url: photo?.src.portrait ?? photo?.src.large ?? null, photo, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (cancelled) return
        setState({ url: null, photo: null, loading: false, error: err.message || 'Failed to load image.' })
      })

    return () => {
      cancelled = true
    }
  }, [query])

  return state
}
