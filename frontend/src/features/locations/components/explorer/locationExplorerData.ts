export interface LocationMapMetadata {
  /** Percentage across map width (0 to 100) */
  x: number
  /** Percentage down map height (0 to 100) */
  y: number
  /** Geographic corridor / zone */
  zone: string
  /** Key area badge / value proposition */
  badge: string
  /** Property types offered in this hub */
  propertyTypes: string
  /** Key neighborhood & estate infrastructure highlights */
  highlights: string[]
}

export const LOCATION_MAP_METADATA: Record<string, LocationMapMetadata> = {
  'lekki-phase-1': {
    x: 70,
    y: 70,
    zone: 'Lekki Peninsula Corridor',
    badge: 'Premier Coastal Living',
    propertyTypes: 'Luxury Duplexes, Penthouses & Waterfront Plots',
    highlights: [
      'Gated community estates & 24/7 security',
      'Direct Ikoyi Link Bridge & expressway access',
      'Top commercial centers, dining & schools',
      'Consistently high capital appreciation',
    ],
  },
  ajah: {
    x: 84,
    y: 54,
    zone: 'Fast-Growing Peninsula',
    badge: 'High Value Growth',
    propertyTypes: 'Spacious Family Homes, Terraces & Investment Plots',
    highlights: [
      'Expanding infrastructure & road networks',
      'Family-friendly residential estates',
      'Affordable luxury plot opportunities',
      'Strong rental yields and demand',
    ],
  },
  ikoyi: {
    x: 56,
    y: 62,
    zone: 'Island Diplomatic & Executive',
    badge: 'Ultra-Luxury Prestige',
    propertyTypes: 'Waterfront Mansions, Penthouses & Boutique Towers',
    highlights: [
      'Banana Island & Bourdillon prestige',
      'High security & lush tree-lined streets',
      'Home to top executives & embassies',
      'Private boat clubs and waterfront docks',
    ],
  },
  ikeja: {
    x: 26,
    y: 22,
    zone: 'Lagos Mainland Capital',
    badge: 'Central Connectivity',
    propertyTypes: 'Serviced Duplexes, Executive Homes & Commercial Space',
    highlights: [
      'Ikeja GRA & airport proximity',
      'Direct access to major expressways',
      'Established commercial & financial district',
      'Prime business & executive residences',
    ],
  },
  'victoria-island': {
    x: 44,
    y: 76,
    zone: 'Financial & Diplomatic Core',
    badge: 'Atlantic Waterfront Core',
    propertyTypes: 'Luxury High-Rises, Modern Apartments & Premium Offices',
    highlights: [
      'Nigeria’s premier financial headquarters',
      'Eko Atlantic City proximity',
      'Vibrant seaside promenades & dining',
      'Prime corporate rental demand',
    ],
  },
  yaba: {
    x: 38,
    y: 42,
    zone: 'Mainland Innovation Hub',
    badge: 'High Rental Yields',
    propertyTypes: 'Modern Apartments, Tech Work-Live Spaces & Studios',
    highlights: [
      'Lagos technology cluster ecosystem',
      'Fast Third Mainland Bridge access to islands',
      'High demand from young professionals',
      'Active commercial and cultural nightlife',
    ],
  },
}

export const DEFAULT_LOCATION_MAP_METADATA: LocationMapMetadata = {
  x: 50,
  y: 50,
  zone: 'Prime Lagos Area',
  badge: 'Verified Estates',
  propertyTypes: 'Luxury Residences & Plots',
  highlights: [
    'Prime infrastructure',
    '24/7 Security',
    'Verified title deeds',
    'High capital growth',
  ],
}
