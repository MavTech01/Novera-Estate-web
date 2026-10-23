import { Icon } from '@/shared/components/ui/Icon'
import type { Location } from '@/features/locations/types/locationTypes'
import { LOCATION_MAP_METADATA } from './locationExplorerData'
import { LocationMapPin } from './LocationMapPin'

interface LocationInteractiveMapProps {
  locations: Location[]
  activeSlug: string
  onSelectLocation: (slug: string) => void
}

/**
 * Interactive cartographic map canvas of Lagos showcasing waterways, transit arteries,
 * and clickable location pins.
 */
export function LocationInteractiveMap({
  locations,
  activeSlug,
  onSelectLocation,
}: LocationInteractiveMapProps) {
  return (
    <div className="relative flex min-h-[380px] flex-col overflow-hidden rounded-3xl border border-sand-200 bg-[#fbf7f2] shadow-sm sm:min-h-[460px] lg:min-h-[540px]">
      {/* Fine Cartography Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Stylized Coastal Waterways & Transit Routes (Light Mode) */}
      <svg
        viewBox="0 0 1000 650"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lightWaterway" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8ecf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#cbe3f3" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lightOcean" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c5e0f2" stopOpacity="1" />
            <stop offset="100%" stopColor="#b4d5eb" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Lagos Lagoon (Central Waterway) */}
        <path
          d="M 280 320 C 350 300, 420 270, 520 280 C 620 290, 750 250, 880 240 C 950 235, 1000 230, 1000 460 C 860 460, 780 435, 710 445 C 620 455, 540 465, 460 435 C 400 415, 330 380, 280 320 Z"
          fill="url(#lightWaterway)"
          stroke="#98c5e3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Atlantic Ocean (Southern Coastline) */}
        <path
          d="M 0 540 C 220 520, 440 535, 660 515 C 800 500, 910 490, 1000 500 L 1000 650 L 0 650 Z"
          fill="url(#lightOcean)"
          stroke="#89b9d9"
          strokeWidth="2"
        />

        {/* Five Cowrie Creek & Commodore Channel */}
        <path
          d="M 430 440 C 480 460, 530 500, 590 510 C 650 520, 710 515, 770 505"
          fill="none"
          stroke="#96c4e2"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Mainland Highway: Ikeja down to Yaba */}
        <path
          d="M 260 143 L 320 200 L 380 273"
          fill="none"
          stroke="rgba(234,88,12,0.4)"
          strokeWidth="3"
          strokeDasharray="7 5"
        />

        {/* Third Mainland Bridge: Yaba across the Lagoon to Ikoyi */}
        <path
          d="M 380 273 C 440 330, 490 360, 560 403"
          fill="none"
          stroke="#ea580c"
          strokeWidth="3.5"
          strokeDasharray="6 4"
        />

        {/* Lekki-Ikoyi Link Bridge */}
        <path
          d="M 560 403 C 610 420, 650 440, 700 455"
          fill="none"
          stroke="#ea580c"
          strokeWidth="3.5"
          strokeDasharray="5 4"
        />

        {/* Victoria Island to Ikoyi link */}
        <path
          d="M 440 494 C 480 465, 520 435, 560 403"
          fill="none"
          stroke="rgba(234,88,12,0.5)"
          strokeWidth="3"
          strokeDasharray="6 4"
        />

        {/* Lekki-Epe Expressway: Lekki Phase 1 eastward to Ajah */}
        <path
          d="M 700 455 C 750 425, 795 385, 840 351"
          fill="none"
          stroke="#ea580c"
          strokeWidth="4"
        />

        {/* Geographic Labels */}
        <text x="610" y="340" fill="#608ba8" fontSize="12" fontWeight="bold" letterSpacing="2.5" opacity="0.8">
          LAGOS LAGOON
        </text>
        <text x="360" y="600" fill="#5885a2" fontSize="12" fontWeight="bold" letterSpacing="3" opacity="0.8">
          ATLANTIC OCEAN
        </text>
        <text x="735" y="410" fill="#c2410c" fontSize="9" fontWeight="bold" letterSpacing="1" opacity="0.75">
          LEKKI–EPE EXPWY
        </text>
        <text x="430" y="335" fill="#c2410c" fontSize="9" fontWeight="bold" letterSpacing="1" opacity="0.75">
          3RD MAINLAND BRG
        </text>
      </svg>

      {/* Map Region Badge (Top-Left) */}
      <div className="pointer-events-none absolute left-3.5 top-3.5 z-10 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sand-200/90 bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur-md">
          <Icon name="map-pin" className="size-3.5 text-accent-600" strokeWidth={2} />
          <span>Lagos, Nigeria</span>
        </span>
      </div>

      {/* Compass Rose Indicator (Top-Right) */}
      <div className="pointer-events-none absolute right-3.5 top-3.5 z-10 flex flex-col items-center justify-center rounded-xl border border-sand-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-bold text-ink-700 shadow-sm backdrop-blur-md">
        <span className="text-[0.625rem] font-black text-accent-600">N</span>
        <Icon name="navigation" className="size-3 text-ink-400" />
      </div>

      {/* Interactive Pins on Map */}
      {locations.map((loc) => {
        const meta = LOCATION_MAP_METADATA[loc.slug]
        if (!meta) return null

        return (
          <LocationMapPin
            key={loc.id}
            location={loc}
            meta={meta}
            isActive={loc.slug === activeSlug}
            onSelect={onSelectLocation}
          />
        )
      })}

      {/* Bottom Tip & Interactive Indicator */}
      <div className="pointer-events-none absolute bottom-3 inset-x-3.5 flex justify-between items-center text-[0.625rem] text-ink-500">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Icon name="map-pin" className="size-3 text-accent-600" />
          Tap any pin to view estate details
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 font-semibold text-ink-600 border border-sand-200 backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-accent-500 animate-ping" />
          Interactive Map
        </span>
      </div>
    </div>
  )
}
