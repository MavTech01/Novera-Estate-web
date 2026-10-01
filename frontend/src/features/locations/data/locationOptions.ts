import { navigationCta } from '@/data/company'
import { routes } from '@/shared/lib/routes'
import type { IconName } from '@/types'
import type {
  LocationCategoryValue,
  LocationCategoryId,
  LocationCategoryOption,
  LocationComparisonAttribute,
  LocationComparisonCell,
  LocationComparisonDescriptor,
  LocationFactor,
} from '@/features/locations/types/locationTypes'

/**
 * Static taxonomies and editorial content for the Locations feature.
 *
 * Filter metadata lives here rather than inside components so the hero search,
 * the category strip, the comparison table and the URL serialiser all read the
 * same single source of truth. In PostgreSQL the categories become a lookup
 * table and the factor/copy blocks become CMS rows.
 */

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

/** Every category, excluding the pass-through value. */
export const locationCategories: readonly LocationCategoryId[] = [
  'mainland',
  'island',
  'residential',
  'commercial',
  'luxury',
] as const

export const locationCategoryLabels: Record<LocationCategoryId, string> = {
  mainland: 'Mainland',
  island: 'Island',
  residential: 'Residential Areas',
  commercial: 'Commercial Areas',
  luxury: 'Luxury Areas',
}

/** Label shown for a category value, including the pass-through value. */
export const locationCategoryFilterLabels: Record<LocationCategoryValue, string> = {
  all: 'All Areas',
  ...locationCategoryLabels,
}

/**
 * The category strip.
 *
 * The "All Areas" entry maps to the same `'all'` value the filter state uses, so
 * the strip and the URL can never disagree — two presentations of one piece of
 * state. Its label comes from `locationCategoryFilterLabels` rather than being
 * restated, because the active-filter chips need the same wording.
 *
 * Descriptions exist for the filter's own tooltip/assistive text and for the
 * empty-state hint, which is where a visitor who lands on "no results" most
 * needs an explanation of what they filtered by.
 */
export const locationCategoryOptions: readonly LocationCategoryOption[] = [
  {
    value: 'all',
    label: locationCategoryFilterLabels.all,
    icon: 'map-pinned',
    description: 'Every area we currently cover',
  },
  {
    value: 'mainland',
    label: 'Mainland',
    icon: 'map',
    description: 'Areas on the mainland, with no daily bridge crossing',
  },
  {
    value: 'island',
    label: 'Island',
    icon: 'waves',
    description: 'The Lagos islands, reached by bridge or causeway',
  },
  {
    value: 'residential',
    label: 'Residential Areas',
    icon: 'house',
    description: 'Neighbourhoods built mainly for homes and families',
  },
  {
    value: 'commercial',
    label: 'Commercial Areas',
    icon: 'store',
    description: 'Districts with a strong office and retail base',
  },
  {
    value: 'luxury',
    label: 'Luxury Areas',
    icon: 'sparkles',
    description: 'Premium addresses with the highest price points',
  },
] as const

/* -------------------------------------------------------------------------- */
/* Hero shortcuts                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The three ways people arrive at an area, as one-tap shortcuts.
 *
 * Each links to a catalogue view that already exists rather than a bespoke page,
 * so none of them can 404. Buy and Rent set the catalogue's own `purpose`
 * filter. "Invest" has no equivalent filter — the catalogue does not separate
 * investment stock — so it goes to the consultation flow, which is the honest
 * answer for that visitor rather than a filter that would quietly ignore them.
 */
export const locationSearchShortcuts = [
  {
    id: 'buy',
    label: 'Buy a Property',
    icon: 'house',
    href: `${routes.properties}?purpose=buy`,
  },
  {
    id: 'rent',
    label: 'Rent a Property',
    icon: 'key',
    href: `${routes.properties}?purpose=rent`,
  },
  {
    id: 'invest',
    label: 'Invest',
    icon: 'trending-up',
    href: navigationCta.href,
  },
] as const satisfies readonly { id: string; label: string; icon: IconName; href: string }[]

/* -------------------------------------------------------------------------- */
/* "Why Location Matters"                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The factors a buyer actually weighs up when choosing an area.
 *
 * Written as general characteristics of a location rather than as advice about
 * any particular address, and deliberately free of return or appreciation
 * claims — this page explains what a location *is*, not what it will be worth.
 */
export const locationFactors: readonly LocationFactor[] = [
  {
    id: 'accessibility',
    title: 'Accessibility',
    description:
      'How an area connects to the rest of the city — main roads, bridges, rail and public transport — shapes your daily travel as much as the property itself does.',
    icon: 'navigation',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    description:
      'The pace and character of a neighbourhood matters as much as the building. Some areas are quiet and residential, others are busy and commercial, and the right fit depends on how you live.',
    icon: 'waves',
  },
  {
    id: 'nearby-services',
    title: 'Nearby services',
    description:
      'Grocers, markets, banks, fuel and general supplies are usually the first practical question after a viewing, and coverage varies a lot between districts.',
    icon: 'store',
  },
  {
    id: 'schools',
    title: 'Schools',
    description:
      'For families, the distance to nursery, primary and secondary schools — and the options within it — is often a deciding factor before price.',
    icon: 'graduation-cap',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description:
      'Hospitals, clinics and pharmacies within reach are a practical concern for everyone, and worth checking in person rather than assuming from an area’s reputation.',
    icon: 'heart-pulse',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description:
      'From neighbourhood markets to shopping malls, a mix of both usually indicates an area that is well established and not dependent on a single development.',
    icon: 'shopping-bag',
  },
  {
    id: 'work-access',
    title: 'Work and business access',
    description:
      'If you commute or keep an office, the distance to the business districts and to the airport tends to be one of the first questions worth answering.',
    icon: 'building',
  },
  {
    id: 'property-demand',
    title: 'Property demand',
    description:
      'Areas with jobs, schools and infrastructure nearby generally see steadier demand, because people want to live close to them. Ask an agent what is actually letting locally.',
    icon: 'trending-up',
  },
] as const

