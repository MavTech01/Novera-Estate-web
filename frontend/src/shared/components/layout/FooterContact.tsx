import { company } from '@/data'
import { Icon } from '@/shared/components/ui/Icon'
import type { IconName } from '@/types'

interface ContactRowProps {
  icon: IconName
  label: string
  children: React.ReactNode
}

function ContactRow({ icon, label, children }: ContactRowProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-pill bg-white/10 text-accent-300">
        <Icon name={icon} className="size-4" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sand-400">{label}</span>
        {children}
      </span>
    </li>
  )
}

/** Office details shown in the footer. */
export function FooterContact() {
  return (
    <ul className="flex flex-col gap-4">
      <ContactRow icon="phone" label="Phone">
        <a
          href={`tel:${company.phoneHref}`}
          // Block-level so the whole row is tappable and clears the 24px
          // minimum in WCAG 2.5.8, not just the text glyphs.
          className="block min-h-6 py-0.5 text-sm text-sand-200 transition-colors duration-200 hover:text-accent-300"
        >
          {company.phone}
        </a>
      </ContactRow>

      <ContactRow icon="mail" label="Email">
        <a
          href={`mailto:${company.emailHref}`}
          className="block min-h-6 break-words py-0.5 text-sm text-sand-200 transition-colors duration-200 hover:text-accent-300"
        >
          {company.email}
        </a>
      </ContactRow>

      <ContactRow icon="map-pin" label="Office">
        <address className="text-sm not-italic leading-relaxed text-sand-200">
          {company.address.line1}
          {company.address.line2}
          <br />
          {company.address.city}, {company.address.state}
        </address>
      </ContactRow>

      <ContactRow icon="clock" label="Office hours">
        <span className="text-sm text-sand-200">{company.hours}</span>
      </ContactRow>
    </ul>
  )
}
