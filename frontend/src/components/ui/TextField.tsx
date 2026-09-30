import { cn } from '../../lib/cn'
import { Icon } from './Icon'

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  icon?: Parameters<typeof Icon>[0]['name']
}

/** Labelled text input used for the location field in the search bar. */
export function TextField({ id, label, value, onChange, placeholder, className, icon = 'map-pin' }: TextFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
        {label}
      </label>
      <div className="relative">
        <Icon
          name={icon}
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent-500"
          strokeWidth={2}
        />
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-12 w-full rounded-md border border-sand-200 bg-white pl-10 pr-3.5 text-sm font-semibold text-ink-900 transition-colors duration-200 placeholder:font-medium placeholder:text-ink-400 hover:border-accent-300 focus-visible:border-accent-500"
        />
      </div>
    </div>
  )
}
