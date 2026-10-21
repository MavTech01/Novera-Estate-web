import { cn } from '@/shared/lib/cn'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'

type WaveColor = 'white' | 'cream'

interface WaveDividerProps {
  /**
   * Fill of the front wave. It must match the background of the section that
   * follows, so the two read as one continuous surface.
   */
  color?: WaveColor
  /** Extra classes, e.g. to pull the wave up under an overlapping card. */
  className?: string
}

const frontFills: Record<WaveColor, string> = {
  white: '#ffffff',
  cream: '#fff4e8',
}

/*
 * The back wave is one path that ripples by morphing its own shape — a single
 * translucent layer, no stacked copies. `backWavePath` samples a sine into a
 * run of cubic segments with horizontal tangents, so every frame shares an
 * identical command structure; SMIL can then interpolate between them and the
 * shape rolls like water. The path is drawn wider than the viewBox so its ends
 * are always clipped, and the last frame equals the first for a seamless loop.
 */
const BACK_X0 = -120
const BACK_STEP = 280
const BACK_POINTS = 7

function backWavePath(phase: number): string {
  const ys = Array.from({ length: BACK_POINTS }, (_, index) => {
    const t = index / (BACK_POINTS - 1)
    const amplitude = 0.55 + 0.45 * Math.sin(t * Math.PI)
    return 74 - 24 * Math.sin(t * Math.PI * 2 + phase) * amplitude
  })

  let d = `M${BACK_X0},${ys[0].toFixed(1)}`
  for (let index = 0; index < BACK_POINTS - 1; index += 1) {
    const x1 = BACK_X0 + index * BACK_STEP
    const x2 = x1 + BACK_STEP
    const c1x = x1 + BACK_STEP / 3
    const c2x = x2 - BACK_STEP / 3
    d += ` C${c1x.toFixed(1)},${ys[index].toFixed(1)} ${c2x.toFixed(1)},${ys[index + 1].toFixed(1)} ${x2.toFixed(1)},${ys[index + 1].toFixed(1)}`
  }
  d += ` L${BACK_X0 + (BACK_POINTS - 1) * BACK_STEP},120 L${BACK_X0},120 Z`
  return d
}

const WAVE_MORPH = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, Math.PI * 2]
  .map(backWavePath)
  .join(';')

const frontWavePath =
  'M0,78 C200,44 360,92 560,72 C760,52 940,96 1140,74 C1270,56 1370,70 1440,78 L1440,120 L0,120 Z'

/**
 * The shared banner-to-section wave.
 *
 * A single translucent orange wave ripples at the base of the banner, and a
 * solid front wave — filled with the next section's colour — sits over it and
 * stays still, so the seam meets the following section exactly. The SVG
 * stretches edge to edge (`preserveAspectRatio="none"`) at a fixed height, and
 * a one-pixel negative bottom margin kills the hairline browsers otherwise
 * leave. The ripple is skipped for visitors who reduce motion.
 */
export function WaveDivider({ color = 'white', className }: WaveDividerProps) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div aria-hidden className={cn('pointer-events-none -mb-px w-full', className)}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        role="presentation"
        className="block h-15 w-full lg:h-28"
      >
        <path d={backWavePath(0)} fill="var(--color-accent-600)" fillOpacity="0.22">
          {!reduceMotion && (
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              calcMode="linear"
              values={WAVE_MORPH}
            />
          )}
        </path>
        <path d={frontWavePath} fill={frontFills[color]} />
      </svg>
    </div>
  )
}
