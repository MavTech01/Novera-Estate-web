import type { Project, ProjectSeed } from '@/features/projects/types/projectTypes'
import { buildProjectLocationInfo } from '@/features/projects/utils/projectGallery'
import { buildProjectUnitTypes } from '@/features/projects/utils/projectUnitTypes'
import { consultantForSlug } from './projectConsultants'
import { projectDocumentation } from './projectDocumentation'

/**
 * Demo project catalogue.
 *
 * ⚠️ Every development below is FICTIONAL sample data. The names, prices,
 * unit counts, dates and progress figures are illustrative placeholders for the
 * Projects page — none of them describe a real Novera Estates development, and
 * nothing here should be presented to a client as an available investment.
 * `isDemo: true` on each record is what the UI reads to render the notice above
 * the listings.
 *
 * The field names and nesting mirror the `projects` table the PERN backend will
 * introduce (with `images` and `amenities` moving to their own join tables), so
 * this file can be deleted and replaced by `GET /api/projects` with no change
 * to any component above `../services/projectService`.
 */

const projectSeeds: ProjectSeed[] = [
  {
    id: 'prj-001',
    slug: 'novera-heights',
    name: 'Novera Heights',
    location: 'Lekki Phase 1, Lagos',
    locationSlug: 'lekki-phase-1',
    city: 'Lekki',
    state: 'Lagos',
    projectType: 'residential',
    status: 'ongoing',
    startingPrice: 85_000_000,
    totalUnits: 48,
    availableUnits: 12,
    completionDate: '2027-06-30',
    constructionStarted: '2025-03-10',
    progress: 65,
    unitsCompleted: 18,
    summary:
      'A mid-rise residential development on the Lekki corridor, built around landscaped courtyards and walkable internal roads.',
    description:
      'Novera Heights is a carefully planned mid-rise development set a short walk from the Lekki expressway. The layout separates vehicle circulation from pedestrian routes, so gardens and play areas sit inside the development rather than beside a main road. Apartments are finished with fitted kitchens, tiled living areas and covered parking, and the estate runs on its own power and water treatment infrastructure.',
    images: [
      {
        src: '/images/categories/developments.webp',
        alt: 'Rendered view of the Novera Heights development showing landscaped courtyards and mid-rise apartment blocks',
      },
      {
        src: '/images/development/oasis-main.webp',
        alt: 'Close-up of the Novera Heights entrance elevation and porte-cochere',
      },
      {
        src: '/images/properties/lekki-duplex.webp',
        alt: 'Bright living room inside a Novera Heights apartment',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'green-spaces', 'power', 'water', 'cctv'],
    features: [
      '2, 3 and 4 bedroom layouts',
      'Fitted kitchen and wardrobes',
      'Covered parking for every unit',
      'Estate-wide power and water treatment',
      'Flexible payment plans during construction',
    ],
    isFeatured: true,
    isDemo: true,
    createdAt: '2025-03-02',
  },
  {
    id: 'prj-002',
    slug: 'novera-gardens',
    name: 'Novera Gardens',
    location: 'Ajah, Lagos',
    locationSlug: 'ajah',
    city: 'Ajah',
    state: 'Lagos',
    projectType: 'residential',
    status: 'ongoing',
    startingPrice: 45_000_000,
    totalUnits: 32,
    availableUnits: 24,
    completionDate: '2027-03-31',
    constructionStarted: '2025-09-15',
    progress: 40,
    unitsCompleted: 8,
    summary:
      'Terraced family homes around a shared green, aimed at buyers who want more space per naira in a growing corridor.',
    description:
      'Novera Gardens brings larger family homes to an established Ajah community at an entry-level price point. Terraces are arranged along internal roads wide enough for refuse trucks, and every home has a private garden area. The development shares a boundary wall, a central green and a single controlled entrance, which keeps the estate manageable without feeling enclosed.',
    images: [
      {
        src: '/images/properties/gupe-duplex.webp',
        alt: 'Exterior of a Novera Gardens terraced home in Ajah, Lagos',
      },
      {
        src: '/images/locations/ajah.webp',
        alt: 'Open landscape on the outskirts of Ajah where the Novera Gardens development sits',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'green-spaces', 'play-area', 'water'],
    features: [
      '4 and 5 bedroom terraced homes',
      'Private garden with every unit',
      'Central green and children’s play area',
      'Borehole and water treatment',
      'Close to major schools and markets',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2025-09-01',
  },
  {
    id: 'prj-003',
    slug: 'novera-residences',
    name: 'Novera Residences',
    location: 'Ikoyi, Lagos',
    locationSlug: 'ikoyi',
    city: 'Ikoyi',
    state: 'Lagos',
    projectType: 'luxury-apartments',
    status: 'upcoming',
    startingPrice: 210_000_000,
    totalUnits: 24,
    availableUnits: 24,
    completionDate: '2028-05-31',
    constructionStarted: null,
    progress: null,
    unitsCompleted: null,
    summary:
      'Serviced apartments in one of Lagos’ most established addresses, with concierge-level shared facilities.',
    description:
      'Novera Residences is a low-density apartment development in Ikoyi, planned for owners who want a serviced address rather than a building to maintain. Homes are generous in proportion, with double-height living rooms on the upper floors. Shared facilities include a residents’ lounge, a small gym and staff quarters for every apartment.',
    images: [
      {
        src: '/images/properties/ikoyi-apartment.webp',
        alt: 'Elegant apartment interior at Novera Residences in Ikoyi, Lagos',
      },
      {
        src: '/images/properties/banana-island-home.webp',
        alt: 'Open-plan living space overlooking landscaped grounds at Novera Residences',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'recreation', 'power', 'water', 'cctv'],
    features: [
      '3 and 4 bedroom serviced apartments',
      'Residents’ lounge and gym',
      'Staff quarters included',
      'Two dedicated parking bays per apartment',
      'Concierge and estate management',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2026-01-20',
  },
  {
    id: 'prj-004',
    slug: 'novera-crest',
    name: 'Novera Crest',
    location: 'Ikeja, Lagos',
    locationSlug: 'ikeja',
    city: 'Ikeja',
    state: 'Lagos',
    projectType: 'estate',
    status: 'completed',
    startingPrice: 120_000_000,
    totalUnits: 20,
    availableUnits: 3,
    completionDate: '2025-11-30',
    constructionStarted: '2023-06-01',
    progress: null,
    unitsCompleted: 20,
    summary:
      'A completed twenty-home estate close to the airport, built as detached homes around a shared drive.',
    description:
      'Novera Crest is finished and handed over. Twenty detached homes sit either side of a single circular drive, which keeps reversing and visitor parking off the house fronts. The estate is a short drive from the airport and the Ikeja business district, and three homes remain available.',
    images: [
      {
        src: '/images/properties/ikeja-residence.webp',
        alt: 'Detached home at the completed Novera Crest estate in Ikeja, Lagos',
      },
      {
        src: '/images/locations/ikeja.webp',
        alt: 'Ikeja skyline at night, minutes from the Novera Crest estate',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'green-spaces', 'power', 'water', 'cctv'],
    features: [
      'Five-bedroom detached homes',
      'Circular estate drive',
      'Delivered with landscaping',
      'Title documentation available',
      'Immediate handover',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2023-05-10',
  },
  {
    id: 'prj-005',
    slug: 'novera-point',
    name: 'Novera Point',
    location: 'Victoria Island, Lagos',
    locationSlug: 'victoria-island',
    city: 'Victoria Island',
    state: 'Lagos',
    projectType: 'commercial',
    status: 'ongoing',
    startingPrice: 340_000_000,
    totalUnits: 18,
    availableUnits: 6,
    completionDate: '2027-12-31',
    constructionStarted: '2025-07-01',
    progress: 28,
    unitsCompleted: 0,
    summary:
      'Office and retail units in a single building on the island’s commercial edge.',
    description:
      'Novera Point is a mixed commercial block on the Victoria Island corridor, designed for businesses that need a visible address and dependable services. Floor plates are open and column-free, with dedicated lift groups and a service entrance kept separate from the main lobby. Ground-floor retail is planned to face the street frontage.',
    images: [
      {
        src: '/images/properties/victoria-apartment.webp',
        alt: 'Office frontage at Novera Point on Victoria Island, Lagos',
      },
      {
        src: '/images/categories/commercial.webp',
        alt: 'Commercial retail units at ground level of the Novera Point development',
      },
    ],
    amenities: ['security', 'parking', 'power', 'water', 'cctv', 'lift'],
    features: [
      'Column-free office floor plates',
      'Dedicated lift groups',
      'Separate service and loading entrance',
      'Street-facing retail units',
      'Backup power and treated water',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2025-06-18',
  },
  {
    id: 'prj-006',
    slug: 'novera-yards',
    name: 'Novera Yards',
    location: 'Yaba, Lagos',
    locationSlug: 'yaba',
    city: 'Yaba',
    state: 'Lagos',
    projectType: 'mixed-use',
    status: 'upcoming',
    startingPrice: 95_000_000,
    totalUnits: 60,
    availableUnits: 60,
    completionDate: '2028-09-30',
    constructionStarted: null,
    progress: null,
    unitsCompleted: null,
    summary:
      'Apartments above ground-floor workspaces in Yaba, aimed at the district’s technology and creative businesses.',
    description:
      'Novera Yards stacks residential apartments over ground-floor workspaces in Yaba. The building is planned so that deliveries and staff access happen at the rear, leaving the frontage for shops and a small café. Apartments are compact and efficient, with shared laundry and a rooftop terrace for residents.',
    images: [
      {
        src: '/images/properties/yaba-office.webp',
        alt: 'Ground-floor workspace at the Novera Yards development in Yaba, Lagos',
      },
      {
        src: '/images/locations/yaba.webp',
        alt: 'Yaba district streetscape, home to the Novera Yards development',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'power', 'water', 'cctv', 'recreation'],
    features: [
      'Studios and 1–2 bedroom apartments',
      'Ground-floor commercial units',
      'Rooftop residents’ terrace',
      'Shared laundry and waste handling',
      'Lift access to every floor',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2026-04-05',
  },
  {
    id: 'prj-007',
    slug: 'novera-palms',
    name: 'Novera Palms',
    location: 'Lekki Phase 1, Lagos',
    locationSlug: 'lekki-phase-1',
    city: 'Lekki',
    state: 'Lagos',
    projectType: 'estate',
    status: 'upcoming',
    startingPrice: 62_000_000,
    totalUnits: 40,
    availableUnits: 40,
    completionDate: '2028-02-29',
    constructionStarted: null,
    progress: null,
    unitsCompleted: null,
    summary:
      'A forty-unit estate planned around mature palms, generous setbacks and a shared recreation ground.',
    description:
      'Novera Palms is the second Novera scheme on this site and is planned around the existing tree line rather than clearing it. Setbacks are wide enough for two cars to pass, and the estate holds a single recreation ground instead of scattered pocket parks. Homes are arranged in four short terraces so that every unit faces a green rather than a boundary wall.',
    images: [
      {
        src: '/images/development/oasis-alt.webp',
        alt: 'Landscaped interior view planned for the Novera Palms estate in Lekki',
      },
      {
        src: '/images/categories/houses.webp',
        alt: 'Row of family homes planned for the Novera Palms estate',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'green-spaces', 'recreation', 'play-area', 'water'],
    features: [
      '4 and 5 bedroom homes',
      'Retained mature palm line',
      'Shared recreation ground',
      'Wide internal setbacks',
      'Phased delivery from 2028',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2026-02-14',
  },
  {
    id: 'prj-008',
    slug: 'novera-terrace',
    name: 'Novera Terrace',
    location: 'Ajah, Lagos',
    locationSlug: 'ajah',
    city: 'Ajah',
    state: 'Lagos',
    projectType: 'residential',
    status: 'completed',
    startingPrice: 38_000_000,
    totalUnits: 28,
    availableUnits: 5,
    completionDate: '2025-08-31',
    constructionStarted: '2023-02-01',
    progress: null,
    unitsCompleted: 28,
    summary:
      'A completed terrace of compact family homes, fully occupied and easy to inspect on short notice.',
    description:
      'Novera Terrace handed over in 2025 and is now an established address. The development holds twenty-eight compact homes across two terraces, with parking kept to the rear so the frontage stays open. Five homes remain available, and the estate management team is on site weekly.',
    images: [
      {
        src: '/images/properties/ajah-land.webp',
        alt: 'Completed terrace housing at Novera Terrace in Ajah, Lagos',
      },
      {
        src: '/images/blog/choosing-location.webp',
        alt: 'Neighbourhood context around the completed Novera Terrace development',
      },
    ],
    amenities: ['security', 'gated-community', 'parking', 'play-area', 'water'],
    features: [
      '3 and 4 bedroom homes',
      'Rear parking court',
      'On-site estate management',
      'Close to schools and shopping',
      'Ready for immediate occupation',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2023-01-20',
  },
  {
    id: 'prj-009',
    slug: 'novera-exchange',
    name: 'Novera Exchange',
    location: 'Victoria Island, Lagos',
    locationSlug: 'victoria-island',
    city: 'Victoria Island',
    state: 'Lagos',
    projectType: 'commercial',
    status: 'completed',
    startingPrice: 280_000_000,
    totalUnits: 12,
    availableUnits: 2,
    completionDate: '2024-10-31',
    constructionStarted: '2022-08-01',
    progress: null,
    unitsCompleted: 12,
    summary:
      'A completed office building on the island with lettable floors and a managed common area.',
    description:
      'Novera Exchange is a completed commercial building offered for sale or long leasehold. The common areas, lifts and power are managed centrally, which suits owner-occupiers who do not want to carry building management themselves. Two of the twelve floors remain available.',
    images: [
      {
        src: '/images/ui/cta-image.webp',
        alt: 'The completed Novera Exchange office building on Victoria Island, Lagos',
      },
      {
        src: '/images/categories/commercial.webp',
        alt: 'Lobby and reception area at Novera Exchange',
      },
    ],
    amenities: ['security', 'parking', 'power', 'water', 'cctv', 'lift'],
    features: [
      'Lettable floors of 400–900 sqm',
      'Managed common areas and lifts',
      'Two basement parking levels',
      'Backup power for full floors',
      'Available for sale or lease',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2022-07-15',
  },
  {
    id: 'prj-010',
    slug: 'novera-commons',
    name: 'Novera Commons',
    location: 'Ikeja, Lagos',
    locationSlug: 'ikeja',
    city: 'Ikeja',
    state: 'Lagos',
    projectType: 'mixed-use',
    status: 'ongoing',
    startingPrice: 75_000_000,
    totalUnits: 36,
    availableUnits: 14,
    completionDate: '2027-09-30',
    constructionStarted: '2025-01-20',
    progress: 52,
    unitsCompleted: 0,
    summary:
      'Apartments over clinic and retail units on a central Ikeja site, still within its delivery window.',
    description:
      'Novera Commons puts homes above small-format retail and consulting rooms, a layout that suits a central Ikeja site with heavy footfall. The two entrances are separated so that commercial visitors never pass through the residential lobby. Structural work is complete and fit-out is underway.',
    images: [
      {
        src: '/images/categories/apartments.webp',
        alt: 'Apartment interiors completed at the Novera Commons development in Ikeja',
      },
      {
        src: '/images/blog/investment.webp',
        alt: 'Novera Commons mixed-use frontage on a central Ikeja street',
      },
    ],
    amenities: ['security', 'parking', 'power', 'water', 'cctv', 'lift', 'recreation'],
    features: [
      '1–3 bedroom apartments',
      'Ground-floor retail and consulting units',
      'Separate residential and commercial entrances',
      'Lift access and shared generator',
      'Close to Ikeja GRA and the airport road',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2024-12-02',
  },
  {
    id: 'prj-011',
    slug: 'novera-vista',
    name: 'Novera Vista',
    location: 'Lekki Phase 1, Lagos',
    locationSlug: 'lekki-phase-1',
    city: 'Lekki',
    state: 'Lagos',
    projectType: 'luxury-apartments',
    status: 'completed',
    startingPrice: 185_000_000,
    totalUnits: 16,
    availableUnits: 2,
    completionDate: '2025-04-30',
    constructionStarted: '2022-05-01',
    progress: null,
    unitsCompleted: 16,
    summary:
      'Sixteen completed apartments with full estate facilities and a residents’ pool deck.',
    description:
      'Novera Vista is finished and occupied, with two apartments left for sale. The building shares a podium with a pool deck, gym and residents’ lounge, and every apartment has a private balcony facing west over the Lekki corridor. Full estate management is in place.',
    images: [
      {
        src: '/images/categories/luxury.webp',
        alt: 'Completed apartment interior at Novera Vista in Lekki Phase 1, Lagos',
      },
      {
        src: '/images/blog/buying-land.webp',
        alt: 'Lekki skyline view from the Novera Vista development',
      },
    ],
    amenities: [
      'security',
      'gated-community',
      'parking',
      'recreation',
      'power',
      'water',
      'cctv',
      'green-spaces',
    ],
    features: [
      '3 and 4 bedroom apartments',
      'Private balconies on every unit',
      'Pool deck, gym and residents’ lounge',
      'Full estate management',
      'Two basement parking bays per apartment',
    ],
    isFeatured: false,
    isDemo: true,
    createdAt: '2022-04-11',
  },
]

/**
 * Attaches the fields a detail page needs to each authored record.
 *
 * The authors of each development wrote what is specific to it — its name,
 * figures, copy and photography. The parts that follow from those numbers are
 * produced here instead: the unit ladder is scaled to `startingPrice`, the
 * consultant is assigned from the slug, and documentation status is currently
 * the same for every demo record.
 *
 * `withProjectDetails` is the only place `ProjectSeed` becomes `Project`, so
 * the full domain model is guaranteed for every record and no hand-authored
 * array can drift out of sync with it.
 */
function withProjectDetails(seed: ProjectSeed): Project {
  return {
    ...seed,
    developmentSize: `${(seed.totalUnits * 0.031).toFixed(1)} hectares`,
    unitTypes: buildProjectUnitTypes(seed),
    locationInfo: buildProjectLocationInfo(seed),
    documentation: projectDocumentation,
    consultant: consultantForSlug(seed.slug),
  }
}

/** The demo catalogue, fully populated. */
export const projects: Project[] = projectSeeds.map(withProjectDetails)
