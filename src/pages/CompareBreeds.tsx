import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Check,
  Info,
  Plus,
  RefreshCw,
  Scale,
  Search as SearchIcon,
  X,
} from 'lucide-react'
import BreedCardSkeleton from '@/components/BreedCardSkeleton'
import ConditionList from '@/components/ConditionList'
import GradeBadge from '@/components/GradeBadge'
import StatePanel from '@/components/StatePanel'
import { useBreeds } from '@/hooks/useBreeds'
import { useCompare } from '@/hooks/useCompare'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatCount, formatScore, formatYearsShort, NOT_AVAILABLE } from '@/utils/format'
import { buttonClass, cardClass, fieldClass } from '@/utils/ui'
import { SIZE_LABELS, type Breed } from '@/types/breed.types'

const PICKER_PAGE_SIZE = 12

interface MetricRow {
  label: string
  render: (breed: Breed) => React.ReactNode
}

const METRICS: MetricRow[] = [
  {
    label: 'Health score',
    render: (breed) => (
      <span className="font-semibold text-ink-900">
        {formatScore(breed.healthScore)}
        <span className="font-normal text-ink-600"> / 100</span>
      </span>
    ),
  },
  {
    label: 'Health grade',
    render: (breed) => <GradeBadge grade={breed.grade} />,
  },
  {
    label: 'Median lifespan',
    render: (breed) => formatYearsShort(breed.medianLifespanYears),
  },
  {
    label: 'Size',
    render: (breed) => (breed.size ? SIZE_LABELS[breed.size] : NOT_AVAILABLE),
  },
  {
    label: 'Brachycephalic',
    render: (breed) =>
      breed.brachycephalic === null ? NOT_AVAILABLE : breed.brachycephalic ? 'Yes' : 'No',
  },
  {
    label: 'Life-threatening conditions',
    render: (breed) => formatCount(breed.severeCount),
  },
  {
    label: 'Listed conditions',
    render: (breed) => <ConditionList conditions={breed.conditions} className="min-w-52" />,
  },
]

