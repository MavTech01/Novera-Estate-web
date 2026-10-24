import type { IconName } from '@/types'
import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'

export interface CheckboxOption<T extends string = string> {
  value: T
  label: string
  /** Optional leading icon — used by the feature facet. */
  icon?: IconName
  /** Screen-reader-only hint appended to the label. */
  hint?: string
}

interface CheckboxGroupProps<T extends string> {
  /** Becomes the fieldset/legend, so each group is announced as its own set. */
  label: string
  options: CheckboxOption<T>[]
  selected: T[]
  onToggle: (value: T) => void
  /** Lays options out side by side on wider panels. */
  columns?: 1 | 2
  /** Renders the icon before the label instead of after it. */
  iconPosition?: 'leading' | 'trailing'
  className?: string
}

/**
 * Multi-select checkbox group built on native inputs.
 *
 * Native checkboxes are visually hidden but keep their keyboard and screen
 * reader behaviour; `peer-*` variants move the active and focus styling onto
 * the custom box so focus is still clearly visible.
 */
export function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  columns = 1,
  iconPosition = 'leading',
  className,
}: CheckboxGroupProps<T>) {
  return (
    <fieldset className={cn('min-w-0 border-0 p-0', className)}>
      <legend className="sr-only">{label}</legend>

      <div
        className={cn(
          'grid gap-1',
          columns === 2 ? 'sm:grid-cols-2 sm:gap-x-4' : 'grid-cols-1',
        )}
      >
        {options.map((option) => {
          const isChecked = selected.includes(option.value)

          return (
            <label
              key={option.value}
              className={cn(
                'group relative flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 transition-colors duration-200',
                'hover:text-accent-700',
                isChecked ? 'text-ink-900' : 'text-ink-600',
                iconPosition === 'trailing' && 'flex-row-reverse justify-between',
              )}
            >
              <input
                type="checkbox"
                value={option.value}
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                className="peer sr-only"
              />

              <span
                aria-hidden
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-[0.3125rem] border transition-all duration-200',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-500',
                  isChecked
                    ? 'border-accent-600 bg-accent-600 text-white'
                    : 'border-sand-400 bg-white group-hover:border-accent-400',
                )}
              >
                <Icon
                  name="check"
                  className={cn('size-3.5 transition-opacity duration-200', isChecked ? 'opacity-100' : 'opacity-0')}
                  strokeWidth={3}
                />
              </span>

              {option.icon && (
                <Icon name={option.icon} className="size-4 shrink-0 text-ink-500" strokeWidth={1.75} />
              )}

              <span className="text-[clamp(0.8125rem,0.78rem+0.2vw,0.875rem)] font-medium leading-snug">{option.label}</span>

              {option.hint && <span className="sr-only"> — {option.hint}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
