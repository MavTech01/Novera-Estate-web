import type {
  ProjectAccessNote,
  ProjectLandmark,
  ProjectLocationHighlight,
} from '@/features/projects/types/projectTypes'

/**
 * Location detail, written once per neighbourhood rather than once per project.
 *
 * Several developments sit in each location, so the surroundings and access
 * notes belong to the place — not to an individual scheme. Projects look their
 * entry up by `locationSlug` in `buildProjectLocationInfo`.
 *
 * Nothing here states a distance, travel time or travel duration. Precise
 * figures would need a routing service and geocoded addresses that this
 * frontend does not have, and inventing them would read as verified fact.
 */

interface ProjectLocationContent {
  /** Scheme-facing address; every development in the area shares the wording. */
  address: string
  nearby: ProjectLandmark[]
  accessibility: ProjectAccessNote[]
  highlights: ProjectLocationHighlight[]
}

const lekki: ProjectLocationContent = {
  address: 'Admiralty Way corridor, Lekki Phase 1, Lagos',
  nearby: [
    { id: 'lekki-shopping', category: 'shopping', label: 'Lekki Shopping Malls', icon: 'shopping-bag' },
    { id: 'lekki-schools', category: 'schools', label: 'International schools along the corridor', icon: 'graduation-cap' },
    { id: 'lekki-health', category: 'healthcare', label: 'Private clinics and diagnostic centres', icon: 'heart-pulse' },
    { id: 'lekki-bridge', category: 'roads', label: 'Third Mainland Bridge connection', icon: 'navigation' },
    { id: 'lekki-vi', category: 'business', label: 'Victoria Island business district', icon: 'building-2' },
    { id: 'lekki-mall', category: 'recreation', label: 'Elegance Gardens and waterfront parks', icon: 'trees' },
  ],
  accessibility: [
    {
      id: 'lekki-road',
      label: 'Road network',
      description:
        'The Admiralty Way and Lekki–Epe Expressway corridors connect the area to central Lagos and the western axis of the city.',
      icon: 'navigation',
    },
    {
      id: 'lekki-transit',
      label: 'Public transport',
      description: 'Widely used okada and danfo corridors run along the main routes, with water transport along the lagoon.',
      icon: 'map-pinned',
    },
    {
      id: 'lekki-airport',
      label: 'Airport access',
      description: 'The area sits on a common approach route to Murtala Muhammed International Airport.',
      icon: 'navigation',
    },
  ],
  highlights: [
    {
      id: 'lekki-h1',
      title: 'Established address',
      description:
        'One of the more settled parts of the Lekki corridor, with long-standing amenities already in place around it.',
      icon: 'map-pinned',
    },
    {
      id: 'lekki-h2',
      title: 'Roads and drainage planned in',
      description:
        'New schemes in the area typically plan internal roads, drainage and lighting as part of the estate rather than after handover.',
      icon: 'layers',
    },
    {
      id: 'lekki-h3',
      title: 'Near existing services',
      description:
        'Retail, schools and healthcare along the corridor mean daily essentials are usually reached without a long drive.',
      icon: 'shopping-bag',
    },
  ],
}

const ajah: ProjectLocationContent = {
  address: 'Ajah–Lekki growth corridor, Ajah, Lagos',
  nearby: [
    { id: 'ajah-shopping', category: 'shopping', label: 'Neighbourhood retail centres', icon: 'shopping-bag' },
    { id: 'ajah-schools', category: 'schools', label: 'Primary and secondary schools in the area', icon: 'graduation-cap' },
    { id: 'ajah-health', category: 'healthcare', label: 'General hospitals and pharmacies', icon: 'heart-pulse' },
    { id: 'ajah-expressway', category: 'roads', label: 'Lekki–Epe Expressway', icon: 'navigation' },
    { id: 'ajah-logistics', category: 'business', label: 'Logistics and industrial clusters', icon: 'building-2' },
    { id: 'ajah-beach', category: 'recreation', label: 'Ilashe and waterfront recreation areas', icon: 'waves' },
  ],
  accessibility: [
    {
      id: 'ajah-road',
      label: 'Road network',
      description:
        'The Lekki–Epe Expressway provides the main link into the area, with local roads serving the residential districts.',
      icon: 'navigation',
    },
    {
      id: 'ajah-growth',
      label: 'Growing infrastructure',
      description:
        'Housing, retail and public services are still being added across the corridor, so the immediate surroundings change over time.',
      icon: 'layers',
    },
    {
      id: 'ajah-airport',
      label: 'Airport access',
      description: 'Road routes to Murtala Muhammed International Airport run via the expressway and the Lekki corridor.',
      icon: 'navigation',
    },
  ],
  highlights: [
    {
      id: 'ajah-h1',
      title: 'Room for larger homes',
      description: 'Plot sizes in the area generally allow for bigger floor areas and more generous outdoor space.',
      icon: 'land-plot',
    },
    {
      id: 'ajah-h2',
      title: 'Entry pricing',
      description: 'Schemes here have generally sat below the price point of comparable homes further along the Lekki axis.',
      icon: 'trending-up',
    },
    {
      id: 'ajah-h3',
      title: 'A developing corridor',
      description:
        'The area is still building out its retail and civic infrastructure, which suits buyers comfortable with a developing district.',
      icon: 'construction',
    },
  ],
}

