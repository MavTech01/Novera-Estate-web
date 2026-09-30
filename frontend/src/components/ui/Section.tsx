import { cn } from '../../lib/cn'

type SectionTone = 'white' | 'tint' | 'warm' | 'brown'

interface SectionProps {
  id?: string
  tone?: SectionTone
  /** Vertical rhythm — 80px to 112px on desktop. */
  spacing?: 'default' | 'tight' | 'none'
  className?: string
  children: React.ReactNode
}

const tones: Record<SectionTone, string> = {
  white: 'bg-white text-ink-600',
  tint: 'bg-tint-50 text-ink-600',
  warm: 'bg-sand-100 text-ink-600',
  brown: 'bg-ink-700 text-white/80',
}

const spacings = {
  default: 'py-20 sm:py-24 lg:py-28',
  tight: 'py-16 sm:py-20',
  none: '',
} as const

/** Consistent page band: background tone + vertical rhythm in one place. */
export function Section({ id, tone = 'white', spacing = 'default', className, children }: SectionProps) {
  return (
    <section id={id} className={cn(tones[tone], spacings[spacing], className)}>
      {children}
    </section>
  )
}
