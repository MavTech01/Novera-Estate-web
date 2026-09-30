import type {
  Coordinates,
  Property,
  PropertyDetail,
  PropertyDetailExtras,
  PropertyDocumentation,
  PropertySurroundings,
} from '../types'
import { properties } from './properties'
import { findSimilarProperties } from '../lib/propertyDetails'
import { propertyTypeLabels } from '../lib/labels'

/**
 * Detail-page data for the demo catalogue.
 *
 * `properties.ts` stays the shared listing source (cards, filters, grids) and
 * this module only adds what a single-property page needs. The API will return
 * one merged `PropertyDetail` object, so `buildPropertyDetail` below is the
 * place where the two halves are combined — components never see the split.
 *
 * All content here is fictional sample material for this demo. Nothing in this
 * file describes a real property, owner, agent or document.
 */

/* -------------------------------------------------------------------------- */
/* Documentation                                                               */
/* -------------------------------------------------------------------------- */

const DEMO_DOCUMENTATION_NOTE =
  'Demo information for sample listings. Documents are not verified and no legal checks have been carried out.'

/**
 * Documentation is the one block where over-claiming would be costly, so it is
 * always tagged as demo content and carries the same note wherever it appears.
 * Callers supply only the entries; the note and flag are filled in here so they
 * cannot drift apart between listings.
 */
function buildDocumentation(overrides: Omit<PropertyDocumentation, 'isDemo' | 'note'>): PropertyDocumentation {
  return { ...overrides, isDemo: true, note: DEMO_DOCUMENTATION_NOTE }
}

/* -------------------------------------------------------------------------- */
/* Per-listing extras                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Keyed by `Property.id`. Only the listings used to demonstrate a full detail
 * page carry an entry; everything else is normalised from its base record.
 */
