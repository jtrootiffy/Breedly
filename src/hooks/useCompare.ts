import { useContext } from 'react'
import { CompareContext, type CompareContextValue } from '@/context/compare-context'

/** Reads the shared breed-comparison selection. Must be inside <CompareProvider>. */
export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used inside a <CompareProvider>.')
  }
  return context
}
