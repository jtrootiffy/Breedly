import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CompareContext, MAX_COMPARE, type CompareContextValue } from '@/context/compare-context'

const STORAGE_KEY = 'breedly:compare-slugs'

function readStoredSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
      .slice(0, MAX_COMPARE)
  } catch {
    return []
  }
}

/**
 * Holds the breeds selected for comparison so any page (cards, detail view, compare
 * page) can add or remove them. The selection survives a page refresh.
 */
export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(readStoredSlugs)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
    } catch {
      // Storage can be unavailable (private mode); the selection then lives in memory only.
    }
  }, [slugs])

  const toggle = useCallback((slug: string) => {
    if (!slug) return
    setSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug)
      if (current.length >= MAX_COMPARE) return current
      return [...current, slug]
    })
  }, [])

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((item) => item !== slug))
  }, [])

  const clear = useCallback(() => setSlugs([]), [])

  const value = useMemo<CompareContextValue>(
    () => ({
      slugs,
      maxSelection: MAX_COMPARE,
      isFull: slugs.length >= MAX_COMPARE,
      isSelected: (slug: string) => slugs.includes(slug),
      toggle,
      remove,
      clear,
    }),
    [slugs, toggle, remove, clear],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
