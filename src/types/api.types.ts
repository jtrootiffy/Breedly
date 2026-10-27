/**
 * API Types for Breed Health Score
 * https://breedhealthscore.com
 */

// Breed list item from /api/breeds.json
export interface BreedListItem {
  breed: string;
  slug: string;
  url: string;
  median_lifespan_years: number;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  brachycephalic: boolean;
  conditions: string[];
  severe_count: number;
  health_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  components: {
    longevity: number;
    conformation: number;
    burden: number;
  };
  image?: {
    url: string;
    photographer: string;
    source: string;
  };
}

// Breed detail from /api/v1/breeds/{slug}.json
export interface BreedDetail {
  breed: string;
  slug: string;
  url: string;
  median_lifespan_years: number;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  weight_kg?: string;
  brachycephalic: boolean;
  conditions: string[];
  health_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  components: {
    longevity: number;
    conformation: number;
    burden: number;
  };
  image?: {
    url: string;
    photographer: string;
    source: string;
  };
}

// Health grade colors mapping based on API grading
export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface GradeColors {
  background: string;
  text: string;
  border: string;
}

// Sort options for the breed explorer
export type SortOption = 'health-score-desc' | 'health-score-asc' | 'lifespan-desc' | 'lifespan-asc' | 'alphabetical';

// Filter options
export interface BreedFilters {
  searchTerm: string;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  healthGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
  brachycephalic?: boolean | null;
}

// Sort configuration
export interface SortConfig {
  field: keyof BreedListItem;
  direction: 'asc' | 'desc';
}

// Pagination state
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// API error type
export interface ApiError {
  message: string;
  type: 'network' | 'http' | 'parse' | 'validation';
}

// Loader state
export type LoaderState = 'idle' | 'loading' | 'error' | 'empty';

// Comparison state
export interface SelectedBreed {
  slug: string;
  name: string;
  healthScore: number;
  grade: HealthGrade;
  medianLifespan: number;
  size: string;
  brachycephalic: boolean;
  conditions: string[];
}