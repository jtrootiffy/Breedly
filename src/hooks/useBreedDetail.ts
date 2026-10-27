import { useCallback, useEffect, useState } from 'react'
import { describeApiError, getBreed, isAbortError } from '@/services/api.service'
import type { Breed } from '@/types/breed.types'

export interface UseBreedDetailResult {
  breed: Breed | null
  isLoading: boolean
  error: string | null
  retry: () => void
}

interface DetailResult {
  slug: string
  breed: Breed | null
  error: string | null
}

/**
 * Loads one breed from the detail endpoint. Results are cached in the service, so
 * re-opening a breed you already viewed does not trigger another request.
 *
 * The loaded result is stored together with the slug it belongs to, which lets loading
 * and error states be derived during render. Moving to another breed therefore shows the
 * skeleton again instead of the previous breed's data.
 */
export function useBreedDetail(slug: string | undefined): UseBreedDetailResult {
  const [result, setResult] = useState<DetailResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!slug) return

    let cancelled = false

    getBreed(slug, { force: attempt > 0 })
      .then((breed) => {
        if (!cancelled) setResult({ slug, breed, error: null })
      })
      .catch((caught: unknown) => {
        if (cancelled || isAbortError(caught)) return
        setResult({ slug, breed: null, error: describeApiError(caught) })
      })

    return () => {
      cancelled = true
    }
  }, [slug, attempt])

  const current = result && result.slug === slug ? result : null

  const retry = useCallback(() => {
    setResult(null)
    setAttempt((value) => value + 1)
  }, [])

  return {
    breed: current?.breed ?? null,
    isLoading: Boolean(slug) && current === null,
    error: slug ? (current?.error ?? null) : 'No breed was specified.',
    retry,
  }
}
