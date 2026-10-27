import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface StatePanelProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  tone?: 'neutral' | 'error'
  className?: string
}

/** Shared shell for empty, error and not-found states so they look consistent. */
export default function StatePanel({
  icon: Icon,
  title,
  description,
  action,
  tone = 'neutral',
  className,
}: StatePanelProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border bg-white/80 px-6 py-12 text-center',
        tone === 'error' ? 'border-brand-cream' : 'border-sand-200',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl',
          tone === 'error' ? 'bg-brand-cream-soft text-ink-700' : 'bg-brand-blue-soft text-brand-blue-strong',
        )}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="space-y-1.5">
        <h3 className="text-xl">{title}</h3>
        {description ? <p className="text-sm leading-relaxed text-ink-600">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