const detailExtras: Record<string, PropertyDetailExtras> = {
  'prop-001': {
    subType: 'Detached Duplex',
    availability: 'available',
    livingRooms: 2,
    bq: 1,
    createdAt: '2026-02-05',
    coordinates: { lat: 6.4478, lng: 3.4735 },
    summary:
      'A spacious four-bedroom detached duplex with private parking, landscaped garden and a self-contained service quarters wing.',
    description: [
      'This beautifully designed four-bedroom detached duplex offers spacious interiors, modern finishes and convenient access to the major areas of Lagos. It sits on a quiet, fully serviced road in Lekki Phase 1, a short drive from Admiralty Way and the Lekki corridor.',
      'The ground floor is arranged around a generous living room and a separate formal lounge, both opening onto a paved courtyard through wide sliding doors. A separate dining area sits alongside a fully fitted kitchen with granite counters, built-in appliances and a walk-in pantry.',
      'All four bedrooms are en-suite. The master suite occupies the entire upper floor and includes a private balcony, a dressing area and a Jack-and-Jill bathroom. Three additional bedrooms, a dedicated family lounge and a laundry wing complete the upper level.',
      'Outside, the compound is fully paved with room for four cars, a detached gatehouse and a manned gate. Landscaped gardens, a borehole with treatment plant, a standby generator with automatic changeover and a perimeter wall with CCTV complete the estate. Staff accommodation with its own entrance sits at the rear of the plot.',
    ].join('\n\n'),
    features: [
      'Fully Fitted Kitchen',
      'Modern Finishing',
      '24/7 Security',
      'Parking Space',
      'Service Quarters (BQ)',
      'Standby Generator',
      'Borehole & Water Supply',
      'Landscaped Garden',
      'Swimming Pool',
      'CCTV Coverage',
      'All En-Suite Bedrooms',
      'Power Supply (Grid + Solar Backup)',
    ],
    amenities: [
      'Private Courtyard',
      'Laundry Wing',
      'Walk-in Pantry',
      'Fitted Wardrobes',
      'Balcony',
      'Boys’ Quarters',
      'Gatehouse',
      'Borehole',
    ],
    gallery: [
      {
        src: '/images/properties/lekki-duplex.webp',
        alt: 'Front elevation of a luxury four bedroom detached duplex in Lekki Phase 1, Lagos',
      },
      {
        src: '/images/development/oasis-alt.webp',
        alt: 'Open-plan living area with large windows inside the Lekki duplex',
      },
      {
        src: '/images/categories/luxury.webp',
        alt: 'Modern fitted kitchen with granite worktops in the duplex',
      },
      {
        src: '/images/locations/lekki.webp',
        alt: 'Serviced residential street in Lekki Phase 1, Lagos',
      },
      {
        src: '/images/ui/cta-image.webp',
        alt: 'Contemporary Novera Estates residence photographed at dusk',
      },
    ],
    documentation: buildDocumentation({
      entries: [
        { id: 'title', label: 'Title', value: 'Available', status: 'available' },
        { id: 'survey', label: 'Survey', value: 'Available', status: 'available' },
        { id: 'deed', label: 'Deed of Assignment', value: 'Available', status: 'available' },
        { id: 'possession', label: 'Possession', value: 'Available', status: 'available' },
        {
          id: 'reference',
          label: 'Registered Reference',
          value: 'M/pandas/LA/7741',
          status: 'available',
        },
      ],
    }),
  },
  'prop-002': {
    subType: 'Serviced Apartment',
    availability: 'available',
    livingRooms: 1,
    bq: null,
    createdAt: '2026-02-26',
    coordinates: { lat: 6.4541, lng: 3.4352 },
    features: [
      'Fully Fitted Kitchen',
      'Fitted Wardrobes',
      'Concierge Service',
      '24/7 Security',
      'Rooftop Lounge',
      'Lift Access',
      'Smart Home System',
      'CCTV Coverage',
      'Backup Power',
      'Swimming Pool',
      'Gym',
      'Parking Space',
    ],
    amenities: ['Shared Pool', 'Gym', 'Visitor Parking', 'Reception', 'Housekeeping'],
    gallery: [
      {
        src: '/images/properties/ikoyi-apartment.webp',
        alt: 'Contemporary three bedroom apartment interior in Ikoyi, Lagos',
      },
      {
        src: '/images/properties/ikeja-residence.webp',
        alt: 'Exterior of the serviced apartment building in Ikoyi',
      },
      {
        src: '/images/categories/apartments.webp',
        alt: 'Shared rooftop terrace of a serviced apartment building',
      },
    ],
    documentation: buildDocumentation({
      entries: [
        { id: 'title', label: 'Title', value: 'On request', status: 'pending' },
        { id: 'survey', label: 'Survey', value: 'On request', status: 'pending' },
        { id: 'possession', label: 'Possession', value: 'Available', status: 'available' },
      ],
    }),
  },
  'prop-003': {
    subType: 'Serviced Residential Plot',
    availability: 'available',
    livingRooms: null,
    bq: null,
    createdAt: '2026-01-20',
    coordinates: { lat: 6.4695, lng: 3.5853 },
    features: [
      'Registered Survey',
      'Deed of Assignment',
      'Gated Estate',
      'Graded Roads',
      'Drainage in Place',
      'Street Lighting',
      'Perimeter Wall',
      'Immediate Possession',
    ],
    amenities: ['Water Supply', 'Power Supply', 'Estate Security'],
    documentation: buildDocumentation({
      entries: [
        { id: 'survey', label: 'Survey', value: 'Registered', status: 'available' },
        { id: 'deed', label: 'Deed of Assignment', value: 'Executed', status: 'available' },
        { id: 'possession', label: 'Possession', value: 'Immediate', status: 'available' },
        {
          id: 'reference',
          label: 'Registered Reference',
          value: 'LA/AJ/9920/21',
          status: 'available',
        },
      ],
    }),
  },
  'prop-005': {
    subType: 'Waterfront Residence',
    availability: 'available',
    livingRooms: 2,
    bq: 1,
    createdAt: '2026-03-02',
    coordinates: { lat: 6.4478, lng: 3.4735 },
    features: [
      'Private Jetty Access',
      'Home Automation',
      '24/7 Security',
      'Swimming Pool',
      'Gym',
      'Cinema Room',
      'Service Quarters (BQ)',
      'Generator',
      'Lift Access',
      'Parking Space',
      'CCTV Coverage',
      'Landscaped Garden',
    ],
    amenities: ['Spa', 'Cinema', 'Lift', 'Staff Quarters', 'Borehole'],
  },
  'prop-009': {
    subType: 'Terrace Duplex',
    availability: 'available',
    livingRooms: 2,
    bq: null,
    createdAt: '2026-03-04',
    coordinates: { lat: 6.4512, lng: 3.4856 },
    features: [
      'Fully Fitted Kitchen',
      'Rooftop Terrace',
      'All En-Suite Bedrooms',
      'Parking Space',
      'CCTV Coverage',
      'Borehole & Water Supply',
      '24/7 Security',
      'Power Supply',
    ],
    amenities: ['Laundry', 'Fitted Wardrobes', 'Store'],
  },
  'prop-006': {
    subType: 'Semi-Detached Duplex',
    availability: 'available',
    livingRooms: 1,
    bq: 1,
    createdAt: '2026-01-12',
    coordinates: { lat: 6.4401, lng: 3.4721 },
    features: [
      'All En-Suite Rooms',
      'Quiet Estate',
      'Paved Compound',
      'Parking Space',
      'Standby Generator',
      'Borehole & Water Supply',
      'Estate Security',
      'Recreation Area',
    ],
    amenities: ['Fence', 'Borehole', 'Car Park', 'Gatehouse'],
  },
  'prop-015': {
    subType: 'Off-Plan Apartment',
    availability: 'available',
    livingRooms: 1,
    bq: null,
    createdAt: '2026-03-10',
    coordinates: { lat: 6.4478, lng: 3.4735 },
    features: [
      'Off-Plan Payment Plan',
      '2027 Handover',
      'Fully Fitted Kitchen',
      'Fitted Wardrobes',
      'Parking Space',
      'Lift Access',
      '24/7 Security',
      'CCTV Coverage',
      'Swimming Pool',
      'Gym',
    ],
    amenities: ['Gym', 'Lift', 'CCTV', 'Shared Pool'],
  },
  'prop-012': {
    subType: 'Serviced Residential Plot',
    availability: 'available',
    createdAt: '2026-01-28',
    coordinates: { lat: 6.4622, lng: 3.5318 },
    features: [
      'Registered Survey',
      'Deed of Assignment',
      'Graded Roads',
      'Drainage in Place',
      'Street Lighting',
      'Gated Estate',
      'Perimeter Wall',
      'Immediate Possession',
    ],
    amenities: ['Water Supply', 'Power Supply', 'Estate Security'],
  },
}

