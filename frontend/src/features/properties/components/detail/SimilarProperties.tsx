import { PropertyGrid } from '@/shared/components/properties/PropertyGrid'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { Property } from '@/types'

interface SimilarPropertiesProps {
  properties: Property[]
  isFavourite?: (id: string) => boolean
  onToggleFavourite?: (id: string) => void
}

/**
 * "You may also like" row at the foot of the page.
 * Reuses the listing grid and its cards, so a property looks identical wherever
 * it appears on the site.
 */
export function SimilarProperties({ properties, isFavourite, onToggleFavourite }: SimilarPropertiesProps) {
  if (properties.length === 0) return null

  return (
    <section aria-labelledby="similar-properties-heading" className="bg-sand-100 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[var(--container-page)] px-5 sm:px-6 lg:px-8">
        <SectionHeading
          id="similar-properties-heading"
          eyebrow="You may also like"
          title="Similar Properties"
          description="Comparable listings in nearby areas and at a similar price point."
        />

        <PropertyGrid
          properties={properties}
          isFavourite={isFavourite}
          onToggleFavourite={onToggleFavourite}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        />
      </div>
    </section>
  )
}
