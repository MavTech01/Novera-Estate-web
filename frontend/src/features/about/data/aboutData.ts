import { navigationCta } from '@/data/company'
import { routes } from '@/shared/lib/routes'
import type {
  AboutApproachStep,
  AboutPageContent,
  AboutReason,
  AboutStory,
  AboutTeamMember,
  AboutValue,
} from '@/features/about/types/aboutTypes'

/**
 * Editorial content for the About page.
 *
 * Everything the page says lives here as plain data, shaped exactly like the
 * `GET /api/about` response. Components never hold copy of their own, so when
 * the Express API is connected this file is deleted and `aboutService` fetches
 * the same shape instead — nothing above the service changes.
 *
 * ## What is deliberately absent
 *
 * No founding year, founder names, office counts, listing totals, client
 * numbers, awards, certifications or "market leader" claims appear anywhere in
 * this file. Each of those is a factual assertion, and until there is verified
 * data behind them they belong in marketing review rather than in source
 * control. The sections that would normally carry them describe *how* the
 * company works instead, which is both true and more useful to a visitor.
 *
 * The company-wide facts that already exist — name, descriptor, tagline,
 * contact details — stay in `data/company.ts` and are read from there, so this
 * page and the rest of the site can never disagree about them.
 */

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

const hero = {
  eyebrow: 'About Novera Estates',
  title: 'More Than Property. We Help You Find Where You Belong.',
  description:
    'Novera Estates helps people discover homes, developments and land that fit the life they are actually planning — with the detail, guidance and site visits needed to decide properly before committing.',
  image: {
    src: '/images/properties/gupe-duplex.webp',
    alt: 'Semi-detached four bedroom duplex exterior in a gated estate in Gupe, Lekki, Lagos',
  },
  highlights: [
    {
      id: 'inspected',
      label: 'Inspected before you view',
      description: 'Listings are checked in person before they go on the site.',
      icon: 'badge-check',
    },
    {
      id: 'site-visits',
      label: 'Site visits arranged',
      description: 'Book an inspection for any property or development in the catalogue.',
      icon: 'calendar-search',
    },
    {
      id: 'local',
      label: 'Built for Lagos',
      description: 'Advice shaped by how property actually works in Nigeria.',
      icon: 'map-pin',
    },
  ],
  primaryCta: { label: 'Explore Properties', href: routes.properties, icon: 'search' },
  secondaryCta: { label: 'Book an Inspection', href: navigationCta.href, icon: 'calendar-search' },
} as const

/* -------------------------------------------------------------------------- */
/* Introduction                                                               */
/* -------------------------------------------------------------------------- */

const introduction = {
  eyebrow: 'Who we are',
  title: 'Real Estate With People at the Center',
  paragraphs: [
    'Buying or renting property in Lagos usually means moving between agents, developers and portals, each describing the same place differently. Much of the work falls on the person doing the searching: working out what a listing actually offers, comparing areas they have never driven through, and arranging a viewing with someone they have just met.',
    'Novera Estates exists to take that work off the visitor and put it where it belongs. We present properties with the information needed to judge them, help narrow a search down to areas that genuinely suit the buyer or renter, and arrange inspections and follow-up conversations through one point of contact.',
    'The result is a smaller, clearer process. People who buy, rent, invest in, or own property in the areas we cover spend less time reconstructing the picture and more time deciding.',
  ],
  image: {
    src: '/images/categories/houses.webp',
    alt: 'Detached five bedroom family house with a front lawn in Ikota, Lagos',
  },
  audiences: [
    {
      id: 'buyers',
      label: 'Buyers',
      description: 'Homes, land and investment property, filtered down to what fits your budget and timeline.',
      icon: 'house',
    },
    {
      id: 'renters',
      label: 'Renters',
      description: 'Serviced apartments and family homes, with the terms and location stated up front.',
      icon: 'key',
    },
    {
      id: 'investors',
      label: 'Investors',
      description: 'Property in areas where you can weigh access, infrastructure and the type of stock available.',
      icon: 'trending-up',
    },
    {
      id: 'owners',
      label: 'Property owners',
      description: 'Listings presented with photographs and detail that describe the property honestly.',
      icon: 'building-2',
    },
  ],
  accent: {
    title: 'One conversation, start to finish',
    description:
      'Whoever you speak to first stays with you — from the first shortlist through to the inspection and the paperwork that follows it.',
    icon: 'message',
  },
} as const

/* -------------------------------------------------------------------------- */
/* Story                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The narrative describes intent rather than a chronology.
 *
 * `isPlaceholder` is set, and the section renders `placeholderNote`, because the
 * company history itself is not written yet. Publishing sample milestones as
 * though they were real is exactly the kind of claim this page avoids, so the
 * section says plainly that the timeline is being confirmed and points at the
 * next step instead. Clear the flag in the CMS response once the real history
 * lands and the notice disappears on its own.
 */
