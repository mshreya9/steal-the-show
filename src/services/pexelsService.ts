// Reusable service layer for the Pexels API — no UI component talks to Pexels
// directly. Handles auth, caching (in-memory + localStorage), in-flight request
// de-duplication, and typed success/error results.

const API_URL = 'https://api.pexels.com/v1/search'
const CACHE_STORAGE_KEY = 'sts_pexels_cache_v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export interface PexelsPhoto {
  id: number
  width: number
  height: number
  photographer: string
  photographerUrl: string
  pageUrl: string
  alt: string
  src: {
    large: string
    portrait: string
    medium: string
  }
}

export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string }

const apiKey = import.meta.env.VITE_PEXELS_API_KEY
export const pexelsConfigured = Boolean(apiKey)

interface CacheEntry {
  photo: PexelsPhoto | null
  cachedAt: number
}

const memoryCache = new Map<string, CacheEntry>()
const inFlight = new Map<string, Promise<PexelsPhoto | null>>()

function loadPersistedCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, CacheEntry>) : {}
  } catch {
    return {}
  }
}

function persistCache(query: string, entry: CacheEntry) {
  try {
    const all = loadPersistedCache()
    all[query] = entry
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(all))
  } catch {
    // localStorage full or unavailable — in-memory cache still works for this session.
  }
}

function readCache(query: string): CacheEntry | null {
  const fromMemory = memoryCache.get(query)
  if (fromMemory) return fromMemory

  const persisted = loadPersistedCache()[query]
  if (persisted && Date.now() - persisted.cachedAt < CACHE_TTL_MS) {
    memoryCache.set(query, persisted)
    return persisted
  }
  return null
}

function mapPhoto(raw: {
  id: number
  width: number
  height: number
  photographer: string
  photographer_url: string
  url: string
  alt: string
  src: { large: string; portrait: string; medium: string }
}): PexelsPhoto {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    photographer: raw.photographer,
    photographerUrl: raw.photographer_url,
    pageUrl: raw.url,
    alt: raw.alt || '',
    src: { large: raw.src.large, portrait: raw.src.portrait, medium: raw.src.medium },
  }
}

async function fetchFromApi(query: string): Promise<PexelsPhoto | null> {
  const res = await fetch(`${API_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`, {
    headers: { Authorization: apiKey as string },
  })
  if (!res.ok) {
    throw new Error(`Pexels request failed (${res.status})`)
  }
  const data = (await res.json()) as { photos: Parameters<typeof mapPhoto>[0][] }
  return data.photos.length > 0 ? mapPhoto(data.photos[0]) : null
}

/** Fetch (and cache) a single representative photo for a search query. */
export async function searchPhoto(query: string): Promise<ServiceResult<PexelsPhoto | null>> {
  if (!pexelsConfigured) {
    return { ok: false, error: 'Pexels API key is not configured.' }
  }

  const cached = readCache(query)
  if (cached) return { ok: true, data: cached.photo }

  // Reuse an in-flight request for the same query so concurrent card mounts
  // share one network call. Every caller (original or waiting) goes through the
  // same try/catch below, so a rejection is handled gracefully for all of them.
  let promise = inFlight.get(query)
  if (!promise) {
    promise = fetchFromApi(query)
    inFlight.set(query, promise)
  }

  try {
    const photo = await promise
    const entry: CacheEntry = { photo, cachedAt: Date.now() }
    memoryCache.set(query, entry)
    persistCache(query, entry)
    return { ok: true, data: photo }
  } catch (err) {
    return { ok: false, error: (err as Error).message || 'Failed to fetch image from Pexels.' }
  } finally {
    inFlight.delete(query)
  }
}
