import type { Agent } from '../types'

/** The Novera Estates advisory team. Later served from an `agents` table. */
export const agents: Record<'adaeze' | 'tunde' | 'chiamaka', Agent> = {
  adaeze: {
    id: 'agent-adaeze-okonkwo',
    name: 'Adaeze Okonkwo',
    role: 'Head of Residential Sales',
    phone: '+234 802 345 6710',
    email: 'adaeze@noveraestates.com',
    avatar: { src: '/images/team/ad-hoc.webp', alt: 'Portrait of Adaeze Okonkwo' },
  },
  tunde: {
    id: 'agent-tunde-bakare',
    name: 'Tunde Bakare',
    role: 'Investment & Land Advisor',
    phone: '+234 803 908 2244',
    email: 'tunde@noveraestates.com',
    avatar: { src: '/images/team/tunde-b.webp', alt: 'Portrait of Tunde Bakare' },
  },
  chiamaka: {
    id: 'agent-chiamaka-nwosu',
    name: 'Chiamaka Nwosu',
    role: 'Leasing Specialist',
    phone: '+234 809 771 5533',
    email: 'chiamaka@noveraestates.com',
    avatar: { src: '/images/team/chiamaka.webp', alt: 'Portrait of Chiamaka Nwosu' },
  },
}
