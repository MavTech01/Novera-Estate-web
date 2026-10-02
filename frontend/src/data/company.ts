import { projectPath, routes } from '@/shared/lib/routes'
import type { CompanyProfile, NavigationEntry, NavigationGroup, NavigationLink } from '@/types'
import { featuredDevelopment } from './development'

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

/**
 * Primary navigation — desktop and mobile are driven by this one array.
 *
 * Entries without `items` are plain links; entries with `items` render as a
 * dropdown on desktop and an accordion section on mobile. The order and labels
 * here are the single source of truth for both.
 */
export const primaryNavigation: NavigationEntry[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Properties',
    href: '/properties',
    items: [
      {
        label: 'All Properties',
        href: '/properties',
        icon: 'building-2',
        description: 'Every home, apartment, land and commercial listing.',
      },
      {
        label: 'Buy',
        href: '/buy',
        icon: 'key',
        description: 'A guided way into the for-sale catalogue.',
      },
      {
        label: 'Rent',
        href: '/rent',
        icon: 'house',
        description: 'A guided way into the rental catalogue.',
      },
      {
        label: 'Land',
        href: '/properties?type=land',
        icon: 'land-plot',
        description: 'Serviced and residential plots ready to build on.',
      },
      {
        label: 'Commercial',
        href: '/properties?type=commercial',
        icon: 'store',
        description: 'Offices, retail and commercial space.',
      },
    ],
  },
  {
    label: 'Projects',
    href: '/projects',
    items: [
      {
        label: 'Estates & Developments',
        href: '/projects',
        icon: 'building',
        description: 'Residential developments we are bringing to life.',
      },
      {
        label: 'Featured Project',
        href: projectPath(featuredDevelopment.slug),
        icon: 'sparkles',
        description: `A closer look at ${featuredDevelopment.name}.`,
      },
    ],
  },
  {
    label: 'Locations',
    href: '/locations',
    items: [
      {
        label: 'All Locations',
        href: '/locations',
        icon: 'map',
        description: 'Every area we cover, with what each one offers.',
      },
      { label: 'Lekki', href: '/locations/lekki', icon: 'map-pin', description: 'The Lekki corridor and its estates.' },
      { label: 'Ikoyi', href: '/locations/ikoyi', icon: 'map-pin', description: 'Prime island addresses and penthouses.' },
      { label: 'Ikeja', href: '/locations/ikeja', icon: 'map-pin', description: 'Central homes with strong transport links.' },
      {
        label: 'Victoria Island',
        href: '/locations/victoria-island',
        icon: 'map-pin',
        description: 'Business district living and offices.',
      },
      { label: 'Ajah', href: '/locations/ajah', icon: 'map-pin', description: 'Fast-growing value along the Lekki axis.' },
      { label: 'Yaba', href: '/locations/yaba', icon: 'map-pin', description: 'Compact city living near the tech cluster.' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About Us', href: '/about', icon: 'users', description: 'Who we are and how we work.' },
      { label: 'Insights', href: '/#insights', icon: 'file-text', description: 'Guides and notes on the Lagos market.' },
      { label: 'Testimonials', href: '/#testimonials', icon: 'quote', description: 'What clients say about working with us.' },
    ],
  },
      { label: 'Contact', href: routes.contact },
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
      { label: 'Rent', href: '/rent' },
      { label: 'Projects', href: '/projects' },
      { label: 'Locations', href: '/locations' },
    ],
  },
  {
    id: 'footer-company',
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
  { label: 'Contact', href: routes.contact },
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
