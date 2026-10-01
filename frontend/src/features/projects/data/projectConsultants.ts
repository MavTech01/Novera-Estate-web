import type { ProjectConsultant } from '@/features/projects/types/projectTypes'

/**
 * Fictional sales consultants for the demo catalogue.
 *
 * Every person here is invented. Names, numbers and email addresses do not
 * belong to anyone, and the WhatsApp numbers are obvious placeholders
 * (`+234 000` blocks) so they cannot route a message to a real account.
 *
 * A real deployment replaces this file with a `consultants` table joined on
 * `project_consultants` — the `ProjectConsultant` shape is what the API will
 * return either way.
 */
export const projectConsultants: ProjectConsultant[] = [
  {
    id: 'consultant-ad-hoc',
    name: 'Ad-hoc Enquiries',
    role: 'Novera Estates Client Advisory',
    phone: '+234 201 888 4400',
    phoneHref: '+2342018884400',
    email: 'hello@noveraestates.com',
    emailHref: 'hello@noveraestates.com',
    whatsappHref: '2340000000000',
    avatar: { src: '/images/team/ad-hoc.webp', alt: 'Novera Estates client advisory desk' },
  },
  {
    id: 'consultant-chiamaka',
    name: 'Chiamaka Okafor',
    role: 'Senior Property Consultant',
    phone: '+234 808 000 1141',
    phoneHref: '+2348080001141',
    email: 'chiamaka@noveraestates.com',
    emailHref: 'chiamaka@noveraestates.com',
    whatsappHref: '2340000001141',
    avatar: {
      src: '/images/team/chiamaka.webp',
      alt: 'Portrait of Chiamaka Okafor, Senior Property Consultant at Novera Estates',
    },
  },
  {
    id: 'consultant-tunde',
    name: 'Tunde Balogun',
    role: 'Development Sales Consultant',
    phone: '+234 808 000 2206',
    phoneHref: '+2348080002206',
    email: 'tunde@noveraestates.com',
    emailHref: 'tunde@noveraestates.com',
    whatsappHref: '2340000002206',
    avatar: {
      src: '/images/team/tunde-b.webp',
      alt: 'Portrait of Tunde Balogun, Development Sales Consultant at Novera Estates',
    },
  },
]

/**
 * Picks the consultant for a development.
 *
 * Assigned by a stable hash of the slug rather than by array position, so a
 * project keeps the same consultant as the catalogue is reordered — the page
 * must not reshuffle people when a new project is added to the top.
 */
export function consultantForSlug(slug: string): ProjectConsultant {
  let hash = 0

  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) % 100000
  }

  // Index 0 is the general enquiries desk, so it comes up least often.
  const pool = projectConsultants.slice(1)
  const index = pool.length === 0 ? 0 : hash % (pool.length + 1)

  return projectConsultants[index] ?? projectConsultants[0]
}
