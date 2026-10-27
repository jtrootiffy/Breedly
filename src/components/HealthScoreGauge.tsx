import { getGradeInfo } from '@/utils/grades'
import { formatScore } from '@/utils/format'
import { cn } from '@/utils/cn'

interface HealthScoreGaugeProps {
  score: number | null
  grade: string | null
  size?: 'md' | 'lg'
  className?: string
}

const RADIUS = 54
const STROKE = 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Circular score indicator showing the API's 0-100 composite score plus its grade.
 * The number and grade are always rendered as text, so the value is never conveyed by
 * the arc alone.
 */
export default function HealthScoreGauge({
  score,
  grade,
  size = 'md',
  className,
}: HealthScoreGaugeProps) {
  const info = getGradeInfo(grade)
  const color = info?.solid ?? '#80a1c1'
  const hasScore = score !== null && Number.isFinite(score)
  const clamped = hasScore ? Math.max(0, Math.min(100, score)) : 0
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100)

  const ariaLabel = hasScore
    ? `Composite breed health score ${score} out of 100${grade ? `, grade ${grade}` : ''}`
    : 'Composite breed health score not available'

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('relative shrink-0', size === 'lg' ? 'h-44 w-44' : 'h-32 w-32', className)}
    >
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke="#efe6d2"
          strokeWidth={STROKE}
        />
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 0.61, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'font-display font-semibold text-ink-900',
            size === 'lg' ? 'text-5xl' : 'text-4xl',
          )}
        >
          {hasScore ? formatScore(score) : '—'}
        </span>
        <span className="text-xs font-medium tracking-wide text-ink-600">out of 100</span>
        {grade ? (
          <span
            className="mt-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{ backgroundColor: info?.tint, color: info?.text }}
          >
            Grade {grade}
          </span>
        ) : null}
      </div>
    </div>
  )
}
