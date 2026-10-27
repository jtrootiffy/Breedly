import { useState } from 'react'
import { Link, useNavigation } from 'react-router-dom'
import { 
  PawPrint, 
  Search, 
  Info, 
  Heart, 
  Shield,
  TrendingUp
} from 'lucide-react'

import { fetchBreedsList, getBreedCount } from '@/services/api.service'
import type { BreedListItem } from '@/types/api.types'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/breeds', label: 'Explore Breeds' },
  { path: '/about', label: 'About' },
]

export default function LandingPage() {
  const [breedsCount, setBreedsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    fetchBreedsList()
      .then(breeds => {
        setBreedsCount(breeds.length)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigation.navigate(NAV_LINKS[1].path)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Navigation */}
      <nav className="border-b border-brand-blue/20 bg-brand-cream/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-brand-emerald" />
            <span className="text-xl font-bold text-brand-blue">Breedly</span>
          </div>
          
          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`
                  text-sm font-medium transition-colors 
                  ${navigation.state.location.pathname === link.path 
                    ? 'text-brand-blue underline' 
                    : 'text-gray-700 hover:text-brand-blue'}
                `}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                className="stroke-2 stroke-brand-blue" 
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-20 pb-12 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Content */}
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-blue md:mb-4 lg:mb-6">
              Every breed has a story. Know their health.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 text-brand-cream md:mt-4 lg:mt-6 max-w-2xl mx-auto leading-relaxed">
              Breedly helps you explore breed health scores, average lifespan estimates, breed characteristics, and hereditary conditions. 
              Our data-driven insights come from a study of 155 dog breeds, giving you the knowledge to make informed decisions 
              about your future companion—no account required.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/breeds" className="btn-primary text-lg font-medium">
                Get Started
              </Link>
              <Link to="/breeds" className="btn-outline text-lg font-medium">
                Explore Breeds
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="mt-12 md:mt-24 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="aspect-video rounded-lg overflow-hidden bg-brand-blue/10">
                <img 
                  src="https://images.unsplash.com/photo-1518717757254-5d0faf1ce7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Happy golden retriever enjoying the outdoors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-brand-cream to-transparent">
                <p className="text-sm text-gray-600">
                  Photo: Unsplash
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Know What Matters Section */}
      <main className="py-20 pb-12 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Health Scores Card */}
            <div className="card p-6 rounded-xl border-l-4 bg-white border-brand-blue/30 hover:border-brand-blue/50 transition-colors">
              <div className="flex items-start gap-4">
                <Heart className="h-6 w-6 text-brand-emerald flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-blue">Health Scores</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Composite health scores comparing 155 breeds on conformation, longevity, and burden of hereditary conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Lifespan Insights Card */}
            <div className="card p-6 rounded-xl border-l-4 bg-white border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-emerald-600">Lifespan Insights</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Median lifespan data from McMillan et al. (2024) — the largest study of dog longevity to date.
                  </p>
                </div>
              </div>
            </div>

            {/* Hereditary Conditions Card */}
            <div className="card p-6 rounded-xl border-l-4 bg-white border-gray-300 hover:border-brand-blue/50 transition-colors">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">Hereditary Conditions</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Understanding common health conditions by breed to help you prepare and ask the right questions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Find Your Perfect Companion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-blue md:text-4xl mb-6">
              Find Your Perfect Companion
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Take the first step toward a happier, healthier life together. 
              Browse our complete breed catalog to find the right match for your lifestyle.
            </p>
            <Link to="/breeds" className="btn-primary text-lg font-medium">
              Start Breed Exploration
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-600">
            <strong>Disclaimer:</strong> Breed-level health data is based on population statistics and does not predict 
            the health of an individual dog. These estimates are for informational purposes only and should not replace 
            professional veterinary advice. Always consult with a qualified veterinarian for specific health concerns.
          </p>
        </div>
      </footer>

      {/* Footer with API Attribution */}
      <footer className="py-6 bg-brand-cream border-t border-brand-blue/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <p>
              Breed health data provided by{' '}
              <a 
                href="https://breedhealthscore.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-brand-blue hover:no-underline"
              >
                Breed Health Score
              </a>
              .
            </p>
            <a 
              href="https://breedhealthscore.com/methodology/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-brand-blue hover:no-underline"
            >
              Methodology
            </a>
            ·
            <span className="ml-2 text-gray-500">
              {breedsCount} breeds{' '}
              <span className="font-medium" id="breed-count-text">
                {isLoading ? 'loading...' : breedsCount}
              </span>
              {
                breedsCount !== 155 ? '(data may vary)' : ''
              }
            </span>
          </p>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
            <a 
              href="https://breedhealthscore.com/developers/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              API Docs
            </a>
            <a 
              href="https://www.nature.com/articles/s41598-023-50458-w" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Source Study
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}