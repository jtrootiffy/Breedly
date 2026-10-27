import type { Breed, BreedFilters, SortKey } from '@/types/breed.types'

/** Case-insensitive match on breed name or slug. */
function matchesSearch(breed: Breed, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return breed.name.toLowerCase().includes(needle) || breed.slug.toLowerCase().includes(needle)
}

function compareNumbers(a: number | null, b: number | null, direction: 1 | -1): number {
  // Records without the value always sort last, regardless of direction.
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return (a - b) * direction
}

function sortBreeds(breeds: Breed[], sort: SortKey): Breed[] {
  const sorted = [...breeds]
  sorted.sort((a, b) => {
    switch (sort) {
      case 'health-desc':
        return compareNumbers(a.healthScore, b.healthScore, -1)
      case 'health-asc':
        return compareNumbers(a.healthScore, b.healthScore, 1)
      case 'lifespan-desc':
        return compareNumbers(a.medianLifespanYears, b.medianLifespanYears, -1)
      case 'lifespan-asc':
        return compareNumbers(a.medianLifespanYears, b.medianLifespanYears, 1)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'name-asc':
      default:
        return a.name.localeCompare(b.name)
    }
  })
  return sorted
}

/**
 * Applies the explorer's search, filters and sort to the fetched dataset.
 * Pure function: it never fetches anything and never mutates its input.
 */
export function filterBreeds(breeds: Breed[], filters: BreedFilters): Breed[] {
  const filtered = breeds.filter((breed) => {
    if (!matchesSearch(breed, filters.search)) return false
    if (filters.size !== 'all' && breed.size !== filters.size) return false
    if (filters.grade !== 'all' && breed.grade !== filters.grade) return false
    if (filters.brachycephalic === 'yes' && breed.brachycephalic !== true) return false
    if (filters.brachycephalic === 'no' && breed.brachycephalic !== false) return false
    return true
  })

  return sortBreeds(filtered, filters.sort)
}

/** True when any control deviates from its default. */
export function hasActiveFilters(filters: BreedFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.size !== 'all' ||
    filters.grade !== 'all' ||
    filters.brachycephalic !== 'all'
  )
}
