import { useParams, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  PawPrint,
  Heart,
  TrendingUp,
  Shield,
  Eye,
  RefreshCw,
  X,
  ArrowLeft,
  Info,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { fetchBreedDetail } from '@/services/api.service'
import type { BreedDetail, BreedFilters } from '@/types/api.types'

export default function BreedDetails() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [breed, setBreed] = useState<BreedDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<{ message: string } | null>(null)

  useEffect(() => {
    if (!slug) {
      setError({ message: 'No breed slug specified' })
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    fetchBreedDetail(slug)
      .then(data => {
        setBreed(data)
      })
      .catch(err => {
        console.error(`Failed to fetch breed detail for ${slug}:`, err)
        setError({
          message: err instanceof Error ? err.message : 'Failed to load breed details',
        })
      })
      .finally(() => setIsLoading(false))
  }, [slug])

  // Determine previous and next breeds from the list
  // We'll use a simple approach: navigate based on alphabetical order
  const getNavLinks = useCallback((allBreeds: BreedListItem[]) => {
    if (!slug || !allBreeds) return null
    
    const breedMap = new Map(allBreeds.map(b => [b.slug, b.breed]))
    const currentIndex = allBreeds.findIndex(b => b.slug === slug)
    
    if (currentIndex === -1) return null
    
    const prevBreed = allBreeds[currentIndex - 1]
    const nextBreed = allBreeds[currentIndex + 1]
    
    return {
      prev: prevBreed ? { slug: prevBreed.slug, name: prevBreed.breed } : null,
      next: nextBreed ? { slug: nextBreed.slug, name: nextBreed.breed } : null,
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse rounded-lg h-64 bg-brand-blue/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 mx-auto animate-spin" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-brand-blue">Loading breed details...</h3>
            <p className="text-gray-600 mt-2">
              Fetching data for {slug ? slug.replace(/-/g, ' ') : 'this breed'}...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div>
            <X className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-medium text-gray-600">Error loading breed</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.history.back()}
              className="btn-outline"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!breed) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-gray-600">No breed data available.</p>
        </div>
      </div>
    )
  }

  // Get navigation links
  useEffect(() => {
    fetchBreedsList().then(breeds => {
      // Nav links are computed on render below
    })
  }, [])

  // Grade color
  const gradeColors: Record<string, { bg: string; text: string }> = {
    A: { bg: '#22c55e', text: 'white' },
    B: { bg: '#84cc16', text: 'white' },
    C: { bg: '#eab308', text: '#1f2937' },
    D: { bg: '#f59e0b', text: '#1f2937' },
    E: { bg: '#ef4444', text: 'white' },
  }

  // Format size
  const sizeLabels: Record<string, string> = {
    tiny: 'Tiny',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    giant: 'Giant',
  }

  // Format brachycephalic
  const brachyLabel = breed.brachycephalic ? 'Yes (short snout)' : 'No'

  // Calculate component percentages
  const totalComponents = (breed.components.longevity + breed.components.conformation + breed.components.burden)
  const longevityPct = totalComponents > 0 ? Math.round((breed.components.longevity / totalComponents) * 100) : 0
  const conformationPct = totalComponents > 0 ? Math.round((breed.components.conformation / totalComponents) * 100) : 0
  const burdenPct = totalComponents > 0 ? Math.round((breed.components.burden / totalComponents) * 100) : 0

  // Determine previous/next breeds
  // navLinks computed inline in return

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header with back navigation */}
      <header className="border-b border-brand-blue/20 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          {/* Back button */}
          <button
            onClick={() => navigate('/breeds')}
            className="flex items-center gap-2 text-brand-blue hover underline"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Explore Breeds
          </button>
          
          {/* Breed name */}
          <span className="ml-auto text-xl font-bold text-brand-blue">
            {breed.breed}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero image and score */}
          <div className="mb-12">
            {breed.image?.url ? (
              <img
                src={breed.image.url}
                alt={breed.breed}
                className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-64 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY0IDIwIiBmaWxsPSJub25lIiBhdHRyPSJzdDAiPgo8cGF0aCBkPSJNMCAwaDEwaDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS13aWR0aD0iMSI+SW5xdWFkeTwvdGFnPjwvc3ZnPg=')" }}
                className="relative"
              />
            )}
            
            {/* Health Score Circle */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {breed.health_score}
              </div>
              <p className="text-sm text-gray-500">Health Score</p>
              <p className="text-xs opacity-70">out of 100</p>
            </div>
            
            {/* Grade Badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className={gradeColors[breed.grade]?.bg ? `bg-${breed.grade} text-white` : `text-gray-600`} px-3 py-1 rounded text-xs font-medium>
                {breed.grade}
              </span>
              <span className="text-xs opacity-70">grade</span>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Median Lifespan */}
            <div className="card p-4 rounded-xl border-l-4 bg-white border-emerald-500/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Median Lifespan</p>
                  <p className="text-2xl font-bold text-emerald-600">{breed.median_lifespan_years} years</p>
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="card p-4 rounded-xl border-l-4 bg-white border-brand-blue/30">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-brand-blue" />
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="text-lg font-medium">{sizeLabels[breed.size] || breed.size}</p>
                </div>
              </div>
            </div>

            {/* Brachycephalic */}
            <div className="card p-4 rounded-xl border-l-4 bg-white border-emerald-500">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Brachycephalic</p>
                  <p className="text-lg font-medium text-emerald-600">{brachyLabel}</p>
                </div>
              </div>
            </div>

            {/* Health Score Components */}
            <div className="card p-4 rounded-xl border-l-4 bg-white border-gray-300">
              <div className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Score Components</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Longevity</p>
                    <div className="mt-1 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${longevityPct > 0 ? 'bg-emerald-600' : 'bg-gray-200'} ${longevityPct > 0 ? 'text-emerald-600 text-xs font-medium' : ''}`}
                        style={{ width: `${longevityPct}%` }}
                      />
                      <span className="text-xs {longevityPct > 0 ? 'text-emerald-600' : 'text-gray-500'}">
                        {longevityPct}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conformation</p>
                    <div className="mt-1 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${conformationPct > 0 ? 'bg-brand-blue' : 'bg-gray-200'} ${conformationPct > 0 ? 'text-brand-blue text-xs font-medium' : ''}`}
                        style={{ width: `${conformationPct}%` }}
                      />
                      <span className="text-xs {conformationPct > 0 ? 'text-brand-blue' : 'text-gray-500'}">
                        {conformationPct}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Burden</p>
                    <div className="mt-1 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${burdenPct > 0 ? 'bg-fiber' : 'bg-gray-200'} ${burdenPct > 0 ? 'text-fiber' : ''}`}
                        style={{ width: `${burdenPct}%` }}
                      />
                      <span className="text-xs {burdenPct > 0 ? 'text-fiber' : 'text-gray-500'}">
                        {burdenPct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hereditary Conditions Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brand-blue mb-6">Hereditary Conditions</h2>
            
            {breed.conditions.length === 0 ? (
              <p className="text-gray-600">No significant hereditary conditions identified for this breed.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {breed.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className={
                      `bg-white p-3 rounded-lg border border-emerald-100 text-emerald-800 text-sm flex items-center gap-2`
                    }
                  >
                    <Eye className="h-4 w-4" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Breed Characteristics */}
          <section>
            <h2 className="text-2xl font-bold text-brand-blue mb-6">Breed Characteristics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight */}
              <div className="card p-5 rounded-xl border-l-4 bg-white border-gray-200">
                <p className="text-sm text-gray-500">Weight</p>
                <p className="text-2xl font-medium">{breed.weight_kg || 'Not available'}</p>
              </div>
              
              {/* Other details */}
              <div className="card p-5 rounded-xl border-l-4 bg-white border-gray-200">
                <p className="text-sm text-gray-500">URL</p>
                <a
                  href={breed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue underline hover underline"
                >
                  {breed.url}
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer with navigation info */}
      <footer className="py-6 bg-brand-cream border-t border-brand-blue/20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-700">
            Data: Breed Health Score • McMillan et al. (2024) • CC BY 4.0
          </p>
        </div>
      </footer>
    </div>
  )
}