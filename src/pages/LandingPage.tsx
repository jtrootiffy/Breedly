import { Link } from 'react-router-dom'
import {
  ArrowRight,
  HeartPulse,
  Info,
  ScanEye,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wind,
} from 'lucide-react'
import BreedImage from '@/components/BreedImage'
import SectionHeading from '@/components/SectionHeading'
import AttributionNote from '@/components/AttributionNote'
import { useBreeds } from '@/hooks/useBreeds'
import { buttonClass } from '@/utils/ui'

const HERO_IMAGES = [
  { slug: 'labrador-retriever', alt: 'A Labrador Retriever looking toward the camera' },
  { slug: 'beagle', alt: 'A Beagle with a calm, alert expression' },
  { slug: 'french-bulldog', alt: 'A French Bulldog sitting outdoors' },
]

const FEATURES = [
  {
    icon: HeartPulse,
    title: 'Health Scores',
    body: 'A single 0–100 composite score for every breed, built from longevity (65%), conformation (20%) and hereditary burden (15%).',
    iconClass: 'bg-brand-emerald-soft text-brand-emerald-strong',
  },
  {
    icon: TrendingUp,
    title: 'Lifespan Insights',
    body: 'Median lifespan for each breed, taken from a study of 584,734 UK dogs published in Scientific Reports.',
    iconClass: 'bg-brand-blue-soft text-brand-blue-strong',
  },
  {
    icon: ShieldCheck,
    title: 'Hereditary Conditions',
    body: 'The conditions the dataset lists for a breed, so you can go into a conversation with a breeder or vet better prepared.',
    iconClass: 'bg-brand-cream-soft text-ink-700',
  },
]

export default function LandingPage() {
  const { breeds, isLoading } = useBreeds()
  const breedCount = breeds.length > 0 ? breeds.length : null

  return (
    <div className="animate-fade-up">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-cream bg-brand-cream-soft px-4 py-1.5 text-xs font-semibold tracking-wide text-ink-700 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-brand-emerald-strong" aria-hidden="true" />
            Better knowledge. Healthier, happier dogs.
          </p>

          <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
            Every breed has a story. Know their health.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Breedly helps you explore breed health scores, average lifespan estimates, breed
            characteristics and hereditary conditions — so you can make a more informed decision
            about the dog that fits your life.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/breeds" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
              Get Started
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link to="/breeds" className={buttonClass('outline', 'lg', 'w-full sm:w-auto')}>
              <ScanEye className="h-5 w-5" aria-hidden="true" />
              Explore Breeds
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-600">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-emerald" aria-hidden="true" />
              {isLoading ? (
                <span className="text-ink-600">Loading breed count…</span>
              ) : breedCount !== null ? (
                <span>
                  <strong className="font-semibold text-ink-800">{breedCount} dog breeds</strong>{' '}
                  covered
                </span>
              ) : (
                <span>Breed health dataset</span>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-blue" aria-hidden="true" />
              Data-driven insights
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-cream" aria-hidden="true" />
              No account required
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-3xl shadow-card">
              <BreedImage slug={HERO_IMAGES[0].slug} alt={HERO_IMAGES[0].alt} priority />
            </div>
            <div className="aspect-square overflow-hidden rounded-3xl shadow-card">
              <BreedImage slug={HERO_IMAGES[1].slug} alt={HERO_IMAGES[1].alt} priority />
            </div>
            <div className="aspect-square overflow-hidden rounded-3xl shadow-card">
              <BreedImage slug={HERO_IMAGES[2].slug} alt={HERO_IMAGES[2].alt} priority />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink-600">
            Breed photography from the Breed Health Score dataset (Pexels).
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- Know what matters */}
      <section className="border-y border-sand-300 bg-brand-cream">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeading
            eyebrow="Know what matters"
            title="Three things worth understanding before you choose"
            description="Breedly pulls one consistent dataset into a view that answers the questions people actually ask."
            align="center"
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-3xl border border-sand-200 bg-white p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconClass}`}
                >
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------- Find your perfect companion */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="overflow-hidden rounded-[2rem] bg-brand-blue text-white shadow-card">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-white/80 uppercase">
                Find your perfect companion
              </p>
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">
                Start with the breed, then meet the dog.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">
                Browse all breeds side by side, sort them by health score or lifespan, and compare
                two or three at once. Everything comes from a single, openly licensed dataset.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/breeds" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
                  Browse all breeds
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/compare"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/70 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto"
                >
                  Compare breeds
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-3xl bg-white/12 p-6 backdrop-blur-sm">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                  Breeds
                </dt>
                <dd className="mt-1 font-display text-3xl">
                  {breedCount !== null ? breedCount : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                  Score range
                </dt>
                <dd className="mt-1 font-display text-3xl">0–100</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                  Score parts
                </dt>
                <dd className="mt-1 font-display text-3xl">3</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                  Account
                </dt>
                <dd className="mt-1 font-display text-3xl">None</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Disclaimer */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-brand-cream bg-white/80 p-6 sm:flex-row sm:items-start sm:gap-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-cream-soft text-ink-700">
            <Info className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h2 className="text-lg">What this data can and cannot tell you</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Breed-level data describes populations and does not predict the health of an individual
              dog. Lifespan estimates and composite health scores come from population statistics,
              not veterinary assessments. Always consult a qualified veterinarian about the health of
              a specific dog.
            </p>
            <AttributionNote />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Small brand flourish */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6">
        <p className="flex items-center justify-center gap-2 text-center text-sm text-ink-600">
          <Wind className="h-4 w-4 text-brand-blue-strong" aria-hidden="true" />
          Built on openly licensed data, with no sign-up and no tracking.
        </p>
      </section>
    </div>
  )
}
