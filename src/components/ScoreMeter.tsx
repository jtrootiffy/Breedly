import { cn } from '@/utils/cn'

interface ScoreMeterProps {
  value: number | null | undefined
  label: string
  max?: number
  color?: string
  /** Extra text describing the value, read by screen readers. */
  valueText?: string
  className?: string
}

/**
 * Horizontal meter for a 0-100 value. Uses the ARIA `meter` role and always prints the
 * value as text next to the bar.
 */
export default function ScoreMeter({
  value,
  label,
  max = 100,
  color = '#07b07b',
  valueText,
  className,
}: ScoreMeterProps) {
  const hasValue = value !== null && value !== undefined && Number.isFinite(value)
  const clamped = hasValue ? Math.max(0, Math.min(max, value)) : 0
  const percent = max > 0 ? (clamped / max) * 100 : 0

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink-700">{label}</span>
        <span className="text-sm font-semibold text-ink-900">
          {hasValue ? `${value}` : 'Not available'}
        </span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={hasValue ? clamped : undefined}
        aria-valuetext={hasValue ? (valueText ?? `${value} out of ${max}`) : 'Not available'}
        className="h-2.5 w-full overflow-hidden rounded-full bg-sand-200"
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${hasValue ? percent : 0}%`,
            backgroundColor: color,
            transition: 'width 600ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        />
      </div>
    </div>
  )
}
