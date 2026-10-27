import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search as SearchIcon, 
  Filter, 
  SortAlphaDown, 
  SortAlphaUp, 
  TrendingUp,
  Loader2,
  X,
  RefreshCw,
  Eye,
  Heart,
  PawPrint,
  ChartBar,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { fetchBreedsList, fetchBreedDetail, clearBreedDetailCache, getBreedCount } from '@/services/api.service'
import type { BreedListItem, BreedFilters, SortOption, GradeColors, ApiError } from '@/types/api.types'

const SIZES = ['All', 'tiny', 'small', 'medium', 'large', 'giant']
const GRADES = ['All', 'A', 'B', 'C', 'D', 'E']

export default function BreedExplorer() {
  const [breeds, setBreeds] = useState<BreedListItem[]>([])
  const [filteredBreeds, setFilteredBreeds] = useState<BreedListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [filters, setFilters] = useState<BreedFilters>({
    searchTerm: '',
    size: undefined,
    healthGrade: undefined,
    brachycephalic: undefined,
  })
  const [sort, setSort] = useState<SortOption>('health-score-desc')
  const navigate = useNavigate()

  // Fetch breeds from API
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    fetchBreedsList()
      .then(data => {
        setBreeds(data)
        applyFiltersAndSort()
      })
      .catch(err => {
        console.error('Failed to fetch breeds:', err)
        setError({
          message: err instanceof Error ? err.message : 'Failed to load breed data',
          type: 'network',
        })
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let result = [...breeds]

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      result = result.filter(breed => 
        breed.breed.toLowerCase().includes(term) || 
        breed.slug.toLowerCase().includes(term)
      )
    }

    // Size filter
    if (filters.size && filters.size !== 'All') {
      result = result.filter(breed => breed.size === filters.size)
    }

    // Health grade filter
    if (filters.healthGrade && filters.healthGrade !== 'All') {
      result = result.filter(breed => breed.grade === filters.healthGrade)
    }

    // Brachycephalic filter
    if (filters.brachycephalic !== undefined) {
      result = result.filter(breed => breed.brachycephalic === filters.brachycephalic)
    }

    // Sorting
    const [field, direction] = sort.split('-') as [keyof BreedListItem, 'asc' | 'desc']
    const ascending = direction === 'accents'

    result.sort((a, b) => {
      let aVal: any = a[field]
      let bVal: any = b[field]

      // Handle special sorting cases
      if (field === 'health-score-desc' || field === 'health-score-asc') {
        aVal = a.health_score
        bVal = b.health_score
      } else if (field === 'lifespan-desc' || field === 'lifespan-asc') {
        aVal = a.median_lifespan_years
        bVal = b.median_lifespan_years
      } else if (field === 'alphabetical') {
        aVal = a.breed.toLowerCase()
        bVal = b.breed.toLowerCase()
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return ascending ? aVal - bVal : bVal - aVal
      }
      return ascending ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })

    setFilteredBreeds(result)
  }, [breeds, filters, sort])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      size: undefined,
      healthGrade: undefined,
      brachycephalic: undefined,
    })
    setSort('health-score-desc')
  }, [])

  // Grade color
  const gradeColors: Record<string, GradeColors> = {
    A: { background: '#22c55e', text: 'white', border: '#16a34a' },
    B: { background: '#84cc16', text: 'white', border: '#65a30d' },
    C: { background: '#eab308', text: '#1f2937', border: '#a88c0b' },
    D: { background: '#f59e0b', text: '#1f2937', border: '#d97706' },
    E: { background: '#ef4444', text: 'white', border: '#dc2626' },
  }

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value })
  }, [filters])

  const handleSizeChange = useCallback((size: string) => {
    setFilters({ ...filters, size: size === 'All' ? undefined : size })
  }, [filters])

  const handleGradeChange = useCallback((grade: string) => {
    setFilters({ ...filters, healthGrade: grade === 'All' ? undefined : grade })
  }, [filters])

  const handleBrachychange = useCallback((value: boolean | undefined) => {
    setFilters({ ...filters, brachycephalic: value })
  }, [filters])

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort)
  }, [])

  // Navigate to breed details
  const viewBreedDetails = useCallback((slug: string) => {
    navigate(`/breeds/${slug}`)
  }, [navigate])

  // Empty state
  const emptyState = () => (
    <div className="empty-state">
      <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium text-gray-600">No breeds found</h3>
      <p className="text-gray-500 mt-2">
        Try adjusting your search or filters. The API has {breeds.length} breeds available.
      </p>
    </div>
  )

  // Error state
  const errorState = () => (
    <div>
      <p className="text-red-600 text-sm">{error?.message}</p>
      <button
        onClick={() => {
          fetchBreedsList()
            .then(data => {
              setBreeds(data)
              applyFiltersAndSort()
            })
            .catch(err => {
              console.error('Retry failed:', err)
              setError({
                message: err instanceof Error ? err.message : 'Failed to reload data',
                type: 'network',
              })
            })
        }}
        className="mt-2 btn-outline text-sm font-medium"
      >
        Retry
      </button>
    </div>
  )

  if (isLoading && breeds.length === 0) {
    return (
      <div className="min-h-screen py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-medium text-brand-blue">Loading breeds...</h3>
          <p className="text-gray-600 mt-2">
            Fetching data from the Dog Breed Health API. Please wait.
          </p>
        </div>
      </div>
    )
  }

  if (error && filteredBreeds.length === 0) {
    return <errorState />
  }

  if (filteredBreeds.length === 0) {
    return <emptyState />
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header with controls */}
      <header className="px-6 py-4 md:py-6 border-b border-brand-blue/20 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="col-span-2 lg:col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search breeds..."
                value={filters.searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm"
                aria-label="Search breeds"
              />
            </div>
          </div>

          {/* Size Filter */}
          <div className="col-span-2 lg:col-span-2">
            <select
              value={filters.size === undefined ? 'All' : filters.size}
              onChange={(e) => handleSizeChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm appearance-none"
              aria-label="Filter by size"
            >
              <option value="All">Size</option>
              {SIZES.map((size, index) => (
                <option key={size} value={size}>
                  {size === 'All' ? 'All sizes' : size.charAt(0).toUpperCase() + size.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Health Grade Filter */}
          <div className="col-span-2 lg:col-span-2">
            <select
              value={filters.healthGrade === undefined ? 'All' : filters.healthGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm appearance-none"
              aria-label="Filter by health grade"
            >
              <option value="All">Grade</option>
              {GRADES.map((grade, index) => (
                <option key={grade} value={grade}>
                  {grade === 'All' ? 'All grades' : grade}
                </option>
              ))}
            </select>
          </div>

          {/* Brachycephalic Filter */}
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brachycephalic === undefined ? false : !filters.brachycephalic}
                onChange={(e) => handleBrachychange(e.target.checked)}
                className="rounded border-gray-300 focus:ring-brand-blue focus:ring-offset-white"
                aria-label="Filter by brachycephalic status"
              />{' '}
              Brachycephalic
            </label>
          </div>

          {/* Sort */}
          <div className="col-span-2 lg:col-span-2">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm appearance-none"
              aria-label="Sort by"
            >
              <option value="health-score-desc">Sort by Health Score (high ↓)</option>
              <option value="health-score-asc">Sort by Health Score (low ↑)</option>
              <option value="lifespan-desc">Sort by Lifespan (long ↓)</option>
              <option value="lifespan-asc">Sort by Lifespan (short ↑)</option>
              <option value="alphabetical">Sort Alphabetical</option>
            </select>
          </div>

          {/* Clear filters */}
          <div className="col-span-2 lg:col-span-2">
            <button
              onClick={clearFilters}
              className="w-full rounded-lg border border-brand-blue text-brand-blue text-sm font-medium px-4 py-2 hover:bg-brand-blue/10 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </header>

      {/* Breed Grid */}
      <main className="py-6 pb-12 md:py-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Empty state */}
          {filteredBreeds.length === 0 && !error && (
            <div className="empty-state">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-600">No breeds found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filters. The API has {breeds.length} breeds available.
              </p>
            </div>
          )}

          {/* Breed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBreeds.map((breed) => (
              <Link
                key={breed.slug}
                to={`/breeds/${breed.slug}`}
                className="card hover:border-brand-blue/30 transition-colors cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                <div className="relative overflow-hidden rounded-lg">
                  {/* Breed Image */}
                  {breed.image?.url ? (
                    <img
                      src={breed.image.url}
                      alt={breed.breed}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-48 bg-gradient-to-br from-brand-blue/10 to-transparent flex items-center justify-center"
                      style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY0IDIwIiBmaWxsPSJub25lIiBhdHRyPSJzdDAiPgo8cGF0aCBkPSJNMCAwaDEwaDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS13aWR0aD0iMSI+SW5xdWFkeTwvdGFnPjwvc3ZnPg=')" }}
                      className="relative"
                    />
                  )}
                  
                  {/* Health Score Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={gradeColors[breed.grade]?.background ? `bg-${breed.grade} text-white` : `text-gray-700`} px-2 py-1 rounded text-xs font-medium>
                      {breed.grade} ({breed.health_score})
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 line-clamp-full">{breed.breed}</h3>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <PawPrint className="h-4 w-4" />
                    <span>{breed.size}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {breed.conditions.slice(0, 3).map((cond, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{cond}</span>
                    ))}
                    {breed.conditions.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">+{breed.conditions.length - 3} more</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more or pagination */}
          {filteredBreeds.length < breeds.length && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Showing {filteredBreeds.length} of {breeds.length} breeds
              </p>
            </div>
          )}

          {/* Empty state when all filters remove everything */}
          {filteredBreeds.length === 0 && error && (
            <div className="empty-state pt-12">
              <X className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-medium text-gray-600">Error loading data</h3>
              <p className="text-gray-500 mt-2">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 btn-outline"
              >
                Reload
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}