/* -------------------------------------------------------------------------- */
/* Location-level data                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Approximate centres, used only to give the map placeholder a pin to drop.
 * They are not survey-grade coordinates and are not used for navigation.
 */
const coordinatesByLocation: Record<string, Coordinates> = {
  'lekki-phase-1': { lat: 6.4478, lng: 3.4735 },
  'lekki-phase-2': { lat: 6.4512, lng: 3.4856 },
  ajah: { lat: 6.4695, lng: 3.5853 },
  ikoyi: { lat: 6.4541, lng: 3.4352 },
  ikota: { lat: 6.4638, lng: 3.4432 },
  'victoria-island': { lat: 6.4281, lng: 3.4219 },
  yaba: { lat: 6.5095, lng: 3.3711 },
  'banana-island': { lat: 6.4402, lng: 3.4408 },
  gupe: { lat: 6.4401, lng: 3.4721 },
  sangotedo: { lat: 6.4622, lng: 3.5318 },
  chevron: { lat: 6.3535, lng: 3.7065 },
  osapa: { lat: 6.4128, lng: 3.6552 },
  okokomaiko: { lat: 6.4636, lng: 3.3547 },
  magodo: { lat: 6.8312, lng: 3.4156 },
}

/**
 * Indicative surroundings per area, shared by every listing in that area.
 * Landmarks are named at neighbourhood level and no distances are quoted,
 * because none of this has been verified.
 */
