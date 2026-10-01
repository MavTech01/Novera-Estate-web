import { cn } from '@/shared/lib/cn'

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

/**
 * The shared banner-to-section wave.
 *
 * Two stacked waves: a soft orange back wave that drifts slowly, and a solid
 * front wave filled with the next section's colour. The SVG stretches edge to
 * edge (`preserveAspectRatio="none"`) at a fixed height, and a one-pixel
 * negative bottom margin kills the hairline browsers otherwise leave where the
 * wave meets the section below.
 */
export function WaveDivider({ color = 'white', className }: WaveDividerProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none -mb-px w-full', className)}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        role="presentation"
        className="block h-15 w-full lg:h-28"
      >
        <g className="wave-drift">
          <path
            d="M-80,56 C100,96 300,20 540,44 C740,68 900,104 1080,80 C1260,56 1400,28 1520,48 L1520,120 L-80,120 Z"
            fill="#F97316"
            fillOpacity="0.25"
          />
        </g>
        <path
          d="M0,78 C200,44 360,92 560,72 C760,52 940,96 1140,74 C1290,58 1380,66 1440,58 L1440,120 L0,120 Z"
          fill={frontFills[color]}
        />
      </svg>
    </div>
  )
}