export default function CompareBreeds() {
  const { breeds, isLoading, error, retry } = useBreeds()
  const { slugs, toggle, remove, clear, isFull, maxSelection } = useCompare()
  const [search, setSearch] = useState('')
  const [pickerCount, setPickerCount] = useState(PICKER_PAGE_SIZE)

  const debouncedSearch = useDebouncedValue(search, 200)

  const bySlug = useMemo(() => new Map(breeds.map((breed) => [breed.slug, breed])), [breeds])

  const selected = useMemo(
    () => slugs.map((slug) => bySlug.get(slug)).filter((breed): breed is Breed => Boolean(breed)),
    [slugs, bySlug],
  )

  const pickable = useMemo(() => {
    const needle = debouncedSearch.trim().toLowerCase()
    return breeds
      .filter((breed) => !slugs.includes(breed.slug))
      .filter((breed) => needle === '' || breed.name.toLowerCase().includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [breeds, slugs, debouncedSearch])

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="h-10 w-72 animate-pulse rounded-full bg-sand-200" />
        <div className="mt-10">
          <BreedCardSkeleton count={4} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <StatePanel
          tone="error"
          icon={AlertTriangle}
          title="We couldn't load breed data"
          description={error}
          action={
            <button type="button" onClick={retry} className={buttonClass('primary', 'md')}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          }
        />
      </div>
    )
  }

  const readyToCompare = selected.length >= 2

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-emerald-strong uppercase">
          Compare breeds
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Compare two or three breeds</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          Line up health scores, lifespans, sizes, brachycephalic status and listed conditions. Pick
          up to {maxSelection} breeds — the selection persists while you browse.
        </p>
      </header>

      {/* ------------------------------------------------------- Selection chips */}
      <section className={`${cardClass} mt-8 p-5 sm:p-6`} aria-label="Selected breeds">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg">
            Selected breeds{' '}
            <span className="font-sans text-sm font-normal text-ink-600">
              ({selected.length} of {maxSelection})
            </span>
          </h2>
          <button
            type="button"
            onClick={clear}
            disabled={selected.length === 0}
            className={buttonClass('ghost', 'sm', 'border border-sand-300 bg-white')}
          >
            Clear selection
          </button>
        </div>

        {selected.length === 0 ? (
          <p className="mt-4 text-sm text-ink-600">
            Nothing selected yet. Add breeds from the list below to build a comparison.
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {selected.map((breed) => (
              <li key={breed.slug}>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue-soft py-1.5 pr-2 pl-3.5 text-sm font-medium text-brand-blue-strong">
                  {breed.name}
                  <button
                    type="button"
                    onClick={() => remove(breed.slug)}
                    aria-label={`Remove ${breed.name} from comparison`}
                    className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/80"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------------------------------------------ Comparison */}
      {readyToCompare ? (
        <section className="mt-10" aria-labelledby="comparison-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="comparison-heading" className="text-2xl">
              Side-by-side comparison
            </h2>
            <Link to="/breeds" className="text-sm font-semibold text-brand-blue-strong hover:text-brand-emerald-strong">
              Browse more breeds →
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto rounded-3xl border border-sand-200 bg-white shadow-card">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of {selected.map((breed) => breed.name).join(', ')}
              </caption>
              <thead>
                <tr className="border-b border-sand-200">
                  <th scope="col" className="w-56 p-4 text-xs font-semibold tracking-wide text-ink-600 uppercase">
                    Metric
                  </th>
                  {selected.map((breed) => (
                    <th key={breed.slug} scope="col" className="p-4 align-top">
                      <Link
                        to={`/breeds/${encodeURIComponent(breed.slug)}`}
                        className="font-display text-base font-semibold text-ink-900 transition-colors hover:text-brand-blue-strong"
                      >
                        {breed.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric) => (
                  <tr key={metric.label} className="border-b border-sand-100 align-top last:border-0">
                    <th scope="row" className="p-4 text-xs font-semibold tracking-wide text-ink-600 uppercase">
                      {metric.label}
                    </th>
                    {selected.map((breed) => (
                      <td key={breed.slug} className="p-4 text-ink-800">
                        {metric.render(breed)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="p-4 text-xs font-semibold tracking-wide text-ink-600 uppercase">
                    Actions
                  </th>
                  {selected.map((breed) => (
                    <td key={breed.slug} className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/breeds/${encodeURIComponent(breed.slug)}`}
                          className="text-sm font-semibold text-brand-blue-strong hover:text-brand-emerald-strong"
                        >
                          View details
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(breed.slug)}
                          className="text-sm font-medium text-ink-600 underline decoration-dotted underline-offset-2 hover:text-ink-900"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-5 flex gap-2 rounded-3xl border border-brand-cream bg-white/80 px-5 py-4 text-sm leading-relaxed text-ink-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue-strong" aria-hidden="true" />
            <span>
              Scores and lifespans are breed-level, population figures. A higher score does not make
              one breed universally healthier than another — they differ in the conditions they are
              prone to, and individual dogs vary widely.
            </span>
          </p>
        </section>
      ) : (
        <section className="mt-10" aria-live="polite">
          <StatePanel
            icon={Scale}
            title={selected.length === 1 ? 'Add one more breed' : 'Choose two breeds to compare'}
            description={`Select at least two breeds to see them side by side. You can compare up to ${maxSelection}.`}
          />
        </section>
      )}

      {/* ---------------------------------------------------------------- Picker */}
      <section className="mt-12" aria-labelledby="picker-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="picker-heading" className="text-2xl">
            Add breeds
          </h2>
          <p className="text-sm text-ink-600">
            {isFull ? 'Selection is full — remove a breed to swap.' : `You can add ${maxSelection - selected.length} more.`}
          </p>
        </div>

        <div className="relative mt-5 max-w-md">
          <label htmlFor="compare-search" className="sr-only">
            Search breeds to compare
          </label>
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-600"
            aria-hidden="true"
          />
          <input
            id="compare-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              // A new search starts the picker list over from the first page.
              setPickerCount(PICKER_PAGE_SIZE)
            }}
            placeholder="Search breeds by name"
            autoComplete="off"
            className={`${fieldClass} pl-10`}
          />
        </div>

        {pickable.length === 0 ? (
          <p className="mt-6 text-sm text-ink-600">
            {debouncedSearch.trim() === ''
              ? 'Every breed is already in your comparison.'
              : `No breeds match “${debouncedSearch.trim()}”.`}
          </p>
        ) : (
          <>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pickable.slice(0, pickerCount).map((breed) => (
                <li
                  key={breed.slug}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-white p-4 shadow-card"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{breed.name}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-600">
                      <GradeBadge grade={breed.grade} />
                      <span>
                        {formatScore(breed.healthScore)}/100 ·{' '}
                        {formatYearsShort(breed.medianLifespanYears)}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(breed.slug)}
                    disabled={isFull}
                    className={buttonClass('outline', 'sm', 'shrink-0')}
                    aria-label={`Add ${breed.name} to comparison`}
                    title={isFull ? 'Comparison is full' : `Add ${breed.name}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add
                  </button>
                </li>
              ))}
            </ul>

            {pickable.length > pickerCount ? (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPickerCount((count) => count + PICKER_PAGE_SIZE)}
                  className={buttonClass('secondary', 'md')}
                >
                  Show more breeds
                </button>
                <p className="text-sm text-ink-600">
                  {pickable.length - pickerCount} more match your search
                </p>
              </div>
            ) : null}
          </>
        )}
      </section>

      <p className="mt-12 flex items-center gap-2 text-xs text-ink-600">
        <Check className="h-3.5 w-3.5 text-brand-emerald-strong" aria-hidden="true" />
        Your comparison selection is stored locally in this browser.
      </p>
    </div>
  )
}