/* -------------------------------------------------------------------------- */
/* Comparison                                                                 */
/* -------------------------------------------------------------------------- */

/** The attributes the comparison table compares areas on. */
export const locationComparisonAttributes: readonly LocationComparisonAttribute[] = [
  {
    id: 'residential-lifestyle',
    label: 'Residential lifestyle',
    description: 'How much of the area is given over to homes rather than offices or retail.',
    icon: 'house',
  },
  {
    id: 'business-access',
    label: 'Business access',
    description: 'How close the area sits to the main office districts and commercial corridors.',
    icon: 'building',
  },
  {
    id: 'shopping-leisure',
    label: 'Shopping & leisure',
    description: 'The range of retail, dining and entertainment available within the area.',
    icon: 'shopping-bag',
  },
  {
    id: 'schools',
    label: 'Schools',
    description: 'The spread of nursery, primary and secondary options, including international schools.',
    icon: 'graduation-cap',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    description: 'Hospitals, clinics and pharmacies within the area or a short drive away.',
    icon: 'heart-pulse',
  },
  {
    id: 'property-variety',
    label: 'Property variety',
    description: 'The spread of stock on offer — from land and apartments to detached homes and offices.',
    icon: 'layers',
  },
] as const

/** Wording for each descriptor, so the table never shows a bare word. */
export const locationDescriptorLabels: Record<LocationComparisonDescriptor, string> = {
  strong: 'Strong',
  moderate: 'Moderate',
  limited: 'Limited',
}

/** Longer note shown as the tooltip/assistive text for each descriptor. */
export const locationDescriptorNotes: Record<LocationComparisonDescriptor, string> = {
  strong: 'A defining strength of this area',
  moderate: 'Available, but varies by neighbourhood',
  limited: 'Less of a feature here than elsewhere',
}

/**
 * How each area compares on each attribute.
 *
 * A short descriptive matrix of general characteristics — deliberately *not*
 * scores, rankings or star ratings. The section exists to help a visitor see how
 * areas differ, so every cell is prose and no area is declared better than
 * another. These are the characteristics Lagos areas are generally understood to
 * have; the description under each column says so.
 */
export const locationComparisonMatrix: Record<string, Record<string, LocationComparisonDescriptor>> = {
  lekki: {
    'residential-lifestyle': 'strong',
    'business-access': 'moderate',
    'shopping-leisure': 'strong',
    schools: 'strong',
    healthcare: 'strong',
    'property-variety': 'strong',
  },
  ajah: {
    'residential-lifestyle': 'strong',
    'business-access': 'limited',
    'shopping-leisure': 'moderate',
    schools: 'moderate',
    healthcare: 'moderate',
    'property-variety': 'moderate',
  },
  ikoyi: {
    'residential-lifestyle': 'moderate',
    'business-access': 'strong',
    'shopping-leisure': 'strong',
    schools: 'strong',
    healthcare: 'strong',
    'property-variety': 'moderate',
  },
  ikeja: {
    'residential-lifestyle': 'moderate',
    'business-access': 'strong',
    'shopping-leisure': 'strong',
    schools: 'strong',
    healthcare: 'strong',
    'property-variety': 'strong',
  },
  'victoria-island': {
    'residential-lifestyle': 'limited',
    'business-access': 'strong',
    'shopping-leisure': 'strong',
    schools: 'moderate',
    healthcare: 'strong',
    'property-variety': 'moderate',
  },
  yaba: {
    'residential-lifestyle': 'strong',
    'business-access': 'strong',
    'shopping-leisure': 'strong',
    schools: 'moderate',
    healthcare: 'strong',
    'property-variety': 'moderate',
  },
}

/** Builds the cells for one attribute across every compared area. */
export function buildComparisonCells(
  attributeId: string,
  locations: readonly { slug: string }[],
): LocationComparisonCell[] {
  return locations.map((location) => ({
    locationId: location.slug,
    attributeId,
    descriptor: locationComparisonMatrix[location.slug]?.[attributeId] ?? 'moderate',
  }))
}

/* -------------------------------------------------------------------------- */
/* Page copy                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The demo-data notice.
 *
 * Counts, copy and developments on this page are illustrative. Stating it once
 * here means the notice, the footer of the grid and any future detail page all
 * say the same thing, and changing the wording later is a single edit.
 */
export const LOCATION_DEMO_NOTICE =
  'The areas, counts and developments on this page are sample data shown for demonstration. They do not describe live Novera Estates inventory.'

/** Note shown beneath the static map. */
export const LOCATION_MAP_NOTE =
  'This is a simplified illustration of where our areas sit within Lagos, not an interactive map. Exact directions and site visits are arranged by our agents.'

/** Explains why the map is a placeholder rather than a live map. */
export const LOCATION_MAP_PROVIDER_NOTE =
  'An interactive map will be added once a mapping provider is connected. Until then, our agents can share exact directions and arrange a guided visit.'
