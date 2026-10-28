import { images } from '@/assets/images'

export interface HeroSlide {
  readonly src: string
  readonly alt: string
  readonly label: string
  readonly headlineLine1: string
  readonly headlineLine2Prefix: string
  readonly headlineLine2Highlight: string
  readonly subtitle: string
}

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    src: images.hero.slide1,
    alt: 'Expansive wide-angle view of a modern luxury villa with illuminated swimming pool at twilight',
    label: 'Premier Brokerage',
    headlineLine1: 'Novera Estates',
    headlineLine2Prefix: 'Built on',
    headlineLine2Highlight: 'Excellence.',
    subtitle: 'Premier luxury real estate brokerage and advisory across Lagos.',
  },
  {
    src: images.hero.slide2,
    alt: 'Wide architectural view of a contemporary luxury estate with landscaped grounds and warm lighting',
    label: 'Estate Development',
    headlineLine1: 'Signature Estates',
    headlineLine2Prefix: 'Crafted with',
    headlineLine2Highlight: 'Precision.',
    subtitle: 'Developing modern gated communities and master-planned residences.',
  },
  {
    src: images.hero.slide3,
    alt: 'Sprawling luxury architectural mansion with infinity terrace and panoramic surroundings',
    label: 'Property Advisory',
    headlineLine1: 'Property Advisory',
    headlineLine2Prefix: 'Rooted in',
    headlineLine2Highlight: 'Trust.',
    subtitle: 'Transparent guidance, verified titles, and seamless transactions.',
  },
  {
    src: images.hero.slide4,
    alt: 'Wide exterior shot of a modern minimalist villa with expansive glass facade and pool terrace',
    label: 'Wealth Strategy',
    headlineLine1: 'Wealth Strategy',
    headlineLine2Prefix: 'Focused on',
    headlineLine2Highlight: 'Value.',
    subtitle: 'High-yield off-plan portfolios tailored for enduring capital growth.',
  },
] as const

export const HERO_ROTATION_INTERVAL = 6000
