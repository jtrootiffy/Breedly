import type { BreedImage } from '@/types/breed.types'

/**
 * Breed photography is served from the same origin as the API. The list endpoint does
 * not include images, but every breed ships a deterministic hero image at this path
 * (verified for all 155 breeds), which lets the catalog render photos without firing a
 * detail request per card. The detail endpoint's own `image` object always wins when
 * present because it carries photographer/source attribution.
 *
 * Photos are plain <img> loads (not Canvas reads), so they are not affected by CORS.
 */
const IMAGE_BASE = 'https://breedhealthscore.com/assets/img/breed'

export function heroImageUrl(slug: string): string | null {
  if (!slug) return null
  return `${IMAGE_BASE}/${encodeURIComponent(slug)}-hero.jpg`
}

/** Returns the API image when available, otherwise the deterministic hero image. */
export function resolveBreedImage(
  slug: string,
  image?: BreedImage | null,
): BreedImage | null {
  if (image?.url) return image
  const derived = heroImageUrl(slug)
  return derived ? { url: derived } : null
}
