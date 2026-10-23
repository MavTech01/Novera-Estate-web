import { getPropertyCategories } from '@/data'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { cn } from '@/shared/lib/cn'
import {
  CategoryGalleryCard,
  CATEGORY_GALLERY_META,
  DEFAULT_GALLERY_META,
} from './catalogue'

/** Curated display sequence to produce an asymmetric, balanced bento mosaic */
const ORDERED_CATEGORY_IDS = [
  'cat-luxury',
  'cat-apartments',
  'cat-houses',
  'cat-developments',
  'cat-land',
  'cat-commercial',
]

/**
 * "Browse the Catalogue" / "Explore Properties" section.
 * Renders an asymmetric, compact architectural bento mosaic that preserves the multi-image
 * layout across mobile, tablet, and desktop without consuming excessive vertical space.
 */
export function PropertyTypes() {
  const categories = getPropertyCategories()

  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = ORDERED_CATEGORY_IDS.indexOf(a.id)
    const indexB = ORDERED_CATEGORY_IDS.indexOf(b.id)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })

  return (
    <Section tone="white" id="catalogue" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Browse the catalogue"
          title="Explore Properties"
          description="From signature coastal residences to commercial investments and documented plots, explore our curated portfolio."
          action={
            <ArrowLink href="/properties" size="md">
              View all listings
            </ArrowLink>
          }
        />

        {/* Curated Compact Bento Gallery Grid across Mobile, Tablet, and Desktop */}
        <div className="mt-8 grid grid-cols-12 gap-3 sm:mt-10 sm:gap-4 lg:gap-5">
          {sortedCategories.map((category, index) => {
            const meta = CATEGORY_GALLERY_META[category.id] ?? DEFAULT_GALLERY_META

            return (
              <Reveal
                key={category.id}
                delay={(index % 4) * 70}
                className={cn(meta.colSpanClasses, 'h-full')}
              >
                <CategoryGalleryCard
                  category={category}
                  meta={meta}
                  className="h-full"
                />
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