const ikoyi: ProjectLocationContent = {
  address: 'Bourdillon Road, Ikoyi, Lagos',
  nearby: [
    { id: 'ikoyi-schools', category: 'schools', label: 'Embassies and international schools', icon: 'graduation-cap' },
    { id: 'ikoyi-health', category: 'healthcare', label: 'Private hospitals and specialist clinics', icon: 'heart-pulse' },
    { id: 'ikoyi-shopping', category: 'shopping', label: 'Bourdillon and 5th Avenue retail', icon: 'shopping-bag' },
    { id: 'ikoyi-vi', category: 'roads', label: 'Ozumba Mbadiwe Avenue', icon: 'navigation' },
    { id: 'ikoyi-hotels', category: 'business', label: 'Corporate offices and hotels', icon: 'building-2' },
    { id: 'ikoyi-culture', category: 'recreation', label: 'Museums, galleries and dining', icon: 'chef-hat' },
  ],
  accessibility: [
    {
      id: 'ikoyi-road',
      label: 'Road network',
      description:
        'Bourdillon Road and Ozumba Mbadiwe Avenue carry traffic through the district, connecting to Victoria Island and Lekki.',
      icon: 'navigation',
    },
    {
      id: 'ikoyi-water',
      label: 'Waterfront setting',
      description: 'The district fronts the Five Cowrie Creek lagoon, which shapes how the area is approached and viewed.',
      icon: 'waves',
    },
    {
      id: 'ikoyi-airport',
      label: 'Airport access',
      description: 'One of the shorter road routes from the district to Murtala Muhammed International Airport.',
      icon: 'navigation',
    },
  ],
  highlights: [
    {
      id: 'ikoyi-h1',
      title: 'A recognised address',
      description: 'Ikoyi is long established as one of the city\u2019s better-known residential and diplomatic districts.',
      icon: 'map-pinned',
    },
    {
      id: 'ikoyi-h2',
      title: 'Schools and healthcare nearby',
      description:
        'International schools, specialist clinics and private hospitals are concentrated in and around the district.',
      icon: 'graduation-cap',
    },
    {
      id: 'ikoyi-h3',
      title: 'Close to Victoria Island',
      description: 'The business, retail and dining districts of Victoria Island are a short drive away.',
      icon: 'building-2',
    },
  ],
}

const ikeja: ProjectLocationContent = {
  address: 'Obafemi Awolowo Way, Ikeja, Lagos',
  nearby: [
    { id: 'ikeja-shopping', category: 'shopping', label: 'Ikeja City Mall and Computer Village', icon: 'shopping-bag' },
    { id: 'ikeja-schools', category: 'schools', label: 'Government and private schools', icon: 'graduation-cap' },
    { id: 'ikeja-health', category: 'healthcare', label: 'Teaching hospitals and pharmacies', icon: 'heart-pulse' },
    { id: 'ikeja-rail', category: 'roads', label: 'Lagos–Ibadan rail terminus', icon: 'train' },
    { id: 'ikeja-business', category: 'business', label: 'Corporate and commercial offices', icon: 'building-2' },
    { id: 'ikeja-parks', category: 'recreation', label: 'Centenary Park and the Ikeja golf club', icon: 'trees' },
  ],
  accessibility: [
    {
      id: 'ikeja-airport',
      label: 'Airport proximity',
      description: 'Ikeja sits immediately beside Murtala Muhammed International Airport.',
      icon: 'navigation',
    },
    {
      id: 'ikeja-rail',
      label: 'Rail connection',
      description: 'The Lagos–Ibadan railway terminates at Ikeja, providing a rail option into the city centre.',
      icon: 'train',
    },
    {
      id: 'ikeja-road',
      label: 'Road network',
      description:
        'Obafemi Awolowo Way, Airport Road and Agege Road converge on the area, connecting north and south across Lagos.',
      icon: 'navigation',
    },
  ],
  highlights: [
    {
      id: 'ikeja-h1',
      title: 'Central position',
      description: 'Ikeja sits close to the middle of the city, with short road routes in most directions.',
      icon: 'map-pinned',
    },
    {
      id: 'ikeja-h2',
      title: 'Air and rail nearby',
      description: 'The airport and the Lagos–Ibadan rail terminus are both in the immediate area.',
      icon: 'navigation',
    },
    {
      id: 'ikeja-h3',
      title: 'Retail within walking distance',
      description: 'Established retail, food and everyday services are spread across the Ikeja and Computer Village area.',
      icon: 'shopping-bag',
    },
  ],
}

