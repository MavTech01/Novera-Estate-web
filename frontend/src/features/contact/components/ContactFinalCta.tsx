import { routes } from '@/shared/lib/routes'
import { TakeNextStepCta } from '@/shared/components/ui/TakeNextStepCta'

/**
 * "Have a Property in Mind?" — the closing CTA on the contact page.
 */
export function ContactFinalCta() {
  return (
    <TakeNextStepCta
      headingId="contact-final-cta-heading"
      eyebrow="Take the next step"
      eyebrowIcon="sparkles"
      title="Have a Property in Mind?"
      description="Explore what is available across Lagos, or tell us exactly what you're looking for and we'll shortlist it for you. Viewings are free and come with no obligation."
      primaryAction={{
        label: 'Explore Properties',
        href: routes.properties,
        withArrow: true,
      }}
      secondaryAction={{
        label: 'Book an Inspection',
        href: routes.bookInspection,
        icon: 'calendar-search',
      }}
    />
  )
}
