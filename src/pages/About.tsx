import { Link } from 'react-router-dom'
import { ExternalLink, HeartPulse, Info, ShieldCheck, TrendingUp } from 'lucide-react'
import AttributionNote from '@/components/AttributionNote'
import { SCORE_COMPONENTS } from '@/utils/grades'
import { buttonClass, cardClass } from '@/utils/ui'

const EXTERNAL_LINKS = [
  { href: 'https://breedhealthscore.com', label: 'breedhealthscore.com' },
  { href: 'https://breedhealthscore.com/methodology/', label: 'Methodology' },
  { href: 'https://breedhealthscore.com/developers/', label: 'API documentation' },
  {
    href: 'https://www.nature.com/articles/s41598-023-50458-w',
    label: 'McMillan et al. 2024, Scientific Reports',
  },
  {
    href: 'https://creativecommons.org/licenses/by/4.0/',
    label: 'CC BY 4.0 licence',
  },
]

export default function About() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-emerald-strong uppercase">
          About
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl">Better knowledge. Healthier, happier dogs.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-600">
          Breedly is a breed-level health explorer. It takes one openly licensed dataset about dog
          breeds and turns it into something you can actually browse, filter and compare — so you can
          ask better questions before you bring a dog home.
        </p>
      </header>

      <section aria-labelledby="mission-heading" className={`${cardClass} mt-10 p-6 sm:p-8`}>
        <h2 id="mission-heading" className="text-2xl">
          What Breedly does
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: HeartPulse,
              title: 'Health scores',
              body: 'A 0–100 composite score for every breed, shown alongside the grade the dataset assigns.',
            },
            {
              icon: TrendingUp,
              title: 'Lifespan insights',
              body: 'Median lifespan for each breed, from a study of 584,734 UK dogs.',
            },
            {
              icon: ShieldCheck,
              title: 'Hereditary conditions',
              body: 'The conditions the dataset lists for a breed, presented exactly as supplied.',
            },
          ].map((item) => (
            <li key={item.title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-emerald-soft text-brand-emerald-strong">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="score-heading" className={`${cardClass} mt-6 p-6 sm:p-8`}>
        <h2 id="score-heading" className="text-2xl">
          How the health score is built
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Every breed receives one score from 0 to 100, where a higher number means the breed compares
          more favourably. It is a weighted combination of three parts, published in full by Breed
          Health Score:
        </p>
        <ul className="mt-6 space-y-4">
          {SCORE_COMPONENTS.map((component) => (
            <li
              key={component.key}
              className="flex flex-col gap-1 rounded-2xl bg-sand-100 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="font-semibold text-ink-900">
                {component.label} — {component.weight}
              </span>
              <span className="text-sm leading-relaxed text-ink-600">{component.description}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex gap-2 rounded-2xl bg-sand-100 px-5 py-4 text-sm leading-relaxed text-ink-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue-strong" aria-hidden="true" />
          <span>
            The three weightings are the publisher&apos;s own editorial choice, shown in full so you
            can see how each score is built. The underlying lifespan data is peer-reviewed and cited.
          </span>
        </p>
      </section>

      <section aria-labelledby="sources-heading" className={`${cardClass} mt-6 p-6 sm:p-8`}>
        <h2 id="sources-heading" className="text-2xl">
          Where the data comes from
        </h2>
        <dl className="mt-6 space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="font-semibold text-ink-900">Median lifespan</dt>
            <dd className="text-ink-600">
              McMillan, K.M. et al. (2024), “Longevity of companion dog breeds”, Scientific Reports
              (584,734 UK dogs). Licensed CC BY 4.0.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink-900">Conditions and conformation</dt>
            <dd className="text-ink-600">
              RVC VetCompass, AKC, PDSA and UK Kennel Club. The publisher describes these as
              indicative.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink-900">Photography</dt>
            <dd className="text-ink-600">
              Pexels, credited to the individual photographer where the API supplies it.
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-sand-200 pt-6">
          <AttributionNote />
        </div>

        <ul className="mt-6 space-y-2.5 text-sm">
          {EXTERNAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-brand-blue-strong underline decoration-dotted underline-offset-2 transition-colors hover:text-brand-emerald-strong"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="disclaimer-heading" className={`${cardClass} mt-6 border-brand-cream p-6 sm:p-8`}>
        <h2 id="disclaimer-heading" className="text-2xl">
          Disclaimer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Breed-level data is based on population statistics and does not predict the health of an
          individual dog. Lifespan estimates and breed health scores are not veterinary assessments.
          A breed&apos;s listed conditions indicate what has been reported for the breed, not a
          diagnosis for any particular dog. Always consult a qualified veterinarian about a specific
          dog&apos;s health, and never use this information as a substitute for professional advice.
        </p>
      </section>

      <section className={`${cardClass} mt-6 p-6 sm:p-8`}>
        <h2 className="text-2xl">Start exploring</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Everything is loaded live from the public Breed Health Score API. No account, no API key and
          no tracking.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/breeds" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
            Explore breeds
          </Link>
          <Link to="/compare" className={buttonClass('outline', 'lg', 'w-full sm:w-auto')}>
            Compare breeds
          </Link>
        </div>
      </section>
    </div>
  )
}
