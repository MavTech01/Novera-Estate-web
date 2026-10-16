import { company, navigationCta } from '@/data'
import { CtaBand } from '@/shared/components/CtaBand'

/**
 * Closing conversion band for visitors whose criteria returned nothing useful.
 * Placement is deliberate: after pagination, when the visitor has already seen
 * that self-serve search is not going to answer their question.
 */
export function PropertyListingCTA() {
  return (
    <CtaBand
      headingId="listing-cta-heading"
      eyebrow="Still looking?"
      title="Can't Find What You're Looking For?"
      description="Tell our property specialists what you need and we'll help you find suitable options — including listings that never reach this page."
      actions={[
        { label: 'Talk to an Agent', href: `tel:${company.phoneHref}`, withArrow: true },
        { label: 'Book an Inspection', href: navigationCta.href, variant: 'outline' },
      ]}
    />
  )
}
