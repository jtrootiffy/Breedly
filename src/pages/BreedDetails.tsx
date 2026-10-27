import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Ruler,
  Scale,
  Timer,
  Wind,
} from 'lucide-react'
import AttributionNote from '@/components/AttributionNote'
import BreedImage from '@/components/BreedImage'
import CompareToggleButton from '@/components/CompareToggleButton'
import ConditionList from '@/components/ConditionList'
import GradeBadge from '@/components/GradeBadge'
import HealthScoreGauge from '@/components/HealthScoreGauge'
import ScoreComponents from '@/components/ScoreComponents'
import StatTile from '@/components/StatTile'
import StatePanel from '@/components/StatePanel'
import { useBreedDetail } from '@/hooks/useBreedDetail'
import { useBreeds } from '@/hooks/useBreeds'
import { formatBoolean, formatCount, formatWeight, formatYears } from '@/utils/format'
import { buttonClass, cardClass } from '@/utils/ui'
import { SIZE_LABELS } from '@/types/breed.types'
import { NOT_AVAILABLE } from '@/utils/format'

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14" aria-hidden="true">
      <div className="h-5 w-40 animate-pulse rounded-full bg-sand-200" />
      <div className="mt-8 h-10 w-2/3 animate-pulse rounded-full bg-sand-200" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="aspect-[16/10] animate-pulse rounded-3xl bg-sand-200" />
          <div className="h-40 animate-pulse rounded-3xl bg-sand-100" />
        </div>
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-3xl bg-sand-100" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-3xl bg-sand-100" />
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only">Loading breed details…</p>
    </div>
  )
}

export default function BreedDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { breed, isLoading, error, retry } = useBreedDetail(slug)
  const { breeds } = useBreeds()

  // Previous / next use the alphabetical catalogue order.
  const neighbours = useMemo(() => {
    if (!slug || breeds.length === 0) return { previous: null, next: null }
    const ordered = [...breeds].sort((a, b) => a.name.localeCompare(b.name))
    const index = ordered.findIndex((item) => item.slug === slug)
    if (index === -1) return { previous: null, next: null }
    return {
      previous: index > 0 ? ordered[index - 1] : null,
      next: index < ordered.length - 1 ? ordered[index + 1] : null,
    }
  }, [slug, breeds])

  const backLink = (
    <Link
      to="/breeds"
      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue-strong transition-colors hover:text-brand-emerald-strong"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to Explore Breeds
    </Link>
  )

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error || !breed) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <StatePanel
          tone="error"
          icon={AlertTriangle}
          title="We couldn't load this breed"
          description={error ?? 'The breed details are not available right now.'}
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={retry} className={buttonClass('primary', 'md')}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Retry
              </button>
              <Link to="/breeds" className={buttonClass('outline', 'md')}>
                Browse all breeds
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  const sizeLabel = breed.size ? SIZE_LABELS[breed.size] : NOT_AVAILABLE
  const imageCredit =
    breed.image?.photographer || breed.image?.source
      ? [breed.image?.photographer, breed.image?.source].filter(Boolean).join(' · ')
      : null

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      {backLink}

      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">{breed.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <GradeBadge grade={breed.grade} showLabel />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-sand-100 px-3 py-1 text-xs font-medium text-ink-700">
              <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
              {sizeLabel}
            </span>
            {breed.brachycephalic === true ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-sand-100 px-3 py-1 text-xs font-medium text-ink-700">
                <Wind className="h-3.5 w-3.5" aria-hidden="true" />
                Brachycephalic
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CompareToggleButton slug={breed.slug} name={breed.name} variant="full" />
          {breed.url ? (
            <a
              href={breed.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('outline', 'md')}
            >
              View on Breed Health Score
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <figure className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-card">
            <div className="aspect-[16/10] overflow-hidden bg-sand-100">
              <BreedImage slug={breed.slug} image={breed.image} alt={breed.name} priority />
            </div>
            {imageCredit ? (
              <figcaption className="px-5 py-3 text-xs text-ink-600">
                Photo: {imageCredit}
              </figcaption>
            ) : null}
          </figure>

          <section aria-labelledby="score-components-heading" className={`${cardClass} p-6`}>
            <h2 id="score-components-heading" className="text-2xl">
              What makes up the score
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              The composite score is the weighted sum of the parts below, as published by Breed
              Health Score.
            </p>
            <div className="mt-6">
              <ScoreComponents components={breed.components} />
            </div>
          </section>

          <section aria-labelledby="conditions-heading" className={`${cardClass} p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="conditions-heading" className="text-2xl">
                Hereditary conditions
              </h2>
              <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-600">
                {breed.conditions.length === 1
                  ? '1 listed'
                  : `${breed.conditions.length} listed`}
              </span>
            </div>
            <ConditionList conditions={breed.conditions} className="mt-5" />
            <p className="mt-5 text-xs leading-relaxed text-ink-600">
              This is a count of conditions reported in the dataset, so better-documented breeds tend
              to list more. The presence of a condition in this list does not mean every dog of the
              breed will develop it.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className={`${cardClass} flex flex-col items-center gap-4 p-6 text-center`}>
            <HealthScoreGauge score={breed.healthScore} grade={breed.grade} size="lg" />
            <p className="text-sm leading-relaxed text-ink-600">
              Composite breed health score (0–100). A higher score means the breed compares more
              favourably on population-level longevity, conformation and hereditary burden.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatTile
              icon={Timer}
              label="Median lifespan"
              value={formatYears(breed.medianLifespanYears)}
              tone="positive"
            />
            <StatTile icon={Ruler} label="Size" value={sizeLabel} />
            <StatTile
              icon={Wind}
              label="Brachycephalic"
              value={formatBoolean(breed.brachycephalic)}
            />
            <StatTile icon={Scale} label="Weight" value={formatWeight(breed.weightKg)} />
          </div>

          {breed.severeCount !== null ? (
            <StatTile
              icon={Activity}
              label="Life-threatening / major-welfare"
              value={formatCount(breed.severeCount)}
              hint="Conditions in the dataset classed as life-threatening or a major welfare concern."
              tone="neutral"
            />
          ) : null}

          <div className={`${cardClass} p-5`}>
            <AttributionNote />
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------------- Prev / next nav */}
      <nav aria-label="Browse breeds" className="mt-12 grid gap-4 border-t border-sand-200 pt-8 sm:grid-cols-2">
        {neighbours.previous ? (
          <Link
            to={`/breeds/${encodeURIComponent(neighbours.previous.slug)}`}
            className="group flex items-center gap-3 rounded-3xl border border-sand-200 bg-white p-4 shadow-card transition-colors hover:border-brand-blue/50"
          >
            <ChevronLeft
              className="h-5 w-5 shrink-0 text-brand-blue-strong transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span>
              <span className="block text-xs font-semibold tracking-wide text-ink-600 uppercase">
                Previous
              </span>
              <span className="mt-0.5 block font-medium text-ink-900">
                {neighbours.previous.name}
              </span>
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        {neighbours.next ? (
          <Link
            to={`/breeds/${encodeURIComponent(neighbours.next.slug)}`}
            className="group flex items-center justify-end gap-3 rounded-3xl border border-sand-200 bg-white p-4 text-right shadow-card transition-colors hover:border-brand-blue/50"
          >
            <span>
              <span className="block text-xs font-semibold tracking-wide text-ink-600 uppercase">
                Next
              </span>
              <span className="mt-0.5 block font-medium text-ink-900">{neighbours.next.name}</span>
            </span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-brand-blue-strong transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </nav>
    </div>
  )
}
