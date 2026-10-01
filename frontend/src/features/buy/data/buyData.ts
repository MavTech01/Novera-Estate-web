import type { IconName, PropertyType } from '@/types'
import type {
  BuyCategory,
  BuyFaqItem,
  BuyerGuidanceCard,
  BuyingProcessStep,
} from '@/features/buy/types/buy.types'

/**
 * Editorial content for the Buy page.
 *
 * Everything here is copy an editor could change without touching any code:
 * the category cards, the four-step process, the buyer guidance and the FAQ.
 * What this file deliberately does *not* contain is a second inventory.
 *
 * The catalogue — which properties are for sale, and how many sit behind each
 * category or area — is owned by the shared properties catalogue. This file only
 * describes each bucket, so a card and the results behind it can never disagree.
 *
 * Note on honesty: these are demo listings. No price, count or neighbourhood in
 * this file is a live claim, and the page surfaces that with a visible notice.
 */

/** The main photograph for the Buy page hero. */
export const BUY_HERO_IMAGE = {
  src: '/images/properties/lekki-duplex.webp',
  alt: 'Exterior of a four-bedroom duplex in a Lekki residential estate, Lagos',
}

/** What the buyer can expect from working with us — capability, not a claim. */
export const buyHeroHighlights: readonly { id: string; icon: IconName; label: string }[] = [
  { id: 'inspection', icon: 'calendar-search', label: 'Private viewings arranged' },
  { id: 'documentation', icon: 'file-text', label: 'Documentation walk-through' },
  { id: 'areas', icon: 'map-pin', label: 'Guidance across Lagos areas' },
]

/** How many featured sale listings the "Featured Properties For Sale" grid shows. */
export const BUY_FEATURED_LIMIT = 6

/**
 * The buying categories a visitor can browse by.
 *
 * `count` is filled by the service from the sale catalogue — it is the number of
 * sample listings behind the card's link, never a hand-typed figure.
 */
export const buyCategorySeeds: Omit<BuyCategory, 'count'>[] = [
  {
    id: 'cat-buy-houses',
    name: 'Houses',
    description:
      'Detached and semi-detached homes, including duplexes within established estates across the island and mainland.',
    image: {
      src: '/images/categories/houses.webp',
      alt: 'A detached family house with a front lawn and covered entrance',
    },
    propertyType: 'house',
  },
  {
    id: 'cat-buy-apartments',
    name: 'Apartments',
    description:
      'Serviced flats, maisonettes and penthouse units in the city’s most connected districts.',
    image: {
      src: '/images/categories/apartments.webp',
      alt: 'Modern apartment building with balconies and large windows',
    },
    propertyType: 'apartment',
  },
  {
    id: 'cat-buy-luxury',
    name: 'Luxury Villas & Residences',
    description:
      'Signature homes in prime Lagos addresses — Banana Island, Ikoyi, Victoria Island and the Lekki corridor.',
    image: {
      src: '/images/categories/luxury.webp',
      alt: 'Contemporary luxury home with large glazing and a pool',
    },
    propertyType: 'luxury',
  },
  {
    id: 'cat-buy-land',
    name: 'Land & Plots',
    description:
      'Documented residential plots in fast-growing corridors, ready for construction or a longer-term build plan.',
    image: {
      src: '/images/categories/land.webp',
      alt: 'Cleared, surveyed plots of land awaiting development',
    },
    propertyType: 'land',
  },
  {
    id: 'cat-buy-commercial',
    name: 'Commercial Properties',
    description:
      'Offices, retail space and mixed-use units for businesses planning their next move.',
    image: {
      src: '/images/categories/commercial.webp',
      alt: 'Contemporary commercial building facade',
    },
    propertyType: 'commercial',
  },
  {
    id: 'cat-buy-developments',
    name: 'New Developments',
    description:
      'Off-plan and completed estate projects — including units in Novera Estates’ own developments.',
    image: {
      src: '/images/categories/developments.webp',
      alt: 'New multi-unit residential development under construction',
    },
    propertyType: 'development',
  },
]

