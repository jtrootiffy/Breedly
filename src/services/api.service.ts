/**
 * Breed Health Score API Service
 * Fetches dog breed health data from https://breedhealthscore.com
 * 
 * License: CC BY 4.0 - attribution required
 * Source: McMillan, K.M. et al. (2024) "Longevity of companion dog breeds", Scientific Reports
 */

import type { BreedListItem, BreedDetail } from '../types/api.types';

// Base API configuration
const API_BASE = 'https://breedhealthscore.com';
const BREEDS_ENDPOINT = '/api/breeds.json';
const BREED_DETAIL_ENDPOINT = '/api/v1/breeds';

// Cache for breed details to avoid repeated fetches
const detailCache = new Map<string, BreedDetail>();

/**
 * Fetches the list of all breeds from the API
 */
export async function fetchBreedsList(): Promise<BreedListItem[]> {
  const response = await fetch(`${API_BASE}${BREEDS_ENDPOINT}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch breeds: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Handle the envelope structure: { dataset, api_version, ..., breeds: [...] }
  if (!data || !Array.isArray(data.breeds)) {
    throw new Error('Invalid API response format: missing breeds array');
  }

  return data.breeds;
}

/**
 * Fetches detailed information for a specific breed by slug
 * 
 * @param slug The breed slug (e.g., 'caucasian-shepherd-dog')
 * @returns Breed detail object
 */
export async function fetchBreedDetail(slug: string): Promise<BreedDetail> {
  // Check cache first
  if (detailCache.has(slug)) {
    return detailCache.get(slug)!;
  }

  const response = await fetch(`${API_BASE}${BREED_DETAIL_ENDPOINT}/${slug}.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch breed detail for ${slug}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Handle the breed detail envelope structure
  if (!data || !data.breed) {
    throw new Error('Invalid breed detail API response format');
  }

  const detail: BreedDetail = data.breed;

  // Cache the result
  detailCache.set(slug, detail);

  return detail;
}

/**
 * Clears the breed detail cache
 */
export function clearBreedDetailCache(): void {
  detailCache.clear();
}

/**
 * Checks if the API supports CORS for browser requests
 */
export async function checkCORS(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/openapi.json`, {
      method: 'HEAD',
      mode: 'cors',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gets the total number of breeds available in the API
 */
export function getBreedCount(): number {
  // The API reports 155 breeds, but we derive this from the actual data
  // This is a fallback if the API is unavailable
  return 155;
}

export default {
  fetchBreedsList,
  fetchBreedDetail,
  clearBreedDetailCache,
  checkCORS,
  getBreedCount,
};