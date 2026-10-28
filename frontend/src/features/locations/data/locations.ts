import { images } from '@/assets/images'
import type { Location, LocationLandmark, LocationMapPosition, LocationSeed } from '@/features/locations/types/locationTypes'

/**
 * The demo location catalogue.
 *
 * Six areas, matching the neighbourhoods the rest of the site already talks
 * about. Everything here is illustrative sample data — the `propertyCount`
 * figures in particular are not live inventory, which is why every record is
 * flagged `isDemo` and the page renders a visible notice.
 *
 * Authored in `LocationSeed` form: `withLocationDetails` below adds the fields
 * that follow mechanically from each area's identity, so a record is only ever
 * written once and the derived data cannot drift between locations.
 */

/* -------------------------------------------------------------------------- */
/* Authored records                                                           */
/* -------------------------------------------------------------------------- */

const locationSeeds: LocationSeed[] = [
  {
    id: 'loc-lekki',
    slug: 'lekki',
    name: 'Lekki',
    city: 'Lekki',
    state: 'Lagos',
    label: 'Lekki, Lagos',
    description:
      'A rapidly developing area with residential, commercial and lifestyle opportunities.',
    longDescription:
      'Lekki is one of Lagos’s most active districts, stretching from the Phase 1 residential streets through to the newer estates on the Lekki–Epe corridor. It has an unusually broad mix for a single area: established family homes and terrace housing in the older phases, gated developments behind the phase boundaries, and a growing retail and leisure strip along the main artery. Daily needs are well served, and the Third Mainland Bridge and the Lekki–Epe Expressway both connect it to the rest of the state — which is why traffic, rather than availability, is the question most buyers ask about first.',
    image: {
      src: images.locations.lekki,
      alt: 'Aerial view of the Lekki district and surrounding neighbourhoods in Lagos',
    },
    gallery: [
      {
        src: images.properties.lekkiDuplex,
        alt: 'A four-bedroom detached duplex in a Lekki residential estate',
      },
      {
        src: images.properties.gupeDuplex,
        alt: 'Semi-detached duplex exterior in Gupe, Lekki',
      },
      {
        src: images.categories.luxury,
        alt: 'Contemporary luxury home facade in the Lekki area',
      },
    ],
    highlights: [
      {
        id: 'lekki-residential-growth',
        title: 'Growing residential communities',
        description:
          'Long-established streets sit alongside newer gated estates, so there is stock to suit both long-term residents and recent buyers.',
        icon: 'house',
      },
      {
        id: 'lekki-shopping',
        title: 'Shopping and lifestyle destinations',
        description:
          'Malls, supermarkets and everyday retail line the main roads, with restaurants and leisure within a short drive of most phases.',
        icon: 'shopping-bag',
      },
      {
        id: 'lekki-roads',
        title: 'Access to major roads',
        description:
          'The Lekki–Epe Expressway and the Third Mainland Bridge link the area to the island and the mainland. Journey times vary with traffic.',
        icon: 'car',
      },
      {
        id: 'lekki-developments',
        title: 'Residential developments',
        description:
          'Novera Estates holds several residential developments in Lekki, from completed schemes to units still in construction.',
        icon: 'building-2',
      },
      {
        id: 'lekki-business',
        title: 'Business and leisure opportunities',
        description:
          'Offices, retail units and serviced spaces are common, alongside hospitality and entertainment venues.',
        icon: 'store',
      },
    ],
    propertyCount: 24,
    keywords: [
      'lekki',
      'lekki phase 1',
      'lekki phase 2',
      'gupe',
      'chevron',
      'sangotedo',
      'osapa',
      'island',
      'luxury',
      'residential',
      'apartments',
      'villas',
      'gated estates',
    ],
    popularPropertyTypes: ['Detached Homes', 'Apartments', 'Serviced Apartments', 'Land', 'Commercial'],
    categories: ['island', 'residential', 'luxury'],
    isFeatured: true,
    isDemo: true,
  },
  {
    id: 'loc-ajah',
    slug: 'ajah',
    name: 'Ajah',
    city: 'Ajah',
    state: 'Lagos',
    label: 'Ajah, Lagos',
    description: 'Newer residential communities offering larger plots, estates and land at entry-level prices.',
    longDescription:
      'Ajah sits north of Lekki along the Lekki–Epe Expressway and is where much of Lagos’s newest residential supply is being built. Plots and land tend to be larger and cheaper per square metre than the established districts to the south, and apartment estates are arriving faster than in most parts of the city. The trade-off is distance: daily errands, offices and schools are more spread out, and travel into the city depends heavily on the expressway and the bridge network at peak times.',
    image: {
      src: images.locations.ajah,
      alt: 'Open green landscape on the outskirts of Ajah, Lagos',
    },
    gallery: [
      {
        src: images.properties.ajahLand,
        alt: 'Serviced residential land plots for sale in Ajah, Lagos',
      },
      {
        src: images.categories.developments,
        alt: 'Modern residential estate in the Ajah area',
      },
      {
        src: images.categories.houses,
        alt: 'Family home exterior in a growing Ajah estate',
      },
    ],
    highlights: [
      {
        id: 'ajah-plots',
        title: 'Larger plots of land',
        description:
          'Land in Ajah is generally sold in larger parcels than the island districts, which suits buyers building over time.',
        icon: 'land-plot',
      },
      {
        id: 'ajah-estates',
        title: 'Newer gated estates',
        description:
          'A growing number of estates are delivering terraced homes and apartments built to current standards.',
        icon: 'layers',
      },
      {
        id: 'ajah-value',
        title: 'Entry-level pricing',
        description:
          'Land and off-plan homes here are typically priced below comparable stock in Lekki and Ikoyi.',
        icon: 'trending-up',
      },
      {
        id: 'ajah-corridor',
        title: 'Lekki–Epe corridor',
        description:
          'The expressway is the main link to the rest of Lagos, so access to amenities is largely corridor-dependent.',
        icon: 'car',
      },
    ],
    propertyCount: 18,
    keywords: [
      'ajah',
      'lekki-epe',
      'mainland',
      'residential',
      'land',
      'plots',
      'off-plan',
      'affordable',
      'estates',
      'gated estates',
    ],
    popularPropertyTypes: ['Land', 'Terraced Homes', 'Apartments', 'Semi-Detached Homes'],
    categories: ['mainland', 'residential'],
    isFeatured: false,
    isDemo: true,
  },
  {
    id: 'loc-ikoyi',
    slug: 'ikoyi',
    name: 'Ikoyi',
    city: 'Ikoyi',
    state: 'Lagos',
    label: 'Ikoyi, Lagos',
    description: 'Embassies, corporate offices and premium residential addresses, close to the lagoon.',
    longDescription:
      'Ikoyi has a well-established premium address built around the lagoon, and it is home to a concentration of embassies, corporate headquarters and high-rise residential towers. Listings range from serviced apartments and short-let studios to full-floor penthouses and detached homes in the older residential pockets around Ikota and Banana Island. Prices sit at the top of the Lagos market, and the housing stock skews towards flats rather than family houses.',
    image: {
      src: images.locations.ikoyi,
      alt: 'Ikoyi skyline at dusk with illuminated high-rise buildings',
    },
    gallery: [
      {
        src: images.properties.ikoyiApartment,
        alt: 'Contemporary three-bedroom apartment in Ikoyi, Lagos',
      },
      {
        src: images.properties.bananaIslandHome,
        alt: 'Detached home in Banana Island, Ikoyi',
      },
      {
        src: images.categories.luxury,
        alt: 'Premium residential building facade in Ikoyi',
      },
    ],
    highlights: [
      {
        id: 'ikoyi-address',
        title: 'A recognised premium address',
        description:
          'Embassies and corporate headquarters give the area a long-standing international profile.',
        icon: 'badge-check',
      },
      {
        id: 'ikoyi-highrise',
        title: 'High-rise residential stock',
        description:
          'Apartments and penthouses dominate, including serviced and short-let formats.',
        icon: 'building-2',
      },
      {
        id: 'ikoyi-lagoon',
        title: 'Lagoon frontage',
        description:
          'Parts of the district front the Lagos lagoon, which shapes a number of the larger residential developments.',
        icon: 'waves',
      },
      {
        id: 'ikoyi-services',
        title: 'Hotels, dining and schools',
        description:
          'Embassy-grade amenities, international schools and well-known restaurants are concentrated here.',
        icon: 'chef-hat',
      },
    ],
    propertyCount: 12,
    keywords: [
      'ikoyi',
      'banana island',
      'ikota',
      'island',
      'luxury',
      'penthouses',
      'serviced apartments',
      'embassy',
      'high rise',
      'lagoon',
    ],
    popularPropertyTypes: ['Luxury Apartments', 'Penthouses', 'Serviced Apartments', 'Detached Homes'],
    categories: ['island', 'residential', 'luxury'],
    isFeatured: false,
    isDemo: true,
  },
  {
    id: 'loc-ikeja',
    slug: 'ikeja',
    name: 'Ikeja',
    city: 'Ikeja',
    state: 'Lagos',
    label: 'Ikeja, Lagos',
    description: 'Central Lagos convenience, close to the airport, business districts and major amenities.',
    longDescription:
      'Ikeja is the closest of these areas to Murtala Muhammed International Airport, and that single fact shapes the housing market: a steady rental base from frequent travellers, embassies and corporate staff who need short commutes. The GRA and its surrounding streets carry large family homes on generous plots, while the wider area is dominated by older blocks, office buildings and light commercial premises along the major roads. It is one of the easier parts of Lagos to reach from almost anywhere.',
    image: {
      src: images.locations.ikeja,
      alt: 'Ikeja commercial district skyline at night',
    },
    gallery: [
      {
        src: images.properties.ikejaResidence,
        alt: 'Modern family residence in Ikeja, Lagos',
      },
      {
        src: images.properties.yabaOffice,
        alt: 'Grade-A office space available in central Lagos',
      },
      {
        src: images.categories.commercial,
        alt: 'Commercial property frontage in Ikeja',
      },
    ],
    highlights: [
      {
        id: 'ikeja-airport',
        title: 'Close to the airport',
        description:
          'Murtala Muhammed International Airport is a short drive away, which drives steady rental demand.',
        icon: 'navigation',
      },
      {
        id: 'ikeja-business',
        title: 'Business and office access',
        description:
          'Offices, warehouses and light industrial premises are common along the main commercial roads.',
        icon: 'building',
      },
      {
        id: 'ikeja-gra',
        title: 'Established residential streets',
        description:
          'The GRA area has large family homes on mature plots, a short drive from the central business areas.',
        icon: 'trees',
      },
      {
        id: 'ikeja-transport',
        title: 'Road and rail links',
        description:
          'Served by several main roads and the national rail terminus, making it one of the most connected areas in Lagos.',
        icon: 'train',
      },
    ],
    propertyCount: 15,
    keywords: [
      'ikeja',
      'gra',
      'murtala muhammed',
      'airport',
      'mainland',
      'commercial',
      'offices',
      'central lagos',
      'rail',
    ],
    popularPropertyTypes: ['Apartments', 'Detached Homes', 'Commercial', 'Off-plan Apartments'],
    categories: ['mainland', 'commercial', 'residential'],
    isFeatured: false,
    isDemo: true,
  },
  {
    id: 'loc-victoria-island',
    slug: 'victoria-island',
    name: 'Victoria Island',
    city: 'Victoria Island',
    state: 'Lagos',
    label: 'Victoria Island, Lagos',
    description: 'Nigeria’s commercial centre, with landmark offices, serviced apartments and retail.',
    longDescription:
      'Victoria Island is the country’s central business district, and the housing stock reflects that: mostly serviced and short-let apartments in converted office blocks, with a smaller number of purpose-built residential towers and older family homes. Commercial property is a major part of the market, from street-level retail to full office floors. Because it is an island reached by three bridges, commute times are sensitive to bridge traffic, and this is the single most common qualification agents give buyers here.',
    image: {
      src: images.locations.victoriaIsland,
      alt: 'Victoria Island business district with modern towers',
    },
    gallery: [
      {
        src: images.properties.victoriaApartment,
        alt: 'Serviced two-bedroom apartment in Victoria Island, Lagos',
      },
      {
        src: images.categories.commercial,
        alt: 'Office and retail space in the Victoria Island business district',
      },
      {
        src: images.categories.apartments,
        alt: 'Serviced apartment interiors typical of Victoria Island',
      },
    ],
    highlights: [
      {
        id: 'vi-business',
        title: 'The country’s business centre',
        description:
          'Head offices, banks and multinationals are based here, along with embassies and international organisations.',
        icon: 'building',
      },
      {
        id: 'vi-serviced',
        title: 'Serviced and short-let apartments',
        description:
          'Most residential stock is purpose-built or converted for serviced letting rather than family occupation.',
        icon: 'sofa',
      },
      {
        id: 'vi-retail',
        title: 'Retail and hospitality',
        description:
          'Restaurants, hotels and street-level retail are concentrated along the main avenues.',
        icon: 'shopping-bag',
      },
      {
        id: 'vi-bridges',
        title: 'Island access',
        description:
          'The area is served by three bridges. Crossing times vary with traffic, which is worth factoring into daily commutes.',
        icon: 'bus',
      },
    ],
    propertyCount: 9,
    keywords: [
      'victoria island',
      'vi',
      'business district',
      'offices',
      'serviced apartments',
      'short let',
      'island',
      'commercial',
      'retail',
      'embassy',
    ],
    popularPropertyTypes: ['Serviced Apartments', 'Luxury Apartments', 'Commercial', 'Offices'],
    categories: ['island', 'commercial', 'luxury'],
    isFeatured: false,
    isDemo: true,
  },
  {
    id: 'loc-yaba',
    slug: 'yaba',
    name: 'Yaba',
    city: 'Yaba',
    state: 'Lagos',
    label: 'Yaba, Lagos',
    description: 'A technology and creative hub with growing residential demand and compact homes.',
    longDescription:
      'Yaba has grown out of its role as a transport and industrial district into one of Lagos’s main technology and creative clusters, and the housing market has followed. Demand is strongest for compact, well-located apartments and studio units within walking distance of the main roads, alongside a smaller market in older family houses a few streets back. The area is on the mainland with no bridge crossing, which is a practical advantage for commuting towards the island during the day.',
    image: {
      src: images.locations.yaba,
      alt: 'Yaba district street view with modern buildings',
    },
    gallery: [
      {
        src: images.properties.yabaOffice,
        alt: 'Grade-A office space in Yaba, Lagos',
      },
      {
        src: images.categories.apartments,
        alt: 'Compact apartment building typical of central Yaba',
      },
      {
        src: images.blog.choosingLocation,
        alt: 'Yaba streetscape with a mix of older and newer buildings',
      },
    ],
    highlights: [
      {
        id: 'yaba-tech',
        title: 'Technology and creative cluster',
        description:
          'Startups, software companies and media businesses have concentrated here, creating a strong rental base.',
        icon: 'wifi',
      },
      {
        id: 'yaba-compact',
        title: 'Compact, well-connected homes',
        description:
          'Apartments and studio units close to the main roads suit single occupiers and couples.',
        icon: 'key',
      },
      {
        id: 'yaba-no-bridge',
        title: 'No bridge crossing',
        description:
          'Being on the mainland removes the daily bridge commute, which is a practical draw for island workers.',
        icon: 'navigation',
      },
      {
        id: 'yaba-amenities',
        title: 'Markets, transport and retail',
        description:
          'Established markets, bus terminals and everyday retail are all within the district.',
        icon: 'store',
      },
    ],
    propertyCount: 11,
    keywords: [
      'yaba',
      'technology',
      'tech hub',
      'startup',
      'creative',
      'mainland',
      'studio apartments',
      'compact homes',
      'offices',
    ],
    popularPropertyTypes: ['Apartments', 'Studio Apartments', 'Commercial', 'Detached Homes'],
    categories: ['mainland', 'residential', 'commercial'],
    isFeatured: false,
    isDemo: true,
  },
]

