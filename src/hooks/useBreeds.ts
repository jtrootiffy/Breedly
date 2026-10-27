import { useCallback, useEffect, useState } from 'react'
import { describeApiError, getBreeds, isAbortError } from '@/services/api.service'
import type { Breed } from '@/types/breed.types'

export interface UseBreedsResult {
  breeds: Breed[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

/**
 * Loads the breed catalog once per session (the service caches it in memory, so
 * navigating between pages does not refetch).
 *
 * Loading is derived rather than stored: there is nothing to show until the request
 * resolves, and an error ends the wait. Retrying resets the local result and forces a
 * fresh network call.
 */
export function useBreeds(): UseBreedsResult {
  const [breeds, setBreeds] = useState<Breed[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    getBreeds({ force: attempt > 0 })
      .then((list) => {
        if (!cancelled) setBreeds(list)
      })
      .catch((caught: unknown) => {
        if (cancelled || isAbortError(caught)) return
        setError(describeApiError(caught))
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setBreeds(null)
    setError(null)
    setAttempt((value) => value + 1)
  }, [])

  return {
    breeds: breeds ?? [],
    isLoading: breeds === null && error === null,
    error,
    retry,
  }
}
