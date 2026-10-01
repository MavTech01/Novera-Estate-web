import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import type { IconName } from '@/types'

interface TextAreaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  icon?: IconName | null
  rows?: number
  required?: boolean
  error?: string
}

/**
 * Multiline counterpart to `TextField`, sharing the same label, border and
 * error styling so the inspection form reads as one consistent control set.
 */
export function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  icon = null,
  rows = 4,
  required = false,
  error,
}: TextAreaProps) {
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
            className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-accent-500"
            strokeWidth={2}
          />
        )}

        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full resize-y rounded-md border bg-white py-3 text-sm font-medium leading-relaxed text-ink-900',
            'transition-colors duration-200 placeholder:text-ink-400',
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
