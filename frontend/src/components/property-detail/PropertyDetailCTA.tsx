import { company } from '../../data'
import { routes } from '../../lib/routes'
import { CtaBand } from '../cta/CtaBand'

/**
 * Closing call to action for the property detail page.
 * Placed after the recommendations, for a visitor who read the listing and
 * still wants help narrowing their options.
 */
export function PropertyDetailCTA() {
  return (
    <CtaBand
      headingId="property-detail-cta-heading"
      eyebrow="Need a hand?"
      title="Need Help Finding the Right Property?"
      description="Our property specialists can help you find options that match your needs and budget — including homes that are not publicly listed."
      actions={[
        { label: 'Talk to an Agent', href: `tel:${company.phoneHref}`, withArrow: true },
        { label: 'Explore More Properties', href: routes.properties, variant: 'outline' },
      ]}
    />
  )
}
