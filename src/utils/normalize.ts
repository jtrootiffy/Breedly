import type { ApiBreed, ApiBreedImage } from '@/types/api.types'
import type { Breed, BreedImage, BreedSize, HealthGrade } from '@/types/breed.types'
import { BREED_SIZES, HEALTH_GRADES } from '@/types/breed.types'
import { titleFromSlug } from '@/utils/format'

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function toBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null
}

function toText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function toImage(value: unknown): BreedImage | null {
  if (!value || typeof value !== 'object') return null
  const url = toText((value as ApiBreedImage).url)
  if (!url) return null
  return {
    url,
    photographer: toText((value as ApiBreedImage).photographer) ?? undefined,
    source: toText((value as ApiBreedImage).source) ?? undefined,
  }
}

/**
 * Turns a loose API record into the strict `Breed` model. Unknown or missing fields
 * become `null`/empty values so the UI can show "Not available" instead of crashing.
 */
export function normalizeBreed(raw: ApiBreed | null | undefined): Breed {
  const record = (raw ?? {}) as Record<string, unknown>
  const slug = toText(record.slug) ?? ''
  const rawSize = toText(record.size)?.toLowerCase() ?? null
  const rawGrade = toText(record.grade)?.toUpperCase() ?? null
  const components = (record.components ?? {}) as Record<string, unknown>
  const conditions = Array.isArray(record.conditions)
    ? record.conditions.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    : []

  return {
    name: toText(record.breed) ?? titleFromSlug(slug),
    slug,
    url: toText(record.url) ?? (slug ? `https://breedhealthscore.com/breed/${slug}/` : ''),
    medianLifespanYears: toNumber(record.median_lifespan_years),
    size: BREED_SIZES.includes(rawSize as BreedSize) ? (rawSize as BreedSize) : null,
    brachycephalic: toBoolean(record.brachycephalic),
    conditions,
    severeCount: toNumber(record.severe_count),
    healthScore: toNumber(record.health_score),
    grade: HEALTH_GRADES.includes(rawGrade as HealthGrade) ? (rawGrade as HealthGrade) : null,
    components: {
      longevity: toNumber(components.longevity),
      conformation: toNumber(components.conformation),
      burden: toNumber(components.burden),
    },
    image: toImage(record.image),
    weightKg: toText(record.weight_kg),
  }
}
