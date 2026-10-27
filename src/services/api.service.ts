/**
 * Breed Health Score API service.
 *
 * Data: https://breedhealthscore.com (CC BY 4.0). Lifespan figures come from
 * McMillan et al. 2024, "Longevity of companion dog breeds", Scientific Reports.
 *
 * ## Why requests go to a same-origin path
 * The upstream API answers plain requests but does not send `Access-Control-Allow-Origin`,
 * so a cross-origin `fetch` from a browser is blocked by CORS. This module therefore
 * targets a same-origin prefix (`/api/bhs` by default) that is forwarded to the real API
 * by the Vite dev/preview proxy (vite.config.ts) and by a rewrite on Vercel
 * (vercel.json). The upstream stays the only data source — nothing is mocked or cached
 * as fake data. Set `VITE_API_BASE` to point somewhere else if you host the proxy
 * differently.
 */

import type { ApiBreedDetailResponse, ApiBreedsResponse } from '@/types/api.types'
import type { Breed } from '@/types/breed.types'
import { normalizeBreed } from '@/utils/normalize'

const RAW_BASE = import.meta.env.VITE_API_BASE ?? '/api/bhs'
const API_BASE = RAW_BASE.replace(/\/+$/, '')

const REQUEST_TIMEOUT_MS = 15_000

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse' | 'validation'

/** Error type that carries enough detail for the UI to explain what went wrong. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function requestJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const forwardAbort = () => controller.abort()
  signal?.addEventListener('abort', forwardAbort, { once: true })

  const url = `${API_BASE}/${path.replace(/^\/+/, '')}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
  } catch (error) {
    // A caller-initiated abort is not an error the UI should display.
    if (signal?.aborted) throw error
    if (controller.signal.aborted) {
      throw new ApiError('timeout', 'The Breed Health Score API took too long to respond.')
    }
    throw new ApiError(
      'network',
      'Could not reach the Breed Health Score API. Check your connection and try again.',
    )
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', forwardAbort)
  }

  if (!response.ok) {
    const suffix =
      response.status === 404
        ? 'That breed could not be found in the dataset.'
        : 'The Breed Health Score API returned an error.'
    throw new ApiError('http', `${suffix} (HTTP ${response.status})`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('parse', 'The Breed Health Score API returned an unreadable response.')
  }
}

/** Turns any thrown value into a message that is safe to show a user. */
export function describeApiError(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong while loading breed data.'
}

export { isAbortError }

/* ------------------------------------------------------------------ *
 * In-memory caching. Avoids duplicate network calls for the same data.
 * ------------------------------------------------------------------ */

let breedsCache: Breed[] | null = null
let breedsRequest: Promise<Breed[]> | null = null

const breedDetailCache = new Map<string, Breed>()
const breedDetailRequests = new Map<string, Promise<Breed>>()

/**
 * Loads the full breed catalog (`GET /api/breeds.json`).
 * Concurrent callers share a single request, and the result is cached in memory.
 */
export function getBreeds(options: { force?: boolean } = {}): Promise<Breed[]> {
  if (options.force) {
    breedsCache = null
    breedsRequest = null
  }

  if (breedsCache) return Promise.resolve(breedsCache)

  if (!breedsRequest) {
    breedsRequest = requestJson<ApiBreedsResponse>('breeds.json')
      .then((payload) => {
        if (!payload || !Array.isArray(payload.breeds)) {
          throw new ApiError(
            'validation',
            'The Breed Health Score API did not return a list of breeds.',
          )
        }

        const breeds = payload.breeds
          .map(normalizeBreed)
          .filter((breed) => breed.slug !== '')

        if (breeds.length === 0) {
          throw new ApiError('validation', 'The Breed Health Score API returned an empty list.')
        }

        breedsCache = breeds
        return breeds
      })
      .catch((error: unknown) => {
        breedsRequest = null // allow a later retry
        throw error
      })
  }

  return breedsRequest
}

/**
 * Loads one breed (`GET /api/v1/breeds/{slug}.json`), with in-memory caching and
 * de-duplication so the same breed is never fetched twice.
 */
export function getBreed(slug: string, options: { force?: boolean } = {}): Promise<Breed> {
  const key = slug.trim()

  if (!key) {
    return Promise.reject(new ApiError('validation', 'No breed was specified.'))
  }

  if (options.force) {
    breedDetailCache.delete(key)
    breedDetailRequests.delete(key)
  }

  const cached = breedDetailCache.get(key)
  if (cached) return Promise.resolve(cached)

  const inFlight = breedDetailRequests.get(key)
  if (inFlight) return inFlight

  const request = requestJson<ApiBreedDetailResponse>(
    `v1/breeds/${encodeURIComponent(key)}.json`,
  )
    .then((payload) => {
      if (!payload || !payload.breed) {
        throw new ApiError(
          'validation',
          `The Breed Health Score API did not return details for "${key}".`,
        )
      }
      const breed = normalizeBreed(payload.breed)
      breedDetailCache.set(key, breed)
      return breed
    })
    .finally(() => {
      breedDetailRequests.delete(key)
    })

  breedDetailRequests.set(key, request)
  return request
}
