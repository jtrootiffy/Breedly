import { Link } from 'react-router-dom'
import { ExternalLink, PawPrint } from 'lucide-react'
import AttributionNote from '@/components/AttributionNote'

const FOOTER_LINKS = [
  { to: '/breeds', label: 'Explore breeds' },
  { to: '/compare', label: 'Compare breeds' },
  { to: '/about', label: 'About Breedly' },
]

const EXTERNAL_LINKS = [
  { href: 'https://breedhealthscore.com', label: 'Breed Health Score' },
  { href: 'https://breedhealthscore.com/methodology/', label: 'Methodology' },
  { href: 'https://breedhealthscore.com/developers/', label: 'API documentation' },
  {
    href: 'https://www.nature.com/articles/s41598-023-50458-w',
    label: 'McMillan et al. 2024 (study)',
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-sand-200 bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-emerald text-white">
              <PawPrint className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-semibold text-ink-900">Breedly</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-600">
            A breed-level health explorer built on published population data. Lifespan estimates
            and composite health scores describe breeds, not individual dogs.
          </p>
          <AttributionNote className="max-w-md" />
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold text-ink-900">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-ink-600 underline decoration-transparent underline-offset-2 transition-colors hover:text-brand-blue-strong hover:decoration-brand-blue"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-ink-900">Data &amp; sources</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {EXTERNAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-600 underline decoration-transparent underline-offset-2 transition-colors hover:text-brand-blue-strong hover:decoration-brand-blue"
                >
                  {link.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand-200">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-xs leading-relaxed text-ink-600">
            <span className="font-semibold text-ink-700">Disclaimer:</span> Breed-level data is based
            on population statistics and does not predict the health of an individual dog. It is not a
            veterinary assessment. Always consult a qualified veterinarian about a specific dog&apos;s
            health.
          </p>
        </div>
      </div>
    </footer>
  )
}
