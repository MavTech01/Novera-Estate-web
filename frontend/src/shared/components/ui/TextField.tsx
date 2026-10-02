import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import type { IconName } from '@/types'

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  /** Pass `null` for a field with no leading icon. */
  icon?: IconName | null
  type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'number'
  autoComplete?: string
  required?: boolean
  /** Locks the field while a form is in flight, so nothing is edited mid-send. */
  disabled?: boolean
  /** Validation message — also wires up `aria-invalid` and `aria-describedby`. */
  error?: string
  min?: string
}

/**
 * Labelled text input.
 * Used by the location search bar and the inspection request form, so it takes
 * a field type and an optional error message rather than being search-specific.
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  icon = 'map-pin',
  type = 'text',
  autoComplete,
  required = false,
  disabled = false,
  error,
  min,
}: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
        {label}
        {required && (
          <span className="ml-1 text-accent-600" aria-hidden>
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent-500"
            strokeWidth={2}
          />
        )}

        <input
          id={id}
          name={id}
          type={type}
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-12 w-full rounded-md border bg-white text-sm font-semibold text-ink-900',
            'transition-colors duration-200 placeholder:font-medium placeholder:text-ink-400',
            disabled && 'cursor-not-allowed bg-sand-100 text-ink-400',
            error
              ? 'border-accent-500 focus-visible:border-accent-600'
              : 'border-sand-200 hover:border-accent-300 focus-visible:border-accent-500',
            icon ? 'pl-10 pr-3.5' : 'px-3.5',
          )}
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-accent-700">
          {error}
        </p>
      )}
    </div>
  )
}