/** The four steps of "Buying Property Made Simpler". */
export const buyingProcessSteps: BuyingProcessStep[] = [
  {
    id: 'step-define-brief',
    step: '01',
    title: 'Define your brief',
    description:
      'Tell us the area, property type and budget you have in mind. We refine a shortlist together rather than sending you the whole catalogue.',
    icon: 'compass',
  },
  {
    id: 'step-shortlist-inspect',
    step: '02',
    title: 'Shortlist & inspect',
    description:
      'Visit the properties that fit — we arrange private viewings at times that work for you, and answer questions on the spot.',
    icon: 'calendar-search',
  },
  {
    id: 'step-verify-paperwork',
    step: '03',
    title: 'Verify the paperwork',
    description:
      'We walk you through title documents, survey plans and transfer requirements so you make an informed offer.',
    icon: 'file-text',
  },
  {
    id: 'step-close-move',
    step: '04',
    title: 'Close & move in',
    description:
      'We stay with you through negotiation and the legal handover until the keys are in your hand.',
    icon: 'key',
  },
]

/**
 * What a buyer should consider before committing.
 *
 * These describe things to weigh up for yourself — the section carries a line
 * saying so, because nothing here is legal, financial or tax advice.
 */
export const buyerGuidance: BuyerGuidanceCard[] = [
  {
    id: 'guidance-location',
    title: 'Location & neighbourhood',
    description:
      'Roads, schools, work commute, security and how the area is actually developing — a visit outside viewing hours tells you the most.',
    icon: 'map-pin',
  },
  {
    id: 'guidance-budget',
    title: 'A budget with headroom',
    description:
      'Beyond the price, budget for fees, documentation, renovation and the months you may carry the property before it is earning.',
    icon: 'trending-up',
  },
  {
    id: 'guidance-documentation',
    title: 'Documentation & title',
    description:
      'Confirm the title, survey and deed of assignment yourself with a lawyer. Never rely on a verbal assurance of "clean papers".',
    icon: 'shield-check',
  },
  {
    id: 'guidance-holding-costs',
    title: 'Long-term holding costs',
    description:
      'Service charges, security, maintenance, utilities and ground conditions all shape whether a property stays a good buy after day one.',
    icon: 'ruler',
  },
]

/** The buying FAQ — disclosure first, as always. */
export const buyFaq: BuyFaqItem[] = [
  {
    id: 'faq-demo',
    question: 'Are these real, live listings?',
    answer:
      'No. The Buy page is a demonstration build, so every listing, price and count is sample data created to show the experience. Nothing here is live inventory and no price is a real offer. When you are ready, contact our team and we will work from the actual available stock.',
  },
  {
    id: 'faq-counts',
    question: 'Where do the property counts come from?',
    answer:
      'The number on a category or area card is the count of sample sale listings in this demo catalogue that match that category. It is calculated from the same catalogue behind the link, so the card and the results can never disagree — but neither is a real figure.',
  },
  {
    id: 'faq-inspection',
    question: 'How do I arrange an inspection?',
    answer:
      'An online booking flow is on the way. Until then, tap "Book an Inspection" from the Buy page and contact our office directly — our team will arrange a private viewing and answer questions about the property.',
  },
  {
    id: 'faq-paperwork',
    question: 'What paperwork is involved in buying?',
    answer:
      'Typically a deed of assignment, a registered survey and verified identity documents, plus confirmation from the relevant authority where required. Our team walks you through each step and works with your lawyer on the handover.',
  },
  {
    id: 'faq-financing',
    question: 'Can you help with financing or completing a land purchase?',
    answer:
      'We are an agency, not a lender or law firm. We help you evaluate options, introduce you to partners who support property purchases in Lagos, and make sure the legal process is followed — the decision remains yours.',
  },
]

/** Which category a filter button should follow — convenience for the search panel. */
export const buyPropertyTypes: readonly PropertyType[] = [
  'house',
  'apartment',
  'luxury',
  'land',
  'commercial',
  'development',
]