/* -------------------------------------------------------------------------- */
/* Derived data                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Approximate placement on the static map visual.
 *
 * Percentages within the map box, chosen so the six pins read as a loose Lagos
 * coastline: the island districts along the bottom, the mainland areas above.
 * Approximate on purpose — this is decoration for a placeholder map, not a
 * surveyed position, and it is never rendered as a coordinate.
 */
const mapPositions: Record<string, LocationMapPosition> = {
  lekki: { x: 46, y: 72 },
  ajah: { x: 63, y: 30 },
  ikoyi: { x: 27, y: 63 },
  ikeja: { x: 44, y: 20 },
  'victoria-island': { x: 33, y: 79 },
  yaba: { x: 62, y: 16 },
}

/**
 * Surroundings, grouped the way the detail page will group them.
 *
 * Named places are real and well known; nothing here states a distance or a
 * travel time, because those change and are not something this page can verify.
 */
const nearbyLandmarks: Record<string, LocationLandmark[]> = {
  lekki: [
    { id: 'lekki-lm-shopping', category: 'shopping', label: 'Malls and supermarkets on the main Lekki strip', icon: 'shopping-bag' },
    { id: 'lekki-lm-schools', category: 'schools', label: 'Primary and secondary schools across the phases', icon: 'graduation-cap' },
    { id: 'lekki-lm-health', category: 'healthcare', label: 'Hospitals and clinics along the corridor', icon: 'heart-pulse' },
    { id: 'lekki-lm-roads', category: 'roads', label: 'Lekki–Epe Expressway and the Third Mainland Bridge', icon: 'car' },
    { id: 'lekki-lm-transport', category: 'transportation', label: 'BRT and okada corridors serving the main roads', icon: 'bus' },
  ],
  ajah: [
    { id: 'ajah-lm-roads', category: 'roads', label: 'Lekki–Epe Expressway', icon: 'car' },
    { id: 'ajah-lm-schools', category: 'schools', label: 'International and local schools in newer estates', icon: 'graduation-cap' },
    { id: 'ajah-lm-shopping', category: 'shopping', label: 'Local markets and neighbourhood retail', icon: 'store' },
    { id: 'ajah-lm-recreation', category: 'recreation', label: 'Eko Atlantic and leisure sites along the corridor', icon: 'waves' },
  ],
  ikoyi: [
    { id: 'ikoyi-lm-business', category: 'business', label: 'Corporate headquarters and embassies', icon: 'building' },
    { id: 'ikoyi-lm-schools', category: 'schools', label: 'International schools and tutoring centres', icon: 'graduation-cap' },
    { id: 'ikoyi-lm-dining', category: 'recreation', label: 'Restaurants, hotels and social clubs', icon: 'chef-hat' },
    { id: 'ikoyi-lm-health', category: 'healthcare', label: 'Private clinics and specialist centres', icon: 'heart-pulse' },
  ],
  ikeja: [
    { id: 'ikeja-lm-roads', category: 'roads', label: 'Ikeja roads linking Obafemi Awolowo Way and the airport road', icon: 'car' },
    { id: 'ikeja-lm-transport', category: 'transportation', label: 'National rail terminus and major bus terminals', icon: 'train' },
    { id: 'ikeja-lm-shopping', category: 'shopping', label: 'Shopping centres, hotels and the computer market', icon: 'shopping-bag' },
    { id: 'ikeja-lm-health', category: 'healthcare', label: 'Federal and private hospitals', icon: 'heart-pulse' },
  ],
  'victoria-island': [
    { id: 'vi-lm-business', category: 'business', label: 'Banks, oil majors and multinational offices', icon: 'building' },
    { id: 'vi-lm-shopping', category: 'shopping', label: 'Retail, malls and street-level commerce', icon: 'shopping-bag' },
    { id: 'vi-lm-roads', category: 'roads', label: 'Three bridges connecting the island to the mainland', icon: 'car' },
    { id: 'vi-lm-recreation', category: 'recreation', label: 'Hotels, restaurants and the waterfront promenade', icon: 'waves' },
  ],
  yaba: [
    { id: 'yaba-lm-business', category: 'business', label: 'Technology companies and creative studios', icon: 'building' },
    { id: 'yaba-lm-transport', category: 'transportation', label: 'Yaba bus terminal and major road corridors', icon: 'bus' },
    { id: 'yaba-lm-shopping', category: 'shopping', label: 'Markets, electronics stores and neighbourhood retail', icon: 'store' },
    { id: 'yaba-lm-health', category: 'healthcare', label: 'Teaching hospital and local clinics', icon: 'heart-pulse' },
  ],
}

