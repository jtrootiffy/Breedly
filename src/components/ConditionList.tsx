import { Stethoscope } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ConditionListProps {
  conditions: string[]
  /** Show only the first N conditions plus a "+N more" chip. */
  limit?: number
  emptyText?: string
  className?: string
}

/** Renders the conditions exactly as the API lists them, or an explicit empty message. */
export default function ConditionList({
  conditions,
  limit,
  emptyText = 'No hereditary conditions listed for this breed by the dataset.',
  className,
}: ConditionListProps) {
  if (conditions.length === 0) {
    return (
      <p className={cn('flex items-start gap-2 text-sm text-ink-600', className)}>
        <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue-strong" aria-hidden="true" />
        {emptyText}
      </p>
    )
  }

  const visible = limit ? conditions.slice(0, limit) : conditions
  const hiddenCount = conditions.length - visible.length

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {visible.map((condition) => (
        <li
          key={condition}
          className="rounded-full border border-brand-blue/25 bg-brand-blue-soft px-3 py-1 text-xs font-medium text-brand-blue-strong"
        >
          {condition}
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className="rounded-full border border-sand-300 bg-sand-100 px-3 py-1 text-xs font-medium text-ink-600">
          +{hiddenCount} more
        </li>
      ) : null}
    </ul>
  )
}
