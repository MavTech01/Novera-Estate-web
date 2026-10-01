import type { CompanyProfile, NavigationGroup, NavigationLink } from '@/types'

/** Single source of truth for brand, contact details and site navigation. */
export const company: CompanyProfile = {
  name: 'Novera Estates',
  descriptor: 'Estates & Properties',
  tagline: 'Find a Place That Feels Like Yours.',
  description:
    'Novera Estates is a Lagos-based real-estate company helping people discover, inspect and secure homes, land and investment property in carefully selected locations.',
  phone: '+234 201 888 4400',
  phoneHref: '+2342018884400',
  email: 'hello@noveraestates.com',
  emailHref: 'hello@noveraestates.com',
  address: {
    line1: '14B Admiralty Way',
    line2: ' Lekki Phase 1',
    city: 'Lekki',
    state: 'Lagos',
  },
  hours: 'Monday – Saturday, 9:00am – 6:00pm',
  socials: [
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/noveraestates' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/noveraestates' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/noveraestates' },
  ],
}

/** Primary navigation — desktop and mobile share this list. */
export const primaryNavigation: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/properties?purpose=rent' },
  { label: 'Projects', href: '/projects' },
  { label: 'Locations', href: '/locations' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/#contact' },
]

/** Sticky call-to-action shown at the end of the navigation bar. */
export const navigationCta: NavigationLink = {
  label: 'Book an Inspection',
  href: '/contact?type=inspection',
  variant: 'accent',
}

/** Footer link columns. */
export const footerNavigation: NavigationGroup[] = [
  {
    id: 'footer-properties',
    title: 'Properties',
    links: [
      { label: 'All Properties', href: '/properties' },
      { label: 'Buy', href: '/buy' },
      { label: 'Rent', href: '/properties?purpose=rent' },
      { label: 'Projects', href: '/projects' },
      { label: 'Locations', href: '/locations' },
    ],
  },
  {
    id: 'footer-company',
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Book an Inspection', href: '/contact?type=inspection' },
      { label: 'Insights', href: '/#insights' },
    ],
  },
]

export const footerServices: NavigationGroup = {
  id: 'footer-services',
  title: 'Services',
  links: [
    { label: 'Property Sales', href: '/services/property-sales' },
    { label: 'Property Rentals', href: '/services/property-rentals' },
    { label: 'Land', href: '/services/land' },
    { label: 'Property Investment', href: '/services/property-investment' },
  ],
}

export const legalLinks: NavigationLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
]
