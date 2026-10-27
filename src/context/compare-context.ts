import { createContext } from 'react'

/** Maximum number of breeds that can be compared side by side. */
export const MAX_COMPARE = 3

export interface CompareContextValue {
  /** Slugs currently selected for comparison, in selection order. */
  slugs: string[]
  maxSelection: number
  isFull: boolean
  isSelected: (slug: string) => boolean
  toggle: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
}

export const CompareContext = createContext<CompareContextValue | null>(null)