const story: AboutStory = {
  eyebrow: 'Our story',
  title: 'Our Story',
  paragraphs: [
    'Novera Estates was built around a straightforward observation: finding a home in Lagos takes longer than it should, and most of that time is spent gathering information that should have been available at the start.',
    'Property search tends to happen across photographs, chat messages and site visits that rarely line up with one another. Listings show what is convenient to photograph rather than what a buyer needs to judge. Areas are described by reputation rather than by what they are like to live in. And the person who can answer a question is rarely the same one who took the viewing.',
    'So the company was structured the other way around. Listings carry the detail that helps a visitor decide. Areas are explained honestly, including the trade-offs. Inspections are easy to arrange, and one consultant stays with a client through the whole sequence instead of handing them on at each stage.',
    'What that produces is a shorter, calmer path from "I am looking" to "this is the one" — and a better understanding of a property before anyone signs anything.',
  ],
  image: {
    src: '/images/properties/ikeja-residence.webp',
    alt: 'Modern five bedroom family residence in Ikeja, Lagos',
  },
  pillars: [
    'Clearer listings, with the detail a buyer needs to judge them',
    'Area guides that describe the trade-offs, not just the appeal',
    'One consultant from first shortlist to inspection',
    'Technology used to remove admin, not to replace conversation',
  ],
  isPlaceholder: true,
  placeholderNote:
    'Our company timeline is being confirmed and will be published here in full. In the meantime, our agents can tell you directly how we work and which areas we currently cover.',
}

/* -------------------------------------------------------------------------- */
/* Mission & Vision                                                           */
/* -------------------------------------------------------------------------- */

const mission = {
  id: 'mission',
  title: 'Our Mission',
  summary:
    'Make finding property in Nigeria a clearer process, from the first search to the paperwork that follows it.',
  points: [
    'Make property discovery easier to navigate',
    'Connect people with properties that genuinely suit their needs',
    'Provide honest detail on every listing we publish',
    'Help clients make informed decisions rather than rushed ones',
  ],
  icon: 'compass',
} as const

const vision = {
  id: 'vision',
  title: 'Our Vision',
  summary:
    'A trusted, accessible, technology-enabled real-estate experience that works for everyone, not just those who know the market.',
  points: [
    'A place people trust to describe property accurately',
    'Technology that makes searching and communicating simpler',
    'Access to suitable property regardless of budget or background',
    'An experience that feels as considered online as it does in person',
  ],
  icon: 'sparkles',
} as const

/* -------------------------------------------------------------------------- */
/* Core values                                                                */
/* -------------------------------------------------------------------------- */

const values: readonly AboutValue[] = [
  {
    id: 'integrity',
    title: 'Integrity',
    description:
      'We describe a property as it is. Where something about a listing is unknown, we say so rather than filling the gap.',
    icon: 'shield-check',
  },
  {
    id: 'transparency',
    title: 'Transparency',
    description:
      'Price, terms, fees and documentation are set out early, so there are no surprises at the point you are asked to commit.',
    icon: 'layers',
  },
  {
    id: 'client-focus',
    title: 'Client Focus',
    description:
      'The search starts from what you need and what you can do — budget, timeline, family, how you want to live.',
    icon: 'users',
  },
  {
    id: 'professionalism',
    title: 'Professionalism',
    description:
      'We keep appointments, follow up when we say we will, and handle your details the way we would want our own handled.',
    icon: 'badge-check',
  },
  {
    id: 'reliability',
    title: 'Reliability',
    description:
      'If we cannot answer something, we say when we will. A property should not go off the market without notice.',
    icon: 'clock',
  },
  {
    id: 'excellence',
    title: 'Excellence',
    description:
      'Photographs, descriptions and site visits are held to a standard we are prepared to be judged on.',
    icon: 'star',
  },
]

/* -------------------------------------------------------------------------- */
/* Why Novera Estates                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Described as characteristics rather than comparisons.
 *
 * Each point explains a choice we have made. None of them claims to be better
 * than another company — that kind of claim is unfalsifiable from the outside
 * and reads as marketing copy rather than information.
 */
const reasons: readonly AboutReason[] = [
  {
    id: 'property-focused',
    title: 'Property-Focused',
    description:
      'Every listing is presented with the information you need to understand what you are looking at — layout, size, location, what is included and what the terms are. Not just a price and a photograph.',
    icon: 'ruler',
  },
  {
    id: 'client-centered',
    title: 'Client-Centered',
    description:
      'Buyers, renters, investors and property owners arrive with different questions. The search starts from yours, and gets narrowed around your budget, timeline and priorities.',
    icon: 'users',
  },
  {
    id: 'clear-communication',
    title: 'Clear Communication',
    description:
      'Enquiries, viewings and follow-up questions go to a person who can answer them. You do not have to repeat yourself to a new contact at each stage.',
    icon: 'message',
  },
  {
    id: 'local-understanding',
    title: 'Local Understanding',
    description:
      'The platform is designed around how property actually works in Nigeria — how areas differ, what documentation to expect, and which questions are worth asking before committing.',
    icon: 'compass',
  },
  {
    id: 'modern-experience',
    title: 'Modern Experience',
    description:
      'Technology handles the searching, filtering and scheduling so that the time you spend with an agent is spent on the property rather than on administration.',
    icon: 'sparkles',
  },
]

