import type { Article } from '@/types'

/**
 * Editorial content for the insights section.
 * Later this becomes a `articles` table and a `GET /api/articles` endpoint.
 */
export const articles: Article[] = [
  {
    id: 'article-001',
    slug: '5-things-to-check-before-buying-land',
    title: '5 Things to Check Before Buying Land',
    excerpt:
      'A registered survey, a proper deed of assignment and a physical inspection of the site can save you from a costly dispute later.',
    category: 'Buying Guide',
    publishedAt: '2026-02-18',
    readTimeMinutes: 6,
    image: {
      src: '/images/blog/buying-land.webp',
      alt: 'Survey documents and a site plan on a desk beside land',
    },
    author: 'Tunde Bakare',
  },
  {
    id: 'article-002',
    slug: 'understanding-property-investment-in-lagos',
    title: 'Understanding Property Investment in Lagos',
    excerpt:
      'How to evaluate rental yield, capital appreciation and exit strategies across Lagos corridors before you commit capital.',
    category: 'Investment',
    publishedAt: '2026-01-30',
    readTimeMinutes: 8,
    image: {
      src: '/images/blog/investment.webp',
      alt: 'Analyst reviewing property market charts in a bright office',
    },
    author: 'Adaeze Okonkwo',
  },
  {
    id: 'article-003',
    slug: 'how-to-choose-the-right-location',
    title: 'How to Choose the Right Location',
    excerpt:
      'Roads, schools, security and resale value: the four factors that should shape your next property decision.',
    category: 'Market Guides',
    publishedAt: '2026-01-12',
    readTimeMinutes: 5,
    image: {
      src: '/images/blog/choosing-location.webp',
      alt: 'Aerial view of residential streets and rooftops across a city',
    },
    author: 'Chiamaka Nwosu',
  },
]
