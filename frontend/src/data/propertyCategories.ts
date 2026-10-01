import type { PropertyCategory } from '@/types'

/** "Explore Properties" grid. */
export const propertyCategories: PropertyCategory[] = [
  {
    id: 'cat-houses',
    slug: 'houses',
    name: 'Houses',
    description: 'Detached, semi-detached and terraced family homes.',
    image: {
      src: '/images/categories/houses.webp',
      alt: 'A detached family house with a front lawn and covered entrance',
    },
    href: '/properties?type=house',
  },
  {
    id: 'cat-apartments',
    slug: 'apartments',
    name: 'Apartments',
    description: 'Serviced flats, maisonettes and short-let apartments.',
    image: {
      src: '/images/categories/apartments.webp',
      alt: 'Modern apartment building with balconies and large windows',
    },
    href: '/properties?type=apartment',
  },
  {
    id: 'cat-land',
    slug: 'land',
    name: 'Land',
    description: 'Documented plots in fast-growing corridors.',
    image: {
      src: '/images/categories/land.webp',
      alt: 'Cleared, surveyed plots of land awaiting development',
    },
    href: '/properties?type=land',
  },
  {
    id: 'cat-commercial',
    slug: 'commercial',
    name: 'Commercial',
    description: 'Offices, retail space and mixed-use units.',
    image: {
      src: '/images/categories/commercial.webp',
      alt: 'Contemporary commercial office building facade',
    },
    href: '/properties?type=commercial',
  },
  {
    id: 'cat-luxury',
    slug: 'luxury-properties',
    name: 'Luxury Properties',
    description: 'Signature homes in prime Lagos addresses.',
    image: {
      src: '/images/categories/luxury.webp',
      alt: 'Contemporary luxury home with large glazing and pool',
    },
    href: '/properties?type=luxury',
  },
  {
    id: 'cat-developments',
    slug: 'new-developments',
    name: 'New Developments',
    description: 'Off-plan and completed estate projects.',
    image: {
      src: '/images/categories/developments.webp',
      alt: 'New multi-unit residential development under construction',
    },
    href: '/projects',
  },
]