const surroundingsByLocation: Record<string, PropertySurroundings[]> = {
  'lekki-phase-1': [
    {
      category: 'nearby-areas',
      label: 'Nearby Areas',
      icon: 'compass',
      items: ['Lekki Phase 1', 'Admiralty Way', 'Marina', 'Lekki Phase 2'],
    },
    {
      category: 'major-roads',
      label: 'Major Roads',
      icon: 'navigation',
      items: ['Lekki–Epe Expressway', 'Admiralty Way', 'Marina Road', 'Lekki Phase 1 Link Road'],
    },
    {
      category: 'schools',
      label: 'Schools',
      icon: 'graduation-cap',
      items: ['British School', 'St. Nicholas Primary School', 'Lekki British School vicinity', 'Nearby secondary schools'],
    },
    {
      category: 'hospitals',
      label: 'Hospitals',
      icon: 'heart-pulse',
      items: ['Ikoyi Hospital', 'Lekki General Hospital area', 'Private clinics along Admiralty Way'],
    },
    {
      category: 'shopping',
      label: 'Shopping',
      icon: 'shopping-bag',
      items: ['Admiralty Shopping Centre', 'Local retail along Lekki–Epe Expressway', 'Nearby supermarkets'],
    },
    {
      category: 'transportation',
      label: 'Transportation',
      icon: 'bus',
      items: ['BRT corridor', 'Lekki–Epe Expressway traffic', 'Waterways and private boats', 'Ride-hailing pickup points'],
    },
  ],
  'lekki-phase-2': [
    {
      category: 'nearby-areas',
      label: 'Nearby Areas',
      icon: 'compass',
      items: ['Lekki Phase 2', 'Lekki Phase 1', 'Victoria Island', 'Admiralty Way'],
    },
    {
      category: 'major-roads',
      label: 'Major Roads',
      icon: 'navigation',
      items: ['Lekki–Epe Expressway', 'Lekki Phase 2 Link Road', 'Marina Road'],
    },
    {
      category: 'schools',
      label: 'Schools',
      icon: 'graduation-cap',
      items: ['Nearby primary and secondary schools in Lekki'],
    },
    {
      category: 'hospitals',
      label: 'Hospitals',
      icon: 'heart-pulse',
      items: ['Ikoyi Hospital', 'Nearby private clinics'],
    },
    {
      category: 'shopping',
      label: 'Shopping',
      icon: 'shopping-bag',
      items: ['Retail along the Lekki–Epe Expressway', 'Nearby supermarkets'],
    },
    {
      category: 'transportation',
      label: 'Transportation',
      icon: 'bus',
      items: ['BRT corridor', 'Ride-hailing pickup points', 'Waterway access'],
    },
  ],
  ajah: [
    {
      category: 'nearby-areas',
      label: 'Nearby Areas',
      icon: 'compass',
      items: ['Ajah', 'Sangotedo', 'Lekki Phase 2', 'Addo'],
    },
    {
      category: 'major-roads',
      label: 'Major Roads',
      icon: 'navigation',
      items: ['Lekki–Epe Expressway', 'Sangotedo Link Road', 'Ajah Bypass'],
    },
    {
      category: 'schools',
      label: 'Schools',
      icon: 'graduation-cap',
      items: ['International schools along the Lekki–Epe corridor', 'Nearby secondary schools'],
    },
    {
      category: 'hospitals',
      label: 'Hospitals',
      icon: 'heart-pulse',
      items: ['Ajah General Hospital area', 'Nearby primary health centres'],
    },
    {
      category: 'shopping',
      label: 'Shopping',
      icon: 'shopping-bag',
      items: ['Retail parks along the expressway', 'Local markets in Ajah'],
    },
    {
      category: 'transportation',
      label: 'Transportation',
      icon: 'bus',
      items: ['BRT and bus terminals', 'Ride-hailing pickup points', 'Waterway access'],
    },
  ],
  ikoyi: [
    {
      category: 'nearby-areas',
      label: 'Nearby Areas',
      icon: 'compass',
      items: ['Ikoyi', 'Victoria Island', 'Banana Island', 'Ikota'],
    },
    {
      category: 'major-roads',
      label: 'Major Roads',
      icon: 'navigation',
      items: ['Lekki–Epe Expressway', 'Ozumba Mbadiwe Avenue', 'Marina Road'],
    },
    {
      category: 'schools',
      label: 'Schools',
      icon: 'graduation-cap',
      items: ['International schools in Ikoyi', 'Nearby secondary schools'],
    },
    {
      category: 'hospitals',
      label: 'Hospitals',
      icon: 'heart-pulse',
      items: ['Ikoyi Hospital', 'Private clinics along Ozumba Mbadiwe Avenue'],
    },
    {
      category: 'shopping',
      label: 'Shopping',
      icon: 'shopping-bag',
      items: ['Retail along Ozumba Mbadiwe Avenue', 'Nearby supermarkets and malls'],
    },
    {
      category: 'transportation',
      label: 'Transportation',
      icon: 'bus',
      items: ['BRT corridor', 'Private boat terminals', 'Ride-hailing pickup points'],
    },
  ],
  'victoria-island': [
    {
      category: 'nearby-areas',
      label: 'Nearby Areas',
      icon: 'compass',
      items: ['Victoria Island', 'Lekki', 'Ikoyi', 'Marina'],
    },
    {
      category: 'major-roads',
      label: 'Major Roads',
      icon: 'navigation',
      items: ['Ozumba Mbadiwe Avenue', 'Lekki–Epe Expressway', 'Adetokunbo Ademola Street'],
    },
    {
      category: 'schools',
      label: 'Schools',
      icon: 'graduation-cap',
      items: ['International schools on Victoria Island', 'Nearby secondary schools'],
    },
    {
      category: 'hospitals',
      label: 'Hospitals',
      icon: 'heart-pulse',
      items: ['Island clinics', 'Nearby teaching hospitals'],
    },
    {
      category: 'shopping',
      label: 'Shopping',
      icon: 'shopping-bag',
      items: ['Malls along Adetokunbo Ademola Street', 'Local retail'],
    },
    {
      category: 'transportation',
      label: 'Transportation',
      icon: 'bus',
      items: ['BRT corridor', 'Waterway and ferry services', 'Ride-hailing pickup points'],
    },
  ],
  default: [
    {
      category: 'nearby-areas',
      label: 'Nearby Areas',
      icon: 'compass',
      items: ['Surrounding residential districts', 'Nearby commercial areas'],
    },
    {
      category: 'major-roads',
      label: 'Major Roads',
      icon: 'navigation',
      items: ['Nearby main roads and expressway links'],
    },
    {
      category: 'schools',
      label: 'Schools',
      icon: 'graduation-cap',
      items: ['Nearby primary and secondary schools'],
    },
    {
      category: 'hospitals',
      label: 'Hospitals',
      icon: 'heart-pulse',
      items: ['Nearby general hospitals and clinics'],
    },
    {
      category: 'shopping',
      label: 'Shopping',
      icon: 'shopping-bag',
      items: ['Nearby retail centres and local markets'],
    },
    {
      category: 'transportation',
      label: 'Transportation',
      icon: 'bus',
      items: ['Nearby bus terminals', 'Ride-hailing pickup points'],
    },
  ],
}

