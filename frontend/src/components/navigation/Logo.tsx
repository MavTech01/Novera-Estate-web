import { cn } from '../../lib/cn'

interface LogoProps {
  /** `light` is for dark backgrounds. */
  tone?: 'dark' | 'light'
  /** Renders the small "ESTATES" sub-line under the wordmark. */
  showSubline?: boolean
  className?: string
}

/** Brand lockup: orange house mark + NOVERA wordmark. */
export function Logo({ tone = 'dark', showSubline = true, className }: LogoProps) {
  const isLight = tone === 'light'

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className={cn('size-10 shrink-0', isLight ? 'text-white' : 'text-accent-600')}
      >
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M10.5 20.5 20 11.5l9.5 9"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 20v9h11V20"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[1.375rem] font-extrabold uppercase leading-none tracking-[-0.01em]',
            isLight ? 'text-white' : 'text-ink-900',
          )}
        >
          Novera
        </span>
        {showSubline && (
          <span
            className={cn(
              'mt-1 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.34em]',
              isLight ? 'text-white/60' : 'text-accent-600',
            )}
          >
            Estates
          </span>
        )}
      </span>
    </span>
  )
}
