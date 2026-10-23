export interface CategoryGalleryMeta {
  tag: string
  subtitle: string
  /** Tailwind grid column span classes across all viewports */
  colSpanClasses: string
  /** Tailwind compact height classes */
  minHeightClasses: string
}

export const CATEGORY_GALLERY_META: Record<string, CategoryGalleryMeta> = {
  'cat-luxury': {
    tag: '✦ Signature Collection',
    subtitle: 'Signature luxury homes & waterfront penthouses in premier Lagos addresses.',
    colSpanClasses: 'col-span-7',
    minHeightClasses: 'min-h-[180px] sm:min-h-[240px] lg:min-h-[280px]',
  },
  'cat-apartments': {
    tag: 'High Rental Yield',
    subtitle: 'Serviced flats, maisonettes & short-let spaces across prime districts.',
    colSpanClasses: 'col-span-5',
    minHeightClasses: 'min-h-[180px] sm:min-h-[240px] lg:min-h-[280px]',
  },
  'cat-houses': {
    tag: 'Family Residences',
    subtitle: 'Detached, semi-detached & gated community duplexes.',
    colSpanClasses: 'col-span-5',
    minHeightClasses: 'min-h-[170px] sm:min-h-[230px] lg:min-h-[270px]',
  },
  'cat-developments': {
    tag: 'Master-Planned',
    subtitle: 'Off-plan investments & newly completed estate communities.',
    colSpanClasses: 'col-span-7',
    minHeightClasses: 'min-h-[170px] sm:min-h-[230px] lg:min-h-[270px]',
  },
  'cat-land': {
    tag: 'Verified Titles',
    subtitle: 'Documented plots & acreage in fast-appreciating growth corridors.',
    colSpanClasses: 'col-span-6',
    minHeightClasses: 'min-h-[160px] sm:min-h-[220px] lg:min-h-[250px]',
  },
  'cat-commercial': {
    tag: 'Corporate & Retail',
    subtitle: 'Executive office towers, business plazas & prime commercial units.',
    colSpanClasses: 'col-span-6',
    minHeightClasses: 'min-h-[160px] sm:min-h-[220px] lg:min-h-[250px]',
  },
}

export const DEFAULT_GALLERY_META: CategoryGalleryMeta = {
  tag: 'Featured Category',
  subtitle: 'Curated properties by Novera Estates.',
  colSpanClasses: 'col-span-6',
  minHeightClasses: 'min-h-[170px] sm:min-h-[230px] lg:min-h-[260px]',
}
