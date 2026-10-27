import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'positive' | 'neutral'
  className?: string
}

export default function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'default',
  className,
}: StatTileProps) {
  const iconTone =
    tone === 'positive'
      ? 'bg-brand-emerald-soft text-brand-emerald-strong'
      : tone === 'neutral'
        ? 'bg-sand-100 text-ink-600'
        : 'bg-brand-blue-soft text-brand-blue-strong'

  const valueTone =
    tone === 'positive' ? 'text-brand-emerald-strong' : 'text-ink-900'

  return (
    <div className={cn('rounded-3xl border border-sand-200 bg-white p-5 shadow-card', className)}>
      <div className="flex items-center gap-3">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', iconTone)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold tracking-wide text-ink-600 uppercase">{label}</p>
      </div>
      <p className={cn('mt-4 font-display text-2xl font-semibold', valueTone)}>{value}</p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-ink-600">{hint}</p> : null}
    </div>
  )
}
