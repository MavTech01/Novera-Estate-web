import { Link } from 'react-router-dom'
import { SURROUNDINGS_DISCLAIMER } from '@/data/propertyDetails'
import { cn } from '@/shared/lib/cn'
import type { PropertyDetail } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { PropertyMapPlaceholder } from './PropertyMapPlaceholder'

interface PropertyLocationProps {
  property: PropertyDetail
  className?: string
}

/**
 * Where the property is, and what is around it.
 * The map slot is a placeholder until a maps provider is connected; the
 * surroundings list underneath comes from the listing record.
 */
export function PropertyLocation({ property, className }: PropertyLocationProps) {
  return (
    <section aria-labelledby="property-location-heading" className={cn('min-w-0', className)}>
      <h2 id="property-location-heading" className="font-display text-xl text-ink-900 sm:text-2xl">
        Property Location
      </h2>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-ink-600">
        <span className="flex items-center gap-1.5">
          <Icon name="map-pin" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
          {property.location.label}
        </span>
        <Link
          to={`/properties?location=${property.location.slug}`}
          className="text-sm font-semibold text-accent-600 transition-colors duration-200 hover:text-accent-700"
        >
          View other properties in {property.location.name}
        </Link>
      </p>

      <PropertyMapPlaceholder
        locationLabel={property.location.label}
        coordinates={property.coordinates}
        className="mt-5"
      />

      {property.surroundings.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-base text-ink-900">Around the Neighbourhood</h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {property.surroundings.map((group, index) => (
              <Reveal key={group.category} delay={index * 40}>
                <div className="h-full rounded-xl border border-sand-200 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Icon name={group.icon} className="size-4 shrink-0 text-accent-500" strokeWidth={1.75} />
                    {group.label}
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-ink-500">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
            <Icon name="triangle-alert" className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
            {SURROUNDINGS_DISCLAIMER}
          </p>
        </div>
      )}
    </section>
  )
}
