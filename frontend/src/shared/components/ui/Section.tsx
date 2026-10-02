import { cn } from '@/shared/lib/cn'

type SectionTone = 'white' | 'tint' | 'warm' | 'brown'

interface SectionProps {
  id?: string
  /**
   * Id of the heading this band is about.
   *
   * Forwarded rather than left to each caller, because a section whose heading
   * is rendered by a child (`SectionHeading`, or a heading set by the page) has
   * no other way to name itself for assistive tech — the same reason `CtaBand`
   * takes a `headingId`.
   */
  ariaLabelledBy?: string
  tone?: SectionTone
  /** Vertical rhythm — 80px to 112px on desktop. */
  spacing?: 'default' | 'tight' | 'none'
  /**
   * Render as an in-flow panel instead of a full-width page band.
   *
   * For a section that sits inside a multi-column layout, where a full-bleed
   * background would ignore the column it is in. A contained section takes its
   * own padding instead of `spacing`, and the column supplies the rhythm
   * between panels — so the vertical gap is decided in one place per column
   * rather than per section.
   */
  contained?: boolean
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

/** Panel padding for a contained section. */
const panelPadding = 'rounded-2xl p-6 sm:p-8 lg:p-10'

/** Consistent page band: background tone + vertical rhythm in one place. */
export function Section({
  id,
  ariaLabelledBy,
  tone = 'white',
  spacing = 'default',
  contained = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(tones[tone], contained ? panelPadding : spacings[spacing], className)}
    >
      {children}
    </section>
  )
}
