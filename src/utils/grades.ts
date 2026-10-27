import type { HealthGrade } from '@/types/breed.types'

export interface GradeInfo {
  /** Colour used for gauges, meters and accent bars. */
  solid: string
  /** Readable text colour on the tinted badge background. */
  text: string
  /** Very light tint used as the badge background. */
  tint: string
  border: string
  /** Short, plain-language reading of the API's grade. */
  label: string
}

/**
 * Colour mapping keyed on the grade letter the API returns.
 *
 * The brief only allows score-range colours when they match the API's documented
 * grading, so we key on the documented grade itself rather than inventing numeric
 * cut-offs. Colours run green (good) -> amber -> red (poor) and are used purely as a
 * visual aid next to the printed grade and score.
 */
export const GRADE_INFO: Record<HealthGrade, GradeInfo> = {
  A: {
    solid: '#07b07b',
    text: '#056042',
    tint: 'rgba(7, 176, 123, 0.12)',
    border: 'rgba(7, 176, 123, 0.35)',
    label: 'Strong',
  },
  B: {
    solid: '#7cae31',
    text: '#46651a',
    tint: 'rgba(124, 174, 49, 0.14)',
    border: 'rgba(124, 174, 49, 0.35)',
    label: 'Good',
  },
  C: {
    solid: '#d9a520',
    text: '#7a5a06',
    tint: 'rgba(217, 165, 32, 0.16)',
    border: 'rgba(217, 165, 32, 0.38)',
    label: 'Moderate',
  },
  D: {
    solid: '#d97a2b',
    text: '#8a4510',
    tint: 'rgba(217, 122, 43, 0.15)',
    border: 'rgba(217, 122, 43, 0.38)',
    label: 'Elevated risk',
  },
  E: {
    solid: '#cf4a4a',
    text: '#8f2727',
    tint: 'rgba(207, 74, 74, 0.14)',
    border: 'rgba(207, 74, 74, 0.36)',
    label: 'High risk',
  },
}

export function getGradeInfo(grade: string | null | undefined): GradeInfo | null {
  if (!grade) return null
  const key = grade.trim().toUpperCase() as HealthGrade
  return key in GRADE_INFO ? GRADE_INFO[key] : null
}

/** Describes the weighted components exactly as published on the methodology page. */
export const SCORE_COMPONENTS = [
  {
    key: 'longevity' as const,
    label: 'Longevity',
    weight: '65%',
    description: 'Median lifespan mapped from 8 years (score 0) to 15 years (score 100).',
  },
  {
    key: 'conformation' as const,
    label: 'Conformation',
    weight: '20%',
    description: 'Deductions for flat-faced (brachycephalic) and giant conformation risk.',
  },
  {
    key: 'burden' as const,
    label: 'Hereditary burden',
    weight: '15%',
    description: 'Deductions per known condition, weighted more heavily for life-threatening ones.',
  },
]
