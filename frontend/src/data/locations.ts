import type { GeoLocation, LocationSummary } from '@/types'

/**
 * Canonical location records.
 * Shared by properties, developments and the locations section so a single
 * edit propagates everywhere (later: a `locations` table in PostgreSQL).
 */
export const locations = {
  lekkiPhase1: {
    id: 'loc-lekki-phase-1',
    slug: 'lekki-phase-1',
    name: 'Lekki Phase 1',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Lekki Phase 1, Lagos',
  },
  ajah: {
    id: 'loc-ajah',
    slug: 'ajah',
    name: 'Ajah',
    city: 'Ajah',
    state: 'Lagos',
    label: 'Ajah, Lagos',
  },
  ikoyi: {
    id: 'loc-ikoyi',
    slug: 'ikoyi',
    name: 'Ikoyi',
    city: 'Ikoyi',
    state: 'Lagos',
    label: 'Ikoyi, Lagos',
  },
  ikeja: {
    id: 'loc-ikeja',
    slug: 'ikeja',
    name: 'Ikeja',
    city: 'Ikeja',
    state: 'Lagos',
    label: 'Ikeja, Lagos',
  },
  victoriaIsland: {
    id: 'loc-victoria-island',
    slug: 'victoria-island',
    name: 'Victoria Island',
    city: 'Victoria Island',
    state: 'Lagos',
    label: 'Victoria Island, Lagos',
  },
  yaba: {
    id: 'loc-yaba',
    slug: 'yaba',
    name: 'Yaba',
    city: 'Yaba',
    state: 'Lagos',
    label: 'Yaba, Lagos',
  },
  bananaIsland: {
    id: 'loc-banana-island',
    slug: 'banana-island',
    name: 'Banana Island',
    city: 'Ikoyi',
    state: 'Lagos',
    label: 'Banana Island, Lagos',
  },
  gupe: {
    id: 'loc-gupe',
    slug: 'gupe',
    name: 'Gupe',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Gupe, Lekki, Lagos',
  },
  sangotedo: {
    id: 'loc-sangotedo',
    slug: 'sangotedo',
    name: 'Sangotedo',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Sangotedo, Lekki, Lagos',
  },
  chevron: {
    id: 'loc-chevron',
    slug: 'chevron',
    name: 'Chevron',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Chevron, Lekki, Lagos',
  },
  osapa: {
    id: 'loc-osapa',
    slug: 'osapa',
    name: 'Osapa',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Osapa, Lekki, Lagos',
  },
  ikota: {
    id: 'loc-ikota',
    slug: 'ikota',
    name: 'Ikota',
    city: 'Ikoyi',
    state: 'Lagos',
    label: 'Ikota, Ikoyi, Lagos',
  },
  okokomaiko: {
    id: 'loc-okokomaiko',
    slug: 'okokomaiko',
    name: 'Okokomaiko',
    city: 'Lagos',
    state: 'Lagos',
    label: 'Okokomaiko, Lagos',
  },
  magodo: {
    id: 'loc-magodo',
    slug: 'magodo',
    name: 'Magodo',
    city: 'Lagos',
    state: 'Lagos',
    label: 'Magodo, Lagos',
  },
  lekkiPhase2: {
    id: 'loc-lekki-phase-2',
    slug: 'lekki-phase-2',
    name: 'Lekki Phase 2',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Lekki Phase 2, Lagos',
  },
} satisfies Record<string, GeoLocation>

/** Locations promoted in the "Explore Prime Locations" section. */
export const featuredLocations: LocationSummary[] = [
  {
    ...locations.lekkiPhase1,
    description:
      'Established residential addresses with strong value growth and easy access to the Lekki corridor.',
    image: {
      src: '/images/locations/lekki.webp',
      alt: 'Aerial view of the Lekki district and surrounding neighbourhoods in Lagos',
    },
    availableProperties: 86,
  },
  {
    ...locations.ajah,
    description:
      'Affordable, fast-developing communities offering larger plots and newer estates.',
    image: {
      src: '/images/locations/ajah.webp',
      alt: 'Open green landscape on the outskirts of Ajah, Lagos',
    },
    availableProperties: 64,
  },
  {
    ...locations.ikoyi,
    description:
      'The address of choice for executives, embassies and premium residential projects.',
    image: {
      src: '/images/locations/ikoyi.webp',
      alt: 'Ikoyi skyline at dusk with illuminated high-rise buildings',
    },
    availableProperties: 41,
  },
  {
    ...locations.ikeja,
    description:
      'Central Lagos convenience — close to the airport, business districts and major amenities.',
    image: {
      src: '/images/locations/ikeja.webp',
      alt: 'Ikeja commercial district skyline at night',
    },
    availableProperties: 73,
  },
  {
    ...locations.victoriaIsland,
    description:
      'Nigeria’s business centre, home to landmark offices, serviced apartments and retail.',
    image: {
      src: '/images/locations/victoria-island.webp',
      alt: 'Victoria Island business district with modern towers',
    },
    availableProperties: 52,
  },
  {
    ...locations.yaba,
    description:
      'A thriving technology and creative hub with growing residential demand.',
    image: {
      src: '/images/locations/yaba.webp',
      alt: 'Yaba district street view with modern buildings',
    },
    availableProperties: 38,
  },
]
