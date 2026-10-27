import { Link } from 'react-router-dom'
import { ArrowRight, Ruler, Timer, Wind } from 'lucide-react'
import BreedImage from '@/components/BreedImage'
import CompareToggleButton from '@/components/CompareToggleButton'
import GradeBadge from '@/components/GradeBadge'
import { getGradeInfo } from '@/utils/grades'
import { formatScore, formatYearsShort, NOT_AVAILABLE } from '@/utils/format'
import { SIZE_LABELS } from '@/types/breed.types'
import type { Breed } from '@/types/breed.types'

interface BreedCardProps {
  breed: Breed
}

export default function BreedCard({ breed }: BreedCardProps) {
  const detailHref = `/breeds/${encodeURIComponent(breed.slug)}`
  const gradeInfo = getGradeInfo(breed.grade)
  const sizeLabel = breed.size ? SIZE_LABELS[breed.size] : NOT_AVAILABLE
  const conditionSummary =
    breed.conditions.length > 0 ? breed.conditions.slice(0, 2).join(' · ') : 'None listed'

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-card-hover">
      <Link
        to={detailHref}
        className="relative block aspect-[4/3] overflow-hidden bg-sand-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <BreedImage
          slug={breed.slug}
          image={breed.image}
          alt={breed.name}
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm"
          style={{
            backgroundColor: gradeInfo ? gradeInfo.solid : '#80a1c1',
            color: '#ffffff',
          }}
        >
          {formatScore(breed.healthScore)}
          <span className="font-medium opacity-90">/100</span>
        </span>
        <span className="absolute top-3 right-3">
          <GradeBadge grade={breed.grade} className="shadow-sm backdrop-blur-sm" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg leading-snug">
            <Link
              to={detailHref}
              className="transition-colors hover:text-brand-blue-strong"
            >
              {breed.name}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-600">{conditionSummary}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-sand-100 px-3 py-2">
            <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-ink-600 uppercase">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              Lifespan
            </dt>
            <dd className="mt-0.5 font-semibold text-ink-900">
              {formatYearsShort(breed.medianLifespanYears)}
            </dd>
          </div>
          <div className="rounded-2xl bg-sand-100 px-3 py-2">
            <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-ink-600 uppercase">
              <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
              Size
            </dt>
            <dd className="mt-0.5 font-semibold text-ink-900">{sizeLabel}</dd>
          </div>
        </dl>

        {breed.brachycephalic ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <Wind className="h-3.5 w-3.5 text-brand-blue-strong" aria-hidden="true" />
            Brachycephalic (flat-faced)
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2">
          <Link
            to={detailHref}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-emerald px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-emerald-strong"
          >
            View details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <CompareToggleButton slug={breed.slug} name={breed.name} />
        </div>
      </div>
    </article>
  )
}
