import { company } from '@/data/company'
import { locationSearchShortcuts } from '@/features/locations/data/locationOptions'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { locationPath } from '@/shared/lib/routes'
import { Link } from '@/shared/components/ui/Link'
import type { LocationSearchController } from '@/features/locations/hooks/useLocationSearch'
import { LocationSearch } from './LocationSearch'

interface LocationHeroProps {
  controller: LocationSearchController
  /** Names offered as one-tap suggestions under the search field. */
  suggestions: { slug: string; name: string }[]
  /** Called when the search form is submitted, to bring the results into view. */
  onSearch: () => void
}

/**
 * Locations page hero: the promise, a city photograph, and the search tool
 * pulled up beneath so it reads as part of the banner rather than as a separate
 * widget — the same composition the projects hero uses.
 *
 * Kept deliberately short. The hero's job is to orient and to hand the visitor
 * to the search; the catalogue is the page, not the banner.
 */
export function LocationHero({ controller, suggestions, onSearch }: LocationHeroProps) {
  return (
    <>
      <section
        className="relative overflow-hidden bg-white pb-32 pt-28 sm:pb-36 sm:pt-32 lg:pb-40 lg:pt-36"
        aria-labelledby="locations-hero-heading"
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-sand-200" />
        <div
          aria-hidden
          className="blob-orange absolute -right-24 top-24 hidden h-[24rem] w-[24rem] rounded-[3rem] opacity-20 lg:block"
        />

        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-pill bg-tint-50 px-4 py-1.5 text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
                <Icon name="map-pinned" className="size-3.5" strokeWidth={2.2} />
                {company.descriptor}
              </p>

              <h1 id="locations-hero-heading" className="mt-6 text-ink-900">
                Find Your Place in Lagos
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
                Discover properties and developments across some of Lagos's most sought-after areas.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
                <span className="flex items-center gap-2">
                  <Icon name="shield-check" className="size-4 text-accent-500" strokeWidth={2} />
                  Inspected before you view
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="calendar-search" className="size-4 text-accent-500" strokeWidth={2} />
                  Site visits available
                </span>
              </div>
            </div>

            <div className="animate-fade-up-slow relative" style={{ animationDelay: '120ms' }}>
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
                <SkeletonImage
                  src="/images/hero/hero-main.webp"
                  alt="Aerial view of Lagos showing residential districts, roads and the coastline"
                  width={1400}
                  height={1050}
                  loading="eager"
                  fetchPriority="high"
                  className="aspect-[4/3] w-full"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 z-20 flex items-center gap-3 rounded-xl bg-white p-4 shadow-md sm:-left-8">
                <span className="flex size-11 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                  <Icon name="compass" className="size-5" strokeWidth={2} />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-sm font-bold leading-tight text-ink-900">
                    {company.tagline}
                  </span>
                  <span className="mt-1 text-xs text-ink-500">Lekki · Ajah · Ikoyi · Ikeja · V.I · Yaba</span>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Search tool lifted into the banner. */}
      <div className="relative z-20 -mt-28 sm:-mt-32 lg:-mt-36">
        <Container>
          <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-lg sm:p-7">
            <LocationSearch controller={controller} onSearch={onSearch} />

            {/* Shortcuts for the three ways people arrive at an area. Buy and Rent
                set the catalogue's own purpose filter; Invest has no matching
                filter, so it goes to an agent rather than pretending a stock
                filter exists. */}
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {locationSearchShortcuts.map((shortcut) => (
                <li key={shortcut.id}>
                  <Link
                    href={shortcut.href}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-sand-200 bg-sand-100 px-3.5 text-sm font-semibold text-ink-700 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700"
                  >
                    <Icon name={shortcut.icon} className="size-3.5 text-accent-500" strokeWidth={2} />
                    {shortcut.label}
                  </Link>
                </li>
              ))}
            </ul>

            {suggestions.length > 0 && (
              <div className="mt-5 border-t border-sand-200 pt-5">
                <h2 className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
                  Popular areas
                </h2>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.slug}>
                      <Link
                        href={locationPath(suggestion.slug)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-sand-200 bg-sand-100 px-3.5 text-sm font-semibold text-ink-700 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700"
                      >
                        <Icon name="map-pin" className="size-3.5 text-accent-500" strokeWidth={2} />
                        {suggestion.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
