import { cn } from '@/shared/lib/cn'

interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  /** Accessible group name, e.g. "Purpose". */
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  className?: string
}

/**
 * Buy / Rent tab strip. Built on radiogroup semantics so keyboard and screen
 * reader users get correct announcements without needing arrow-key plumbing.
 */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-1.5" role="radiogroup" aria-label={label}>
      <span className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">{label}</span>
      <div className={cn('inline-flex w-full rounded-pill bg-sand-100 p-1', className)}>
        {options.map((option) => {
          const isActive = option.value === value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option.value)}
              className={cn(
                'min-h-10 flex-1 rounded-pill px-5 text-sm font-semibold transition-all duration-200 ease-[var(--ease-out-soft)]',
                isActive
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'text-ink-500 hover:bg-white hover:text-ink-900',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
