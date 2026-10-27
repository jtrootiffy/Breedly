import { Link, useLocation } from 'react-router-dom'
import { Info } from 'lucide-react'

export default function About() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="prose lg:prose-xl max-w-none">
          <h1 className="text-4xl font-bold text-brand-blue mb-8">
            About Breedly
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-blue mb-4">
              Our Mission
            </h2>
            <p>
              At Breedly, we believe that better knowledge leads to healthier, happier dogs. 
              Our platform provides data-driven insights into dog breed health scores, median 
              lifespans, and hereditary conditions to help you make informed decisions 
              about your future canine companion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-blue mb-4">
              Data Source
            </h2>
            <p>
              Breed health data provided by <a 
                href="https://breedhealthscore.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-brand-blue hover:text-brand-emerald"
              >
                Breed Health Score
              </a>. 
              Our data is sourced from McMillan, K.M. et al. (2024) "Longevity of companion dog breeds", 
              Scientific Reports (584,734 UK dogs). All data is licensed under CC BY 4.0.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Largest study of dog longevity to date
              </li>
              <li>
                155 dog breeds covered
              </li>
              <li>
                Data on health scores, median lifespans, and hereditary conditions
              </li>
              <li>
                Composite scoring system evaluating conformation, longevity, and burden of conditions
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-blue mb-4">
              Disclaimer
            </h2>
            <p>
              The breed-level health data presented on this platform is based on population statistics 
              and does not predict the health of an individual dog. These estimates are for informational 
              purposes only and should not replace professional veterinary advice. Always consult with 
              a qualified veterinarian for specific health concerns about any dog.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-brand-blue mb-4">
              Contact & Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700">API</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    <a 
                      href="https://breedhealthscore.com/api/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue underline hover underline"
                    >
                      API Documentation
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://breedhealthscore.com/methodology/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue underline hover underline"
                    >
                      Methodology
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Resources</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    <a 
                      href="https://www.nature.com/articles/s41598-023-50458-w" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue underline hover underline"
                    >
                      Source Study: McMillan et al. 2024
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://creativecommons.org/licenses/by/4.0/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue underline hover underline"
                    >
                      CC BY 4.0 License
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Navigation</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    <Link to="/" className="text-brand-blue underline hover underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/breeds" className="text-brand-blue underline hover underline">
                      Breed Explorer
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare" className="text-brand-blue underline hover underline">
                      Breed Comparison
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}