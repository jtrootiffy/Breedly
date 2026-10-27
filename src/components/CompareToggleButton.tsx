import { Check, Plus } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { buttonClass } from '@/utils/ui'
import { cn } from '@/utils/cn'

interface CompareToggleButtonProps {
  slug: string
  name: string
  /** `icon` renders a compact round button for cards; `full` renders a labelled button. */
  variant?: 'icon' | 'full'
  className?: string
}

/** Adds or removes a breed from the shared comparison selection. */
export default function CompareToggleButton({
  slug,
  name,
  variant = 'icon',
  className,
}: CompareToggleButtonProps) {
  const { isSelected, toggle, isFull } = useCompare()
  const selected = isSelected(slug)
  const disabled = !selected && isFull

  const label = selected
    ? `Remove ${name} from comparison`
    : disabled
      ? `Comparison is full. Remove a breed first.`
      : `Add ${name} to comparison`

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        disabled={disabled}
        aria-pressed={selected}
        className={buttonClass(selected ? 'secondary' : 'outline', 'md', className)}
        title={disabled ? 'Comparison is full — remove a breed first' : label}
      >
        {selected ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Plus className="h-4 w-4" aria-hidden="true" />
        )}
        {selected ? 'In comparison' : 'Add to compare'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={label}
      title={disabled ? 'Comparison is full — remove a breed first' : label}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
        selected
          ? 'border-brand-emerald bg-brand-emerald-soft text-brand-emerald-strong'
          : 'border-sand-300 bg-white text-ink-600 hover:border-brand-blue hover:text-brand-blue-strong',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {selected ? (
        <Check className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Plus className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}