/* -------------------------------------------------------------------------- */
/* Approach                                                                   */
/* -------------------------------------------------------------------------- */

const approach: readonly AboutApproachStep[] = [
  {
    id: 'understand',
    step: '01',
    title: 'Understand',
    description: 'We learn what you are looking for — budget, timeline, location and how you want to live.',
    icon: 'users',
  },
  {
    id: 'discover',
    step: '02',
    title: 'Discover',
    description: 'We help you explore the properties and areas that fit those answers, and explain the trade-offs.',
    icon: 'search',
  },
  {
    id: 'inspect',
    step: '03',
    title: 'Inspect',
    description: 'You arrange a viewing at a time that works. For developments, we arrange a site visit.',
    icon: 'calendar-search',
  },
  {
    id: 'move-forward',
    step: '04',
    title: 'Move Forward',
    description: 'You get the documentation detail and support needed to decide on your next step with confidence.',
    icon: 'key',
  },
]

/* -------------------------------------------------------------------------- */
/* Team                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder profiles for the team grid.
 *
 * This is a demo build, so these are not real Novera Estates staff and must not
 * be presented as such. `isDemo` on every record drives the visible notice
 * above the grid, and the contact links point at the company's general
 * channels rather than at invented personal inboxes. When the API is connected
 * the `agents` table supplies real records and this array disappears.
 */
const team: readonly AboutTeamMember[] = [
  {
    id: 'agent-adaeze-okonkwo',
    name: 'Adaeze Okonkwo',
    role: 'Head of Residential Sales',
    description:
      'Works with buyers and families moving through the residential areas we cover, from the first shortlist to the paperwork after handover.',
    avatar: { src: '/images/team/ad-hoc.webp', alt: 'Portrait of Adaeze Okonkwo' },
    focusAreas: ['Residential sales', 'Family homes', 'Handover support'],
    socials: [{ id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/noveraestates' }],
    isDemo: true,
  },
  {
    id: 'agent-tunde-bakare',
    name: 'Tunde Bakare',
    role: 'Investment & Land Advisor',
    description:
      'Advises on land and income-producing property, covering documentation, access and the practicalities of buying in different parts of Lagos.',
    avatar: { src: '/images/team/tunde-b.webp', alt: 'Portrait of Tunde Bakare' },
    focusAreas: ['Land', 'Investment property', 'Documentation'],
    socials: [{ id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/noveraestates' }],
    isDemo: true,
  },
  {
    id: 'agent-chiamaka-nwosu',
    name: 'Chiamaka Nwosu',
    role: 'Leasing Specialist',
    description:
      'Handles rentals and serviced apartments, matching tenants to properties and arranging viewings and lease terms.',
    avatar: { src: '/images/team/chiamaka.webp', alt: 'Portrait of Chiamaka Nwosu' },
    focusAreas: ['Rentals', 'Serviced apartments', 'Lease terms'],
    socials: [{ id: 'instagram', label: 'Instagram', href: 'https://instagram.com/noveraestates' }],
    isDemo: true,
  },
]

/* -------------------------------------------------------------------------- */
/* Notices                                                                    */
/* -------------------------------------------------------------------------- */

const notices = [
  {
    id: 'story-placeholder',
    message: story.placeholderNote ?? '',
    icon: 'file-text',
  },
  {
    id: 'team-placeholder',
    message:
      'The profiles below are placeholders for this demonstration site. They are not Novera Estates employees and the details shown are sample content.',
    icon: 'users',
  },
] as const

/* -------------------------------------------------------------------------- */
/* Aggregate                                                                  */
/* -------------------------------------------------------------------------- */

/** The demo payload. The service resolves it into `AboutPageContent`. */
export const aboutSeed: AboutPageContent = {
  hero: { ...hero, highlights: [...hero.highlights], primaryCta: { ...hero.primaryCta }, secondaryCta: { ...hero.secondaryCta } },
  introduction: {
    ...introduction,
    paragraphs: [...introduction.paragraphs],
    audiences: [...introduction.audiences],
  },
  story: { ...story, paragraphs: [...story.paragraphs], pillars: [...story.pillars] },
  mission: { ...mission, points: [...mission.points] },
  vision: { ...vision, points: [...vision.points] },
  values: [...values],
  reasons: [...reasons],
  approach: [...approach],
  team: [...team],
  notices: [...notices],
}