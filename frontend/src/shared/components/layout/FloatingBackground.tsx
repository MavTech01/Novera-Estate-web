import { cn } from '@/shared/lib/cn'

/**
 * Slow, decorative background layers for a content section.
 *
 * Two kinds of layer, both far below the content: large blurred orange orbs that
 * drift, and faint outlined building shapes that float and rotate gently. The
 * whole thing is `aria-hidden` and `pointer-events: none`, so it is invisible to
 * assistive technology and can never intercept a click.
 *
 * Deliberately restrained. The orbs sit at 10–16% opacity and the outlines at
 * 8–11%, far enough below the text to keep body copy comfortably past AA on both
 * the cream and white surfaces this is used against, while still reading as
 * warmth. If a section ever needs the decoration to read strongly, the content
 * is the thing that should change — not these numbers.
 *
 * Performance:
 *  - only `transform` and `opacity` are animated, so the work stays on the
 *    compositor with no layout or paint;
 *  - the blur itself is a *static* filter, so the animated transforms never
 *    trigger a filter recalculation;
 *  - `contain: paint` keeps the layers from affecting anything outside them;
 *  - on phones only two orbs and two outlines survive — a blurred 400px element
 *    is one of the more expensive things you can ask a mobile GPU for, and four
 *    of them on a small screen buys nothing a visitor can see.
 *
 * `prefers-reduced-motion: reduce` stops the drift but keeps the layers (see
 * `components.css`), because removing them would change the composition rather
 * than just its motion.
 *
 * The parent must be `relative` and `overflow-hidden`; this renders a single
 * absolutely-positioned layer and sets neither itself.
 */

type Motion = 'fb-drift-a' | 'fb-drift-b' | 'fb-drift-c' | 'fb-float-a' | 'fb-float-b'
type Outline = 'house' | 'tower' | 'pitched'

interface Layer {
  id: string
  motion: Motion
  /** Placement and size. */
  className: string
  /** Duration, negative delay and opacity, so layers never start in lockstep. */
  style?: React.CSSProperties
  /** Hidden below `lg` to keep the cost down on small screens. */
  wideOnly?: boolean
  outline?: Outline
}

/** Blurred orbs. `blur` is a class; opacity and duration are inline. */
const ORBS: Layer[] = [
  {
    id: 'orb-nw',
    motion: 'fb-drift-a',
    className: '-left-[18%] -top-[30%] size-[22rem] blur-[70px] lg:size-[32rem]',
    style: { '--fb-duration': '28s', opacity: 0.16 } as React.CSSProperties,
  },
  {
    id: 'orb-se',
    motion: 'fb-drift-b',
    className: '-bottom-[28%] -right-[18%] size-[20rem] blur-[72px] lg:size-[30rem]',
    style: { '--fb-duration': '33s', opacity: 0.14, animationDelay: '-9s' } as React.CSSProperties,
  },
  {
    id: 'orb-ne',
    motion: 'fb-drift-c',
    className: '-top-[18%] right-[4%] size-[16rem] blur-[62px] lg:size-[24rem]',
    style: { '--fb-duration': '24s', opacity: 0.11 } as React.CSSProperties,
    wideOnly: true,
  },
  {
    id: 'orb-sw',
    motion: 'fb-drift-a',
    className: 'bottom-[2%] left-[14%] size-[15rem] blur-[60px] lg:size-[21rem]',
    style: { '--fb-duration': '35s', opacity: 0.1, animationDelay: '-15s' } as React.CSSProperties,
    wideOnly: true,
  },
]

/** Outlined buildings and roofs, drawn rather than imported as assets. */
const SHAPES: Layer[] = [
  {
    id: 'shape-house',
    outline: 'house',
    motion: 'fb-float-a',
    className: 'top-[12%] right-[8%] w-24 opacity-[0.11] lg:w-36',
    style: { '--fb-duration': '34s' } as React.CSSProperties,
  },
  {
    id: 'shape-tower',
    outline: 'tower',
    motion: 'fb-float-b',
    className: 'bottom-[14%] left-[4%] w-20 opacity-[0.09] lg:w-28',
    style: { '--fb-duration': '38s', animationDelay: '-11s' } as React.CSSProperties,
  },
  {
    id: 'shape-pitched',
    outline: 'pitched',
    motion: 'fb-float-a',
    className: 'top-[46%] right-[26%] w-28 opacity-[0.08] lg:w-40',
    style: { '--fb-duration': '30s', animationDelay: '-19s' } as React.CSSProperties,
    wideOnly: true,
  },
  {
    id: 'shape-house-far',
    outline: 'house',
    motion: 'fb-float-b',
    className: 'bottom-[6%] right-[6%] w-24 opacity-[0.07] lg:w-32',
    style: { '--fb-duration': '40s', animationDelay: '-24s' } as React.CSSProperties,
    wideOnly: true,
  },
]

const OUTLINE_STROKE = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const

export interface FloatingBackgroundProps {
  /** How many orbs to render, in order. Clamped to the four available. */
  orbCount?: number
  /** How many outlines to render, in order. Clamped to the four available. */
  shapeCount?: number
  className?: string
}

export function FloatingBackground({
  orbCount = ORBS.length,
  shapeCount = SHAPES.length,
  className,
}: FloatingBackgroundProps) {
  const orbs = ORBS.slice(0, Math.min(Math.max(orbCount, 0), ORBS.length))
  const shapes = SHAPES.slice(0, Math.min(Math.max(shapeCount, 0), SHAPES.length))

  if (orbs.length === 0 && shapes.length === 0) return null

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden select-none [contain:paint]', className)}
    >
      {orbs.map((orb) => (
        <span
          key={orb.id}
          className={cn(
            'absolute rounded-full bg-accent-400',
            orb.motion,
            orb.wideOnly && 'hidden lg:block',
            orb.className,
          )}
          style={orb.style}
        />
      ))}

      {shapes.map((shape) => (
        <span
          key={shape.id}
          className={cn('absolute text-accent-500', shape.motion, shape.wideOnly && 'hidden lg:block', shape.className)}
          style={shape.style}
        >
          <Outline name={shape.outline ?? 'house'} />
        </span>
      ))}
    </div>
  )
}

/**
 * `currentColor` on the stroke lets a layer be recoloured by setting `color`,
 * and `vector-effect: non-scaling-stroke` keeps the line weight even while the
 * float animation scales the layer.
 */
function Outline({ name }: { name: Outline }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="size-full" aria-hidden focusable="false">
      <g {...OUTLINE_STROKE}>
        {name === 'house' && (
          <>
            {/* Pitched roof, body, door and window. */}
            <path d="M20 56 50 32l30 24" />
            <path d="M26 53v35h48V53" />
            <path d="M45 88V68h12v20" />
            <path d="M34 62h6v6h-6z" />
            {/* Neighbouring shed, set back. */}
            <path d="M82 62 100 48l18 14" />
            <path d="M86 60v28h28V60" />
          </>
        )}

        {name === 'tower' && (
          <>
            <path d="M40 108V34l20-16 20 16v74" />
            <path d="M32 108h56" />
            {/* Floor lines. */}
            <path d="M40 60h40M40 78h40" />
            <path d="M54 108V88h12v20" />
            <path d="M68 22V10" />
          </>
        )}

        {name === 'pitched' && (
          <>
            <path d="M14 66h92" />
            <path d="M26 66V44l16-14 16 14v22" />
            <path d="M62 66V36l18-12 18 12v30" />
            <path d="M34 54h6v6h-6z" />
            <path d="M72 48h6v6h-6z" />
          </>
        )}
      </g>
    </svg>
  )
}
