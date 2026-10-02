import type { IconName, PropertyType } from '@/types'
import type {
  RentCategory,
  RentFaqItem,
  RentalGuidanceCard,
  RentalProcessStep,
} from '@/features/rent/types/rent.types'

/**
 * Editorial content for the Rent page.
 *
 * Everything here is copy an editor could change without touching any code:
 * the category cards, the four-step process, the rental guidance and the FAQ.
 * What this file deliberately does *not* contain is a second inventory.
 *
 * The catalogue — which properties are available to rent, and how many sit
 * behind each category or area — is owned by the shared properties catalogue.
 * This file only describes each bucket, so a card and the results behind it can
 * never disagree.
 *
 * Note on honesty: these are demo listings. No price, count or neighbourhood in
 * this file is a live claim, and the page surfaces that with a visible notice.
 */

/** The main photograph for the Rent page hero. */
export const RENT_HERO_IMAGE = {
  src: '/images/properties/victoria-apartment.webp',
  alt: 'Bright, furnished apartment interior prepared for rental in Lagos',
}

/** What the renter can expect from working with us — capability, not a claim. */
export const rentHeroHighlights: readonly { id: string; icon: IconName; label: string }[] = [
  { id: 'inspection', icon: 'calendar-search', label: 'Private viewings arranged' },
  { id: 'terms', icon: 'file-text', label: 'Guidance on tenancy terms' },
  { id: 'areas', icon: 'map-pin', label: 'Rentals across Lagos areas' },
]

/** How many rentals the "Featured Properties For Rent" grid shows. */
export const RENT_FEATURED_LIMIT = 6

/**
 * The rental property types offered in the search panel.
 *
 * Land is deliberately absent — you rent a home or a workspace, not a plot —
 * and the list stays on the shared `PropertyType` vocabulary so a selection here
 * is exactly the `type` filter `/properties` already understands.
 */
export const rentPropertyTypes: readonly PropertyType[] = [
  'apartment',
  'house',
  'luxury',
  'commercial',
  'development',
]

/**
 * The rental categories a visitor can browse by.
 *
 * `count` is filled by the service from the rental catalogue — it is the number
 * of sample listings behind the card's link, never a hand-typed figure. A couple
 * of the cards resolve to the same underlying type on purpose: "Apartments" and
 * "Self Contain & Studios" are both flats in the catalogue, but they are
 * different things to a renter, and the copy carries that distinction.
 */
export const rentCategorySeeds: Omit<RentCategory, 'count'>[] = [
  {
    id: 'cat-rent-apartments',
    name: 'Apartments',
    description:
      'Serviced flats, maisonettes and well-connected units in Lagos’s established residential districts.',
    image: {
      src: '/images/categories/apartments.webp',
      alt: 'Modern apartment building with balconies and large windows',
    },
    propertyType: 'apartment',
  },
  {
    id: 'cat-rent-houses',
    name: 'Houses & Duplexes',
    description:
      'Detached, semi-detached and terrace homes with space for a family, in gated estates and quiet streets.',
    image: {
      src: '/images/categories/houses.webp',
      alt: 'A detached family house with a front lawn and covered entrance',
    },
    propertyType: 'house',
  },
  {
    id: 'cat-rent-villas',
    name: 'Villas & Luxury Residences',
    description:
      'Signature homes and premium rentals in prime addresses such as Ikoyi, Victoria Island and the Lekki corridor.',
    image: {
      src: '/images/categories/luxury.webp',
      alt: 'Contemporary luxury home with large glazing and a pool',
    },
    propertyType: 'luxury',
  },
  {
    id: 'cat-rent-self-contain',
    name: 'Self Contain & Studios',
    description:
      'Compact, affordable rentals for students, young professionals and single occupiers close to work or campus.',
    image: {
      src: '/images/properties/ikoyi-apartment.webp',
      alt: 'Compact studio-style apartment interior in Lagos',
    },
    propertyType: 'apartment',
  },
  {
    id: 'cat-rent-commercial',
    name: 'Commercial Spaces',
    description:
      'Offices, retail units and business premises available to let across the mainland and the island.',
    image: {
      src: '/images/categories/commercial.webp',
      alt: 'Contemporary commercial building facade',
    },
    propertyType: 'commercial',
  },
  {
    id: 'cat-rent-developments',
    name: 'New Developments',
    description:
      'Units in recently completed and off-plan estates — including developments from Novera Estates.',
    image: {
      src: '/images/categories/developments.webp',
      alt: 'New multi-unit residential development under construction',
    },
    propertyType: 'development',
  },
]

