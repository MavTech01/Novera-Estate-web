import { purposeOptions } from '@/data/searchOptions'
import type { PropertyPurpose } from '@/types'
import { cn } from '@/shared/lib/cn'

interface HeroPurposeTabsProps {
  purpose: PropertyPurpose
  onChange: (purpose: PropertyPurpose) => void
  className?: string
}

export function HeroPurposeTabs({ purpose, onChange, className }: HeroPurposeTabsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {purposeOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200',
            purpose === opt.value
              ? 'border border-transparent bg-accent-600 text-white shadow-md hover:bg-accent-700'
              : 'border border-white/15 bg-black/60 text-white/90 backdrop-blur-md shadow-sm hover:bg-black/70 hover:text-white',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
