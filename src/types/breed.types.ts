import type { ApiBreedImage } from './api.types'

/** Size buckets used by the API. */
export type BreedSize = 'toy' | 'small' | 'medium' | 'large' | 'giant'

/** Composite grade assigned by the API. */
export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'E'

export interface BreedImage extends ApiBreedImage {
  url: string
}

export interface ScoreComponents {
  longevity: number | null
  conformation: number | null
  burden: number | null
}

/**
 * Normalized breed record. Every component reads from this shape, so a missing or
 * malformed API field becomes an explicit `null` instead of a runtime crash.
 */
export interface Breed {
  name: string
  slug: string
  url: string
  medianLifespanYears: number | null
  size: BreedSize | null
  brachycephalic: boolean | null
  conditions: string[]
  severeCount: number | null
  healthScore: number | null
  grade: HealthGrade | null
  components: ScoreComponents
  image: BreedImage | null
  weightKg: string | null
}

export const BREED_SIZES: BreedSize[] = ['toy', 'small', 'medium', 'large', 'giant']
export const HEALTH_GRADES: HealthGrade[] = ['A', 'B', 'C', 'D', 'E']

export const SIZE_LABELS: Record<BreedSize, string> = {
  toy: 'Toy',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  giant: 'Giant',
}

export type SortKey =
  | 'health-desc'
  | 'health-asc'
  | 'lifespan-desc'
  | 'lifespan-asc'
  | 'name-asc'
  | 'name-desc'

export interface BreedFilters {
  search: string
  size: BreedSize | 'all'
  grade: HealthGrade | 'all'
  brachycephalic: 'all' | 'yes' | 'no'
  sort: SortKey
}

export const DEFAULT_FILTERS: BreedFilters = {
  search: '',
  size: 'all',
  grade: 'all',
  brachycephalic: 'all',
  sort: 'health-desc',
}
