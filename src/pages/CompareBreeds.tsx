import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  PawPrint,
  Heart,
  ChartBar,
  XMark,
  Check,
  Copy,
  TrendingUp,
  Disable,
  Enable
} from 'lucide-react'

import { fetchBreedsList } from '@/services/api.service'
import type { BreedListItem, SelectedBreed, BreedFilters } from '@/types/api.types'

export default function CompareBreeds() {
  const [allBreeds, setAllBreeds] = useState<BreedListItem[]>([])
  const [selectedBreeds, setSelectedBreeds] = useState<SelectedBreed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch breeds on mount
  useEffect(() => {
    setIsLoading(true)
    fetchBreedsList()
      .then(data => setAllBreeds(data))
      .catch(err => console.error('Failed to fetch breeds for comparison:', err))
      .finally(() => setIsLoading(false))
  }, [])

  // Parse selected breeds from URL query or state
  const parsedSelected = location.state?.selectedBreeds 
    ? location.state.selectedBreeds 
    : []

  // Sync selected breeds state with URL
  useEffect(() => {
    // Could persist to URL query params here if needed
  }, [selectedBreeds, location.state])

  // Grade color
  const gradeColors: Record<string, { bg: string; text: string }> = {
    A: { bg: '#22c55e', text: 'white' },
    B: { bg: '#84cc16', text: 'white' },
    C: { bg: '#eab308', text: '#1f2937' },
    D: { bg: '#f59e0b', text: '#1f2937' },
    E: { bg: '#ef4444', text: 'white' },
  }

  const sizeLabels: Record<string, string> = {
    tiny: 'Tiny',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    giant: 'Giant',
  }

  // Add breed to comparison (max 3)
  const addBreed = (breed: BreedListItem) => {
    // Check if already selected
    if (selectedBreeds.some(s => s.slug === breed.slug)) {
      return
    }

    const newSelection: SelectedBreed = {
      slug: breed.slug,
      name: breed.breed,
      healthScore: breed.health_score,
      grade: breed.grade,
      medianLifespan: breed.median_lifespan_years,
      size: sizeLabels[breed.size] || breed.size,
      brachycephalic: breed.brachycephalic,
      conditions: breed.conditions,
    }

    setSelectedBreeds(prev => {
      // Max 3 breeds
      if (prev.length >= 3) {
        // Replace the first one or show a message
        // For now, replace the oldest/first selection
        return [...prev.slice(1), newSelection]
      }
      return [...prev, newSelection]
    })
  }

  // Remove breed from comparison
  const removeBreed = (slug: string) => {
    setSelectedBreeds(prev => prev.filter(s => s.slug !== slug))
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedBreeds([])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-xl mx-auto text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-medium text-brand-blue">Loading breeds...</h3>
            <p className="text-gray-600 mt-2">
              Fetching data for comparison. Please wait.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (allBreeds.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="empty-state">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-600">No breeds available</h3>
            <p className="text-gray-500 mt-2">
              Unable to load breed data for comparison.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If no breeds selected, show the selector
  if (selectedBreeds.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-brand-blue mb-8">Compare Dog Breeds</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Select 2-3 breeds to compare their health scores, lifespans, sizes, and hereditary conditions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBreeds.slice(0, 10).map((breed) => (
              <div
                key={breed.slug}
                className="card p-6 border-l-4 border-brand-blue/30 hover:border-brand-blue/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <PawPrint className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{breed.breed}</h3>
                    <p className="text-sm text-gray-500">Health Score: {breed.health_score} ({breed.grade})</p>
                  </div>
                </div>
                <button
                  onClick={() => addBreed(breed)}
                  className="mt-4 w-full btn-primary text-sm font-medium"
                >
                  Add to Compare
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // We have selected breeds - show comparison
  if (selectedBreeds.length < 2) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-blue mb-2">Select More Breeds</h2>
            <p className="text-gray-600 mb-4">
              Please select at least 2 breeds to compare.
            </p>
            {selectedBreeds.length > 0 && (
              <p className="text-gray-500">
                You've selected {selectedBreeds.length} breed{selectedBreeds.length > 1 ? 's' : ''}. 
                {selectedBreeds.length > 0 ? 'Select one more breed to compare.' : ''}
              </p>
            )}
            <div className="mt-6">
              {selectedBreeds.map((breed, i) => (
                <div key={i} className="bg-brand-blue/10 p-3 rounded mb-2">
                  <span className="font-medium text-brand-blue">{breed.name}</span>
                  <button
                    onClick={() => removeBreed(breed.slug)}
                    className="text-brand-blue text-sm hover underline ml-auto"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <Link to="/breeds" className="mt-6 btn-primary">
              Go to Breed Explorer
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Compute comparison table data
  const metrics = [
    { label: 'Health Score', getValue: (b: SelectedBreed) => b.healthScore },
    { label: 'Median Lifespan', getValue: (b: SelectedBreed) => `${b.medianLifespan} years` },
    { label: 'Size', getValue: (b: SelectedBreed) => b.size },
    { label: 'Brachycephalic', getValue: (b: SelectedBreed) => b.brachycephalic ? 'Yes' : 'No' },
    { label: 'Hereditary Conditions', getValue: (b: SelectedBreed) => b.conditions.slice(0, 3).join(', ') + (b.conditions.length > 3 ? ` +${b.conditions.length - 3} more` : '') },
  ]

  // Build table rows
  const tableRows = metrics.map((metric, mIdx) => (
    <tr key={mIdx}>
      <td className="p-4 font-medium text-gray-700">{metric.label}</td>
      {selectedBreeds.map((breed, bIdx) => (
        <td 
          key={bIdx} 
          className="p-4 text-center"
        >
          {metric.getValue(breed)}
        </td>
      ))}
    </tr>
  ))

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-brand-blue mb-4">
            Breed Comparison
          </h2>
          <p className="text-lg text-gray-600">
            Compare {selectedBreeds.map(b => b.name).join(', ')}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Metric
                </th>
                {selectedBreeds.map((_, idx) => (
                  <th 
                    key={idx} 
                    className="p-4 text-left text-sm font-medium"
                  >
                    {selectedBreeds[idx].name}
                    <span className="text-xs font-medium">
                      {selectedBreeds[idx].grade}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <strong>Important:</strong> This comparison is based on breed-level health scores and population data. 
            Individual dogs may vary significantly. Always consult with a qualified veterinarian for specific health 
            concerns about any dog.
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={clearSelections}
            className="flex-1 btn-outline"
          >
            Clear Selection
          </button>
          <button
            onClick={() => navigate('/', { state: { from: '/compare' } })}
            className="flex-1 btn-primary"
          >
            Back to Breeds
          </button>
        </div>
      </div>
    </div>
  )
}