/**
 * Which properties-catalogue slugs make up each area.
 *
 * A city-level area is spread across several catalogue rows — Lekki alone covers
 * six — so this is the mapping that lets `/properties?location=…` show the whole
 * area rather than one phase of it. The properties feature owns the filtering;
 * this only says which slugs belong to the same place.
 */
const propertyLocationSlugs: Record<string, string[]> = {
  lekki: ['lekki-phase-1', 'lekki-phase-2', 'gupe', 'chevron', 'sangotedo', 'osapa'],
  ajah: ['ajah'],
  ikoyi: ['ikoyi', 'ikota', 'banana-island'],
  ikeja: ['ikeja'],
  'victoria-island': ['victoria-island'],
  yaba: ['yaba'],
}

/**
 * Expands a seed record into the full `Location` contract.
 *
 * The mirror image of `buildPropertyDetail` in the properties feature: the API
 * will return every field explicitly, so authoring them once and deriving the
 * mechanical ones keeps the demo data honest without bloating it.
 */
function withLocationDetails(seed: LocationSeed): Omit<Location, 'projectCount'> {
  return {
    ...seed,
    regionLabel: `${seed.city}, ${seed.state}, Nigeria`,
    propertyLocationSlugs: propertyLocationSlugs[seed.slug] ?? [seed.slug],
    mapPosition: mapPositions[seed.slug] ?? { x: 50, y: 50 },
    nearbyLandmarks: nearbyLandmarks[seed.slug] ?? [],
  }
}

/** The full demo catalogue, minus the counts the service supplies. */
export const locationSeedsExpanded: Omit<Location, 'projectCount'>[] = locationSeeds.map(withLocationDetails)

/** The area promoted in the featured block. */
export const featuredLocationSeed: Omit<Location, 'projectCount'> =
  locationSeedsExpanded.find((location) => location.isFeatured) ?? locationSeedsExpanded[0]
