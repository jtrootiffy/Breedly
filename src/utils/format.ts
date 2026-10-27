/** Text shown whenever the API does not supply a value. Never invent a number. */
export const NOT_AVAILABLE = 'Not available'

/** `5.4` -> `"5.4 years"` */
export function formatYears(years: number | null | undefined): string {
  if (years === null || years === undefined || !Number.isFinite(years)) return NOT_AVAILABLE
  return `${years} ${years === 1 ? 'year' : 'years'}`
}

/** `5.4` -> `"5.4 yrs"` (compact, for cards and tables) */
export function formatYearsShort(years: number | null | undefined): string {
  if (years === null || years === undefined || !Number.isFinite(years)) return NOT_AVAILABLE
  return `${years} yrs`
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || !Number.isFinite(score)) return NOT_AVAILABLE
  return String(score)
}

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return NOT_AVAILABLE
  return String(value)
}

export function formatWeight(weight: string | null | undefined): string {
  if (!weight) return NOT_AVAILABLE
  return weight
}

/** `"caucasian-shepherd-dog"` -> `"Caucasian Shepherd Dog"` */
export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** `true` -> `"Yes"`, `false` -> `"No"`, `null` -> `"Not available"`. */
export function formatBoolean(value: boolean | null | undefined, yes = 'Yes', no = 'No'): string {
  if (value === null || value === undefined) return NOT_AVAILABLE
  return value ? yes : no
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
