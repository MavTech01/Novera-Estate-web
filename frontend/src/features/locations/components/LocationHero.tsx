import { Link } from 'react-router-dom'
import { company } from '@/data/company'
import { locationSearchShortcuts } from '@/features/locations/data/locationOptions'
import { PageHero, type PageHeroTrustItem } from '@/shared/components/layout/PageHero'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import { locationPath } from '@/shared/lib/routes'
import type { LocationSearchController } from '@/features/locations/hooks/useLocationSearch'
import { LocationSearch } from './LocationSearch'

interface LocationHeroProps {
  controller: LocationSearchController
  /** Names offered as one-tap suggestions under the search field. */
  suggestions: { slug: string; name: string }[]
  /** Called when the search form is submitted, to bring the results into view. */
  onSearch: () => void
  /** Fill of the closing wave — match whichever section follows the hero. */
  wave?: 'white' | 'cream'
}

const locationTrust: readonly PageHeroTrustItem[] = [
  { id: 'inspected', icon: 'shield-check', label: 'Inspected before you view' },
  { id: 'visits', icon: 'calendar-search', label: 'Site visits available' },
  { id: 'areas', icon: 'map-pinned', label: 'Six areas across Lagos' },
]

/**
 * Locations page hero: the promise over a Lagos photograph, with the search
 * tool pulled up beneath so it reads as part of the banner rather than as a
 * separate widget.
 *
 * Kept deliberately short. The hero's job is to orient and to hand the visitor
 * to the search; the catalogue is the page, not the banner. The panel is a
 * sibling so it can overlap the banner's wave cleanly.
 */
export function LocationHero({ controller, suggestions, onSearch, wave }: LocationHeroProps) {
  return (
    <>
      <PageHero
        headingId="locations-hero-heading"
        eyebrow={company.descriptor}
        title="Find Your Place in Lagos"
        description="Discover properties and developments across some of Lagos's most sought-after areas."
        image={{
          src: '/images/hero/hero-main.webp',
          alt: 'Aerial view of Lagos showing residential districts, roads and the coastline',
        }}
        breadcrumbs={pageCrumbs({ label: 'Locations' })}
        trust={locationTrust}
        wave={wave}
      />

      {/*
        Sits over the banner's wave, but only just. The site convention elsewhere
        pulled these search panels up by 48px, which is too far for a panel this
        deep — its top edge sat level with the wave crest and the two white shapes
        merged into one. A smaller overlap keeps the "part of the banner" reading
        while leaving a clear band of white between the curve and the card.
      */}
      <div className="relative z-20 -mt-4 sm:-mt-5 lg:-mt-6">
        <Container>
          <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-xl sm:p-7">
            <LocationSearch controller={controller} onSearch={onSearch} />

            {/* Shortcuts for the three ways people arrive at an area. Buy and Rent
                set the catalogue's own purpose filter; Invest has no matching
                filter, so it goes to an agent rather than pretending a stock
                filter exists. */}
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {locationSearchShortcuts.map((shortcut) => (
                <li key={shortcut.id}>
                  <Link
                    to={shortcut.href}
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
                        to={locationPath(suggestion.slug)}
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
