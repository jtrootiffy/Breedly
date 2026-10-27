/**
 * Raw shapes returned by the Breed Health Score API (https://breedhealthscore.com).
 *
 * Every field is optional because the API is an external dependency: a schema change
 * or a partial record must never crash the UI. `src/utils/normalize.ts` turns these
 * loose payloads into the strict `Breed` domain model used by the components.
 */

export interface ApiBreedImage {
  url?: string
  photographer?: string
  source?: string
}

export interface ApiScoreComponents {
  longevity?: number | null
  conformation?: number | null
  burden?: number | null
}

export interface ApiBreed {
  breed?: string
  slug?: string
  url?: string
  median_lifespan_years?: number | null
  size?: string | null
  weight_kg?: string | null
  brachycephalic?: boolean | null
  conditions?: string[]
  severe_count?: number | null
  health_score?: number | null
  grade?: string | null
  components?: ApiScoreComponents | null
  image?: ApiBreedImage | null
}

/** Metadata envelope shared by every endpoint. */
export interface ApiEnvelope {
  dataset?: string
  api_version?: string
  licence?: string
  source?: string
  source_url?: string
  attribution?: string
  docs?: string
  openapi?: string
}

/** `GET /api/breeds.json` */
export interface ApiBreedsResponse extends ApiEnvelope {
  total?: number
  count?: number
  breeds?: ApiBreed[]
}

/** `GET /api/v1/breeds/{slug}.json` */
export interface ApiBreedDetailResponse extends ApiEnvelope {
  breed?: ApiBreed
}
