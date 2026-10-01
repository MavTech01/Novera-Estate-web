import type { ProjectAmenity, ProjectAmenityMeta, ProjectBenefit } from '@/features/projects/types/projectTypes'

/**
 * Marketing copy for the Projects feature.
 *
 * Kept out of the components so copy can be reviewed, translated or moved into
 * a CMS later without touching presentation code.
 */

/**
 * Shown next to the listing grid while the catalogue is sample data.
 *
 * The projects on this page are fictional demonstrations, so the page says so
 * rather than letting placeholder names and prices read as live inventory.
 */
export const PROJECT_DEMO_NOTICE =
  'Sample developments shown for demonstration. Project names, prices, availability and progress figures are illustrative and do not describe live Novera Estates developments.'

/** Shorter variant for dense surfaces such as the detail page header. */
export const PROJECT_DEMO_BADGE = 'Demo project'

/**
 * Amenities shown in the "Amenities" section.
 *
 * Projects carry amenity *keys* in the catalogue; this is the display layer that
 * turns a key into a label, a sentence and an icon. Adding an amenity to a
 * project means adding an entry here, not editing a component.
 */
export const projectAmenities: ProjectAmenityMeta[] = [
  {
    id: 'security',
    label: '24/7 Security',
    description: 'Trained guards on gate through the night and a manned control point.',
    icon: 'shield-check',
  },
  {
    id: 'gated-community',
    label: 'Gated Community',
    description: 'Perimeter walls with a single controlled entrance.',
    icon: 'fence',
  },
  {
    id: 'parking',
    label: 'Dedicated Parking',
    description: 'Allocated bays for every home, with visitor parking on site.',
    icon: 'car',
  },
  {
    id: 'green-spaces',
    label: 'Green Spaces',
    description: 'Landscaped courtyards and planted setbacks within the development.',
    icon: 'trees',
  },
  {
    id: 'recreation',
    label: 'Recreation Areas',
    description: 'Shared open space for adults and children to use daily.',
    icon: 'dumbbell',
  },
  {
    id: 'power',
    label: 'Power Infrastructure',
    description: 'Estate generation, distribution and inverter backup where planned.',
    icon: 'zap',
  },
  {
    id: 'water',
    label: 'Water Supply',
    description: 'Treated water storage and pumping to every home.',
    icon: 'droplets',
  },
  {
    id: 'cctv',
    label: 'CCTV',
    description: 'Camera coverage at gates, car parks and circulation areas.',
    icon: 'cctv',
  },
  {
    id: 'play-area',
    label: "Children's Play Area",
    description: 'A safe, visible play space inside the development.',
    icon: 'users',
  },
  {
    id: 'lift',
    label: 'Lift Access',
    description: 'Passenger lifts serving every residential floor, with a service lift where planned.',
    icon: 'arrow-up-down',
  },
]

/** Lookup from amenity key to its display metadata. */
export const projectAmenityById = new Map<ProjectAmenity, ProjectAmenityMeta>(
  projectAmenities.map((amenity) => [amenity.id, amenity]),
)

/**
 * The "Why Choose a Novera Development" blocks.
 *
 * The long-term value copy deliberately describes potential rather than
 * promising a return — nothing on this page should read as financial advice.
 */
export const projectBenefits: ProjectBenefit[] = [
  {
    id: 'thoughtful-planning',
    title: 'Thoughtful Planning',
    description:
      'Layouts are planned around how people actually move through a home day to day — circulation, daylight, storage and step-free access are settled before the first block is poured, not retrofitted afterwards.',
    icon: 'ruler',
  },
  {
    id: 'strategic-locations',
    title: 'Strategic Locations',
    description:
      'We choose sites for access, not just for land price. Every development is assessed against major roads, business districts, schools, shopping and daily commute before we commit to it.',
    icon: 'map-pinned',
  },
  {
    id: 'quality-focused-development',
    title: 'Quality-Focused Development',
    description:
      'Functional design, sound construction and comfortable, well-proportioned rooms are the priority. We build to be lived in for years rather than to be photographed on day one.',
    icon: 'hard-hat',
  },
  {
    id: 'long-term-value',
    title: 'Long-Term Value',
    description:
      'Properly planned, well-located property has historically held demand as an area matures. That is a general characteristic of good real estate, not a promise — returns depend on the market, the location and the terms of purchase.',
    icon: 'trending-up',
  },
]
