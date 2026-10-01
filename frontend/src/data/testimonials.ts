import type { Testimonial } from '@/types'

/** Client testimonials. */
export const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'Adaeze & Chidi Nwosu',
    role: 'Homeowners',
    location: 'Lekki Phase 1',
    quote:
      'From the first viewing to the keys, the Novera Estates team was clear, patient and honest about every detail. We never felt rushed into a decision.',
    avatar: {
      src: '/images/team/ad-hoc.webp',
      alt: 'Portrait of Adaeze Nwosu, Novera Estates client',
    },
    rating: 5,
  },
  {
    id: 'test-002',
    name: 'Babatunde Okafor',
    role: 'Land Investor',
    location: 'Ajah',
    quote:
      'I had been hesitant about buying land for years. The documentation checks they did before I paid gave me the confidence I needed. Everything was verified in writing.',
    avatar: {
      src: '/images/team/tunde-b.webp',
      alt: 'Portrait of Babatunde Okafor, Novera Estates client',
    },
    rating: 5,
  },
  {
    id: 'test-003',
    name: 'Chiamaka Eze',
    role: 'Tenant',
    location: 'Victoria Island',
    quote:
      'Finding a serviced apartment in Victoria Island felt impossible until I spoke with Novera Estates. They short-listed options, arranged inspections and handled the agreement.',
    avatar: {
      src: '/images/team/chiamaka.webp',
      alt: 'Portrait of Chiamaka Eze, Novera Estates client',
    },
    rating: 5,
  },
]
