import { routes } from '@/shared/lib/routes'
import { TakeNextStepCta } from '@/shared/components/ui/TakeNextStepCta'

/** Closing call to action — the last thing on the page, once every section has landed. */
export function BuyFinalCta() {
  return (
    <TakeNextStepCta
      headingId="buy-final-cta-heading"
      eyebrow="Take the next step"
      eyebrowIcon="sparkles"
      title="Your Next Address Could Be Closer Than You Think"
      description="Browse the full for-sale catalogue, or tell us what you are looking for and let our team build the shortlist with you."
      primaryAction={{
        label: 'Browse properties',
        href: routes.properties,
        withArrow: true,
      }}
      secondaryAction={{
        label: 'Talk to our team',
        href: routes.contact,
        icon: 'message',
      }}
    />
  )
}
