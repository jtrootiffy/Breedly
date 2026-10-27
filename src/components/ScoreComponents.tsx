import { Info } from 'lucide-react'
import ScoreMeter from '@/components/ScoreMeter'
import { SCORE_COMPONENTS } from '@/utils/grades'
import type { ScoreComponents as ScoreComponentsModel } from '@/types/breed.types'

interface ScoreComponentsProps {
  components: ScoreComponentsModel
}

const COMPONENT_COLORS: Record<string, string> = {
  longevity: '#07b07b',
  conformation: '#80a1c1',
  burden: '#c9a227',
}

/**
 * The API returns the three weighted parts of the composite score. We only ever show
 * the values it supplies — when a component is missing we say so instead of guessing.
 * Weights and descriptions come from the published methodology page.
 */
export default function ScoreComponents({ components }: ScoreComponentsProps) {
  const hasAnyComponent = SCORE_COMPONENTS.some(
    (component) => components[component.key] !== null,
  )

  return (
    <div className="space-y-5">
      {!hasAnyComponent ? (
        <p className="text-sm text-ink-600">
          Component scores are not available for this breed.
        </p>
      ) : (
        SCORE_COMPONENTS.map((component) => {
          const value = components[component.key]
          return (
            <div key={component.key}>
              <ScoreMeter
                label={`${component.label} (${component.weight})`}
                value={value}
                color={COMPONENT_COLORS[component.key]}
                valueText={
                  value === null
                    ? 'Not available'
                    : `${value} out of 100, weighted ${component.weight} of the composite score`
                }
              />
              <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{component.description}</p>
            </div>
          )
        })
      )}

      <p className="flex gap-2 rounded-2xl bg-sand-100 px-4 py-3 text-xs leading-relaxed text-ink-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue-strong" aria-hidden="true" />
        <span>
          A composite breed health score is a breed-level comparison tool, not a veterinary
          diagnosis. It compares breeds against each other on population data and says nothing about
          the health of any individual dog.
        </span>
      </p>
    </div>
  )
}