const SURROUNDINGS_DISCLAIMER =
  'Indicative surroundings for demo purposes — landmarks are named at neighbourhood level and no distances are verified.'

/* -------------------------------------------------------------------------- */
/* Normalisation                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Merges a catalogue listing with its detail extras.
 *
 * This is the single place where detail-page fields are resolved, so the
 * component tree receives a complete `PropertyDetail` exactly as the future
 * `GET /api/properties/:slug` response will provide it.
 */
export function buildPropertyDetail(property: Property, extras?: PropertyDetailExtras): PropertyDetail {
  const resolved = extras ?? detailExtras[property.id] ?? {}

  return {
    ...property,
    subType: resolved.subType ?? propertyTypeLabels[property.propertyType],
    availability: resolved.availability ?? 'available',
    livingRooms: resolved.livingRooms ?? null,
    bq: resolved.bq ?? (property.tags.includes('bq') ? 1 : null),
    coordinates: resolved.coordinates ?? coordinatesByLocation[property.location.slug] ?? null,
    description: resolved.description ?? property.description,
    summary: resolved.summary ?? property.summary,
    features: resolved.features ?? property.features,
    amenities: resolved.amenities ?? property.amenities,
    documentation: resolved.documentation ?? buildFallbackDocumentation(property),
    surroundings: surroundingsByLocation[property.location.slug] ?? surroundingsByLocation.default,
    createdAt: resolved.createdAt ?? property.listedAt,
    gallery: resolved.gallery?.length ? resolved.gallery : property.images,
  }
}

/**
 * Documentation inferred from the base listing.
 * Anything not covered by an explicit extras record is described as unknown
 * rather than assumed, so no field implies a completed legal check.
 */
function buildFallbackDocumentation(property: Property): PropertyDocumentation {
  return buildDocumentation({
    entries: [
      {
        id: 'title',
        label: 'Title',
        value: property.titleReference ? 'Available' : 'Not recorded',
        status: property.titleReference ? 'available' : 'pending',
      },
      { id: 'survey', label: 'Survey', value: 'Not recorded', status: 'pending' },
      { id: 'possession', label: 'Possession', value: 'Available', status: 'available' },
    ],
  })
}

/* -------------------------------------------------------------------------- */
/* Selectors                                                                   */
/* -------------------------------------------------------------------------- */

/** Detail payload for a slug, or `null` when no listing matches. */
export function getPropertyDetailBySlug(slug: string): PropertyDetail | null {
  const property = properties.find((item) => item.slug === slug)
  return property ? buildPropertyDetail(property) : null
}

/** The closest listings in the catalogue, for the "You may also like" row. */
export function getSimilarProperties(property: Property, limit = 3): Property[] {
  return findSimilarProperties(property, properties, limit)
}

export { SURROUNDINGS_DISCLAIMER }
