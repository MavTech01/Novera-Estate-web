import type { Development } from '../types'
import { locations } from './locations'

/** Featured project spotlight on the homepage. */
export const featuredDevelopment: Development = {
  id: 'dev-001',
  slug: 'the-oasis-residences',
  name: 'The Oasis Residences',
  location: locations.lekkiPhase1,
  startingPrice: 75_000_000,
  availableUnits: 24,
  propertyType: 'Residential Development',
  description:
    'A modern residential development designed for comfortable family living and long-term value.',
  status: 'new-listing',
  completionDate: 'Q4 2026',
  developer: 'Novera Estates Developments',
  highlights: [
    '24 units across 3 blocks',
    'Elegant 3 and 4 bedroom layouts',
    'Estate-wide power and water treatment',
    '24-hour security and CCTV coverage',
    'Flexible payment plans',
  ],
  images: [
    {
      src: '/images/development/oasis-main.webp',
      alt: 'Exterior view of The Oasis Residences development in Lekki, Lagos',
    },
    {
      src: '/images/development/oasis-alt.webp',
      alt: 'Bright open-plan living area inside an Oasis Residences apartment',
    },
  ],
}
