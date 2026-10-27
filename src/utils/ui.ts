import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// `min-h-11` keeps every button at least 44px tall, the comfortable touch target size.
const BUTTON_BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Emerald green is reserved for primary actions, per the brand direction.
  primary: 'bg-brand-emerald text-white shadow-sm hover:bg-brand-emerald-strong',
  // Blue for secondary surfaces/actions.
  secondary: 'bg-brand-blue text-white shadow-sm hover:bg-brand-blue-strong',
  outline: 'border border-brand-blue bg-white/80 text-brand-blue-strong hover:bg-brand-blue-soft',
  ghost: 'text-ink-700 hover:bg-sand-100',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], extra)
}

export const cardClass = 'rounded-3xl border border-sand-200 bg-white shadow-card'

export const fieldClass =
  'min-h-11 w-full rounded-2xl border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink-800 shadow-sm transition-colors hover:border-brand-blue'
