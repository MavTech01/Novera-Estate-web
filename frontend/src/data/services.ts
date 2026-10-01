import type { Service } from '@/types'

/** Services shown in the swipeable "Our Services" carousel. */
export const services: Service[] = [
  {
    id: 'service-sales',
    slug: 'property-sales',
    title: 'Property Sales',
    caption: 'Sales & exchanges',
    description:
      'From first viewing to signed documents, we handle valuations, negotiation and the paperwork behind every sale.',
    icon: 'badge-check',
    image: {
      src: '/images/categories/houses.webp',
      alt: 'Detached family home listed for sale by Novera Estates',
    },
    href: '/services/property-sales',
  },
  {
    id: 'service-rentals',
    slug: 'property-rentals',
    title: 'Property Rentals',
    caption: 'Long & short term',
    description:
      'Verified tenants, structured leases and deposit handling for landlords and renters across Lagos.',
    icon: 'key',
    image: {
      src: '/images/categories/apartments.webp',
      alt: 'Serviced apartment building available for rent',
    },
    href: '/services/property-rentals',
  },
  {
    id: 'service-land',
    slug: 'land',
    title: 'Land & Documentation',
    caption: 'Plots & surveys',
    description:
      'Genuine plots with clean title, survey references and site inspections arranged before you commit.',
    icon: 'land-plot',
    image: {
      src: '/images/categories/land.webp',
      alt: 'Serviced residential land awaiting development',
    },
    href: '/services/land',
  },
  {
    id: 'service-investment',
    slug: 'property-investment',
    title: 'Property Investment',
    caption: 'Portfolio advice',
    description:
      'Rental yield, location and exit strategy considered together so your capital works harder.',
    icon: 'trending-up',
    image: {
      src: '/images/categories/commercial.webp',
      alt: 'Commercial property in a growing business district',
    },
    href: '/services/property-investment',
  },
  {
    id: 'service-management',
    slug: 'property-management',
    title: 'Property Management',
    caption: 'Rent collection',
    description:
      'Ongoing maintenance, tenant coordination and rent collection for owners who live elsewhere.',
    icon: 'building-2',
    image: {
      src: '/images/categories/developments.webp',
      alt: 'Managed residential development with multiple units',
    },
    href: '/services/property-management',
  },
]
