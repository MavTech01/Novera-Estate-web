import { routes } from '@/shared/lib/routes'
import { buildRentPropertiesHref } from '@/features/rent/utils/rentQuery'
import { TakeNextStepCta } from '@/shared/components/ui/TakeNextStepCta'

/** Closing call to action — the last thing on the page, once every section has landed. */
export function RentFinalCta() {
  return (
    <TakeNextStepCta
      headingId="rent-final-cta-heading"
      eyebrow="Take the next step"
      eyebrowIcon="key"
      title="Ready to Find Your Next Rental?"
      description="Browse the full rental catalogue, or tell us what you are looking for and let our team shortlist the places that fit."
      primaryAction={{
        label: 'Browse rentals',
        href: buildRentPropertiesHref({}),
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
