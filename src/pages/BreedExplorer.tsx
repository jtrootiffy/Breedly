import { useMemo, useState } from 'react'
import { AlertTriangle, RefreshCw, Search as SearchIcon, SearchX, SlidersHorizontal, X } from 'lucide-react'
import BreedCard from '@/components/BreedCard'
import BreedCardSkeleton from '@/components/BreedCardSkeleton'
import StatePanel from '@/components/StatePanel'
import { useBreeds } from '@/hooks/useBreeds'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { filterBreeds, hasActiveFilters } from '@/utils/filterBreeds'
import { pluralize } from '@/utils/format'
import { buttonClass, cardClass, fieldClass } from '@/utils/ui'
import {
  BREED_SIZES,
  DEFAULT_FILTERS,
  HEALTH_GRADES,
  SIZE_LABELS,
  type BreedFilters,
  type SortKey,
} from '@/types/breed.types'

const PAGE_SIZE = 12

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'health-desc', label: 'Health score · high to low' },
  { value: 'health-asc', label: 'Health score · low to high' },
  { value: 'lifespan-desc', label: 'Median lifespan · longest first' },
  { value: 'lifespan-asc', label: 'Median lifespan · shortest first' },
  { value: 'name-asc', label: 'Name · A to Z' },
  { value: 'name-desc', label: 'Name · Z to A' },
]

export default function BreedExplorer() {
  const { breeds, isLoading, error, retry } = useBreeds()
  const [filters, setFilters] = useState<BreedFilters>(DEFAULT_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const debouncedSearch = useDebouncedValue(filters.search, 250)

  const effectiveFilters = useMemo<BreedFilters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )

  const results = useMemo(() => filterBreeds(breeds, effectiveFilters), [breeds, effectiveFilters])

  const visibleBreeds = results.slice(0, visibleCount)
  const hasMore = results.length > visibleBreeds.length
  const filtersActive = hasActiveFilters(filters)

  const update = <K extends keyof BreedFilters>(key: K, value: BreedFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }))
    // Any filter or sort change starts the list over from the first page.
    setVisibleCount(PAGE_SIZE)
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-emerald-strong uppercase">
          Breed explorer
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Explore the breed catalog</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          Search and filter every breed in the dataset by size, grade and brachycephalic status. Data
          is loaded live from the Breed Health Score API.
        </p>
      </header>

      {/* ------------------------------------------------------------- Controls */}
      <section
        aria-label="Search, filter and sort breeds"
        className={`${cardClass} mt-8 p-5 sm:p-6`}
      >
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label
              htmlFor="breed-search"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-600 uppercase"
            >
              Search by name
            </label>
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-600"
                aria-hidden="true"
              />
              <input
                id="breed-search"
                type="search"
                value={filters.search}
                onChange={(event) => update('search', event.target.value)}
                placeholder="e.g. Labrador, Beagle, Poodle"
                className={`${fieldClass} pr-10 pl-10`}
                autoComplete="off"
              />
              {filters.search !== '' ? (
                <button
                  type="button"
                  onClick={() => update('search', '')}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-sand-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="filter-size"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-600 uppercase"
            >
              Size
            </label>
            <select
              id="filter-size"
              value={filters.size}
              onChange={(event) => update('size', event.target.value as BreedFilters['size'])}
              className={fieldClass}
            >
              <option value="all">All sizes</option>
              {BREED_SIZES.map((size) => (
                <option key={size} value={size}>
                  {SIZE_LABELS[size]}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="filter-grade"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-600 uppercase"
            >
              Health grade
            </label>
            <select
              id="filter-grade"
              value={filters.grade}
              onChange={(event) => update('grade', event.target.value as BreedFilters['grade'])}
              className={fieldClass}
            >
              <option value="all">All grades</option>
              {HEALTH_GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="filter-brachy"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-600 uppercase"
            >
              Flat-faced
            </label>
            <select
              id="filter-brachy"
              value={filters.brachycephalic}
              onChange={(event) =>
                update('brachycephalic', event.target.value as BreedFilters['brachycephalic'])
              }
              className={fieldClass}
            >
              <option value="all">Any</option>
              <option value="yes">Brachycephalic only</option>
              <option value="no">Non-brachycephalic only</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="sort-by"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-600 uppercase"
            >
              Sort by
            </label>
            <select
              id="sort-by"
              value={filters.sort}
              onChange={(event) => update('sort', event.target.value as SortKey)}
              className={fieldClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-5">
          <p className="text-sm text-ink-600" aria-live="polite">
            {isLoading ? (
              'Loading breeds…'
            ) : error ? (
              'Breed data could not be loaded.'
            ) : (
              <>
                Showing{' '}
                <strong className="font-semibold text-ink-800">
                  {visibleBreeds.length}
                </strong>{' '}
                of <strong className="font-semibold text-ink-800">{results.length}</strong> matching{' '}
                {results.length === 1 ? 'breed' : 'breeds'}
                {results.length !== breeds.length ? ` (of ${pluralize(breeds.length, 'breed')})` : ''}
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-xs text-ink-600 sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Filters apply to the fetched dataset in your browser.
            </span>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive}
              className={buttonClass('ghost', 'sm', 'border border-sand-300 bg-white')}
            >
              Clear all filters
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Results */}
      <section className="mt-8" aria-label="Breed results">
        {isLoading ? <BreedCardSkeleton count={PAGE_SIZE} /> : null}

        {!isLoading && error ? (
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
        ) : null}

        {!isLoading && !error && results.length === 0 ? (
          <StatePanel
            icon={SearchX}
            title="No breeds match your filters"
            description="Try a different search term, or clear the filters to see the whole catalog again."
            action={
              <button type="button" onClick={clearFilters} className={buttonClass('secondary', 'md')}>
                Clear all filters
              </button>
            }
          />
        ) : null}

        {!isLoading && !error && results.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleBreeds.map((breed) => (
                <li key={breed.slug}>
                  <BreedCard breed={breed} />
                </li>
              ))}
            </ul>

            {hasMore ? (
              <div className="mt-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className={buttonClass('secondary', 'lg')}
                >
                  Load more breeds
                </button>
                <p className="text-sm text-ink-600">
                  {results.length - visibleBreeds.length} more to show
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  )
}
