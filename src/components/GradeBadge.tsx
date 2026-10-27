import { getGradeInfo } from '@/utils/grades'
import { cn } from '@/utils/cn'

interface GradeBadgeProps {
  grade: string | null | undefined
  showLabel?: boolean
  className?: string
}

/**
 * Shows the API's health grade. Colour is keyed on the documented grade letter, and the
 * letter itself is always printed so the meaning never depends on colour alone.
 */
export default function GradeBadge({ grade, showLabel = false, className }: GradeBadgeProps) {
  const info = getGradeInfo(grade)

  if (!info || !grade) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-600',
          className,
        )}
      >
        Grade not available
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold',
        className,
      )}
      style={{ backgroundColor: info.tint, borderColor: info.border, color: info.text }}
    >
      Grade {grade}
      {showLabel ? <span className="font-medium opacity-90">· {info.label}</span> : null}
    </span>
  )
}