/** The four steps of "Renting Made Simpler". */
export const rentalProcessSteps: RentalProcessStep[] = [
  {
    id: 'step-search',
    step: '01',
    title: 'Search',
    description:
      'Explore rental properties based on your preferred location, property type and budget.',
    icon: 'search',
  },
  {
    id: 'step-shortlist',
    step: '02',
    title: 'Shortlist',
    description:
      'Save the properties that interest you and compare your options side by side before deciding.',
    icon: 'heart',
  },
  {
    id: 'step-inspect',
    step: '03',
    title: 'Inspect',
    description:
      'Arrange an inspection and view the property in person before making a decision.',
    icon: 'calendar-search',
  },
  {
    id: 'step-move-forward',
    step: '04',
    title: 'Move Forward',
    description:
      'Review the relevant information and take the next step towards the rental that fits you.',
    icon: 'key',
  },
]

/**
 * What a renter should consider before committing.
 *
 * These describe things to weigh up for yourself — the section carries a line
 * saying so, because nothing here is legal or financial advice.
 */
export const rentalGuidance: RentalGuidanceCard[] = [
  {
    id: 'guidance-location',
    title: 'Location',
    description:
      'Consider accessibility, the surrounding area, transport options and how close it is to the places that matter to you.',
    icon: 'map-pin',
  },
  {
    id: 'guidance-total-cost',
    title: 'Total Cost',
    description:
      'Look at the rent together with any other applicable costs and charges, so the full picture is clear before you commit.',
    icon: 'trending-up',
  },
  {
    id: 'guidance-condition',
    title: 'Property Condition',
    description:
      'Inspect the property carefully and identify any issues — fixtures, fittings, water and power — before you commit.',
    icon: 'ruler',
  },
  {
    id: 'guidance-documentation',
    title: 'Documentation',
    description:
      'Review the relevant documents and tenancy terms carefully, and ask questions about anything that is unclear.',
    icon: 'file-text',
  },
  {
    id: 'guidance-inspection',
    title: 'Inspection',
    description:
      'Visit the property before making an important decision; photos and descriptions only go so far.',
    icon: 'calendar-search',
  },
  {
    id: 'guidance-tenancy',
    title: 'Tenancy Terms',
    description:
      'Understand the duration, renewal conditions, responsibilities and any other terms in the tenancy agreement.',
    icon: 'shield-check',
  },
]

/** The renting FAQ — disclosure first, as always. */
export const rentFaq: RentFaqItem[] = [
  {
    id: 'faq-find',
    question: 'How can I find a property to rent?',
    answer:
      'Use the search on this page to filter rentals by location, property type, budget, bedrooms and other available filters. Submitting the search opens the catalogue with those filters applied, so you can compare every matching rental in one place.',
  },
  {
    id: 'faq-inspect',
    question: 'Can I inspect a rental property before deciding?',
    answer:
      'Yes. You can request an inspection through the platform and our team will arrange a viewing, so you can see the property in person before you make a decision.',
  },
  {
    id: 'faq-costs',
    question: 'What costs should I consider when renting?',
    answer:
      'Consider the rent itself together with any applicable additional charges, such as service charges, agency or legal fees and a security deposit. Ask for the full breakdown in writing before you commit.',
  },
  {
    id: 'faq-save',
    question: 'Can I save rental properties?',
    answer:
      'You can save properties as you browse using the heart on each card. A customer account that keeps your shortlist across visits is on the way — in the meantime your saved set lasts for the current session.',
  },
  {
    id: 'faq-contact',
    question: 'Can I contact Novera Estates about a rental?',
    answer:
      'Of course. Reach us through the contact page or by phone, and tell us what you are looking for. We will work through the available rentals with you and answer any questions about a specific property.',
  },
  {
    id: 'faq-before-rent',
    question: 'Should I inspect a property before renting?',
    answer:
      'We always encourage it. Visit the property and review the relevant information before making an important decision — it is the surest way to know a place is right for you.',
  },
]
