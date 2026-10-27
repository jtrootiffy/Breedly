import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, PawPrint, Scale, X } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/breeds', label: 'Explore Breeds', end: false },
  { to: '/compare', label: 'Compare', end: false },
  { to: '/about', label: 'About', end: false },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { slugs } = useCompare()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-brand-blue-soft text-brand-blue-strong'
        : 'text-ink-700 hover:bg-sand-100 hover:text-brand-blue-strong',
    )

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200/80 bg-sand-50/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-full py-1 pr-2 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-emerald text-white shadow-sm">
            <PawPrint className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-ink-900">Breedly</span>
            <span className="mt-0.5 hidden text-[11px] text-ink-600 sm:block">
              Better knowledge. Healthier, happier dogs.
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <span className="inline-flex items-center gap-1.5">
                {item.label}
                {item.to === '/compare' && slugs.length > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-emerald px-1.5 text-[11px] font-bold text-white">
                    {slugs.length}
                  </span>
                ) : null}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/breeds"
            className="inline-flex items-center gap-2 rounded-full bg-brand-emerald px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-emerald-strong"
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
            Explore
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 bg-white text-ink-700 transition-colors hover:bg-sand-100 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div id="mobile-nav" className="border-t border-sand-200 bg-sand-50 md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-blue-soft text-brand-blue-strong'
                      : 'text-ink-700 hover:bg-sand-100',
                  )
                }
              >
                {item.label}
                {item.to === '/compare' && slugs.length > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-emerald px-1.5 text-[11px] font-bold text-white">
                    {slugs.length}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
