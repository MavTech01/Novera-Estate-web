import { cn } from '../../lib/cn'
import { Icon } from './Icon'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

/** Labelled native select — keeps mobile pickers and keyboard support intact. */
export function SelectField({ id, label, value, options, onChange, className, placeholder }: SelectFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full cursor-pointer appearance-none truncate rounded-md border border-sand-200 bg-white pl-3.5 pr-10 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:border-accent-300 focus-visible:border-accent-500"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent-500"
          strokeWidth={2.2}
        />
      </div>
    </div>
  )
}