const victoriaIsland: ProjectLocationContent = {
  address: 'Amuwo Odofin, Victoria Island, Lagos',
  nearby: [
    { id: 'vi-shopping', category: 'shopping', label: 'Retail malls and department stores', icon: 'shopping-bag' },
    { id: 'vi-schools', category: 'schools', label: 'International schools and colleges', icon: 'graduation-cap' },
    { id: 'vi-health', category: 'healthcare', label: 'Private hospitals and diagnostic centres', icon: 'heart-pulse' },
    { id: 'vi-lagoon', category: 'roads', label: 'Lagos lagoon waterfront', icon: 'waves' },
    { id: 'vi-business', category: 'business', label: 'Nigeria’s central business district', icon: 'building-2' },
    { id: 'vi-culture', category: 'recreation', label: 'Galleries, parks and waterfront dining', icon: 'chef-hat' },
  ],
  accessibility: [
    {
      id: 'vi-bridge',
      label: 'Lagos Island bridge',
      description: 'The bridge links Victoria Island to the Marina and Lagos Island at the heart of the city.',
      icon: 'navigation',
    },
    {
      id: 'vi-water',
      label: 'Water transport',
      description: 'Ferry services operate across the lagoon between Victoria Island and the Lagos mainland.',
      icon: 'waves',
    },
    {
      id: 'vi-airport',
      label: 'Airport access',
      description: 'Road routes run west to the Lekki corridor and onward to Murtala Muhammed International Airport.',
      icon: 'navigation',
    },
  ],
  highlights: [
    {
      id: 'vi-h1',
      title: 'The business centre',
      description: 'Victoria Island holds a large share of the city’s corporate and commercial office space.',
      icon: 'building-2',
    },
    {
      id: 'vi-h2',
      title: 'Services at hand',
      description: 'Retail, dining, healthcare and international schools are concentrated on the island.',
      icon: 'shopping-bag',
    },
    {
      id: 'vi-h3',
      title: 'Waterfront outlook',
      description: 'Many developments on the island are oriented toward the lagoon rather than a street frontage.',
      icon: 'waves',
    },
  ],
}

const yaba: ProjectLocationContent = {
  address: 'Yaba tech corridor, Yaba, Lagos',
  nearby: [
    { id: 'yaba-tech', category: 'business', label: 'Technology and creative businesses', icon: 'building-2' },
    { id: 'yaba-market', category: 'shopping', label: 'Yaba market and Computer Village', icon: 'shopping-bag' },
    { id: 'yaba-schools', category: 'schools', label: 'Universities and polytechnics', icon: 'graduation-cap' },
    { id: 'yaba-health', category: 'healthcare', label: 'Teaching hospitals and pharmacies', icon: 'heart-pulse' },
    { id: 'yaba-road', category: 'roads', label: 'Third Mainland Bridge connection', icon: 'navigation' },
    { id: 'yaba-park', category: 'recreation', label: 'Jankurao Park and waterfront areas', icon: 'trees' },
  ],
  accessibility: [
    {
      id: 'yaba-bridge',
      label: 'Bridge connection',
      description: 'The Third Mainland Bridge carries road traffic between Yaba and the Lagos Island side of the city.',
      icon: 'navigation',
    },
    {
      id: 'yaba-rail',
      label: 'Rail connection',
      description: 'Yaba has its own station on the Lagos–Ibadan railway line.',
      icon: 'train',
    },
    {
      id: 'yaba-road',
      label: 'Road network',
      description: 'Herbert Macaulay Way and Ijora Road link the corridor to Ikeja, Surulere and Lagos Island.',
      icon: 'navigation',
    },
  ],
  highlights: [
    {
      id: 'yaba-h1',
      title: 'A working city district',
      description: 'Yaba is a commercial and technology district rather than a primarily residential one.',
      icon: 'building-2',
    },
    {
      id: 'yaba-h2',
      title: 'Institutions nearby',
      description: 'Universities, polytechnics and teaching hospitals sit close to the corridor.',
      icon: 'graduation-cap',
    },
    {
      id: 'yaba-h3',
      title: 'Close to Lagos Island',
      description: 'The bridge and Yaba station both connect the district toward Lagos Island and the Marina.',
      icon: 'navigation',
    },
  ],
}

/** Keyed by the same slugs as `locationSlug` on a project. */
export const projectLocationContent: Record<string, ProjectLocationContent> = {
  'lekki-phase-1': lekki,
  ajah,
  ikoyi,
  ikeja,
  'victoria-island': victoriaIsland,
  yaba,
}

/**
 * Shown when a project's location has no entry above — keeps the section
 * populated rather than blank if a new location is added to the catalogue.
 */
export const fallbackLocationContent: ProjectLocationContent = {
  address: 'Location details available on request',
  nearby: [],
  accessibility: [
    {
      id: 'fallback-road',
      label: 'Road network',
      description: 'Ask our team for detailed access notes for this location.',
      icon: 'navigation',
    },
  ],
  highlights: [],
}
