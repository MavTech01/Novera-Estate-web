import { company, footerNavigation, footerServices, legalLinks } from '../../data'
import { Logo } from '../navigation/Logo'
import { Container } from '../ui/Container'
import { FooterContact } from './FooterContact'
import { FooterLinkColumns } from './FooterLinkColumns'
import { NewsletterForm } from './NewsletterForm'
import { SocialLinks } from './SocialLinks'

/** Site footer: brand, navigation, services, contact and newsletter. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-700 text-sand-300">
      <Container className="py-16 sm:py-18 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand-300/80">{company.description}</p>

            <SocialLinks platforms={company.socials} className="mt-6" />
          </div>

          {/* Navigation + services */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterLinkColumns groups={footerNavigation} className="contents" />
            <FooterLinkColumns groups={[footerServices]} />
          </div>

          {/* Contact + newsletter */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            <FooterContact />
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 sm:flex-row">
          <p className="text-xs text-sand-400">
            © {year} {company.name}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-xs text-sand-400 transition-colors duration-200 hover:text-accent-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
