import type { ProcessStep } from '@/types'

/** "A Simple Path to Your Property" — the three-step client journey. */
export const processSteps: ProcessStep[] = [
  {
    id: 'step-discover',
    step: '01',
    icon: 'search',
    title: 'Discover',
    description: 'Tell us your budget, location and timeline, and we shortlist verified properties that fit.',
  },
  {
    id: 'step-inspect',
    step: '02',
    icon: 'calendar-search',
    title: 'Inspect',
    description: 'Walk through your shortlisted properties with an agent, on a schedule that suits you.',
  },
  {
    id: 'step-move-forward',
    step: '03',
    icon: 'key',
    title: 'Move Forward',
    description: 'We handle negotiation, documentation and handover so nothing is left to chance.',
  },
]
