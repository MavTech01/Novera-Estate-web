import { cn } from '../../lib/cn'
import type { PropertyDetail } from '../../types'
import { Reveal } from '../ui/Reveal'
import { PropertyAmenities } from './PropertyAmenities'
import { PropertyDescription } from './PropertyDescription'
import { PropertyDocumentation } from './PropertyDocumentation'
import { PropertyFeatures } from './PropertyFeatures'
import { PropertyLocation } from './PropertyLocation'
import { PropertySpecifications } from './PropertySpecifications'
import { PropertyVerification } from './PropertyVerification'

interface PropertyContentProps {
  property: PropertyDetail
  className?: string
}

/**
 * The reading column of the listing.
 *
 * Ordered by what answers a buyer's questions in the order they ask them: what
 * is it, what does it contain, what is on the paperwork, and where is it. The
 * contact sidebar is rendered by the page, not here.
 */
export function PropertyContent({ property, className }: PropertyContentProps) {
  return (
    <div className={cn('min-w-0 space-y-12 sm:space-y-14', className)}>
      <Reveal>
        <PropertyVerification isVerified={property.isVerified} />
      </Reveal>

      <Reveal>
        <PropertyDescription description={property.description} />
      </Reveal>

      <Reveal>
        <PropertyFeatures features={property.features} />
      </Reveal>

      <Reveal>
        <PropertyAmenities amenities={property.amenities} />
      </Reveal>

      <Reveal>
        <PropertySpecifications property={property} />
      </Reveal>

      {property.documentation && (
        <Reveal>
          <PropertyDocumentation documentation={property.documentation} />
        </Reveal>
      )}

      <Reveal>
        <PropertyLocation property={property} />
      </Reveal>
    </div>
  )
}
