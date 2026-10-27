import { ExternalLink } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AttributionNoteProps {
  className?: string
  /** Render on a darker surface (e.g. footer). */
  tone?: 'light' | 'muted'
}

/**
 * The dataset is licensed CC BY 4.0, so this attribution must stay visible wherever
 * breed data is presented. The wording is fixed by the brief.
 */
export default function AttributionNote({ className, tone = 'light' }: AttributionNoteProps) {
  const linkClass = cn(
    'inline-flex items-center gap-1 font-medium underline decoration-dotted underline-offset-2 transition-colors',
    tone === 'muted'
      ? 'text-brand-blue-strong hover:text-brand-emerald-strong'
      : 'text-brand-blue-strong hover:text-brand-emerald-strong',
  )

  return (
    <p className={cn('text-xs leading-relaxed text-ink-600', className)}>
      Breed health data provided by{' '}
      <a
        href="https://breedhealthscore.com"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Breed Health Score
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
      . Licensed CC BY 4.0.{' '}
      <a
        href="https://breedhealthscore.com/methodology/"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Read the methodology
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
      .
    </p>
  )
}
