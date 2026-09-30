import { cn } from '../../lib/cn'
import { getFeatureIcon } from '../../lib/featureIcons'
import { Icon } from '../ui/Icon'

interface PropertyFeaturesProps {
  features: string[]
  className?: string
}

/**
 * Feature checklist.
 * Icons are resolved from the feature text rather than stored per feature, so
 * a listing edited in the CMS never renders a row with a missing glyph.
 */
export function PropertyFeatures({ features, className }: PropertyFeaturesProps) {
  if (features.length === 0) return null

  return (
    <section aria-labelledby="property-features-heading" className={cn('min-w-0', className)}>
      <h2 id="property-features-heading" className="font-display text-xl text-ink-900 sm:text-2xl">
        Property Features
      </h2>

      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-tint-50 text-accent-600">
              <Icon name={getFeatureIcon(feature)} className="size-4" strokeWidth={1.75} />
            </span>
            <span className="pt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
