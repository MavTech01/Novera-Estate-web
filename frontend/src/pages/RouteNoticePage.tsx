import { useLocation } from 'react-router-dom'

import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { ButtonLink } from '@/shared/components/ui/Button'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import { company } from '@/data'
import { buildCallUrl, buildWhatsAppUrl } from '@/shared/lib/contactLinks'
import { routes } from '@/shared/lib/routes'

interface RouteNoticePageProps {
  /**
   * `planned` — a section that exists in the navigation but has no page yet.
   * `missing` — an address that matches nothing at all.
   */
  variant: 'planned' | 'missing'
  /** The section heading, e.g. "Projects". */
  title?: string
  description?: string
}

/**
 * Stand-in for a route that has no page.
 *
 * This replaced a fallback that rendered the homepage. That was wrong in a way
 * that is easy to miss: the visitor saw content that had nothing to do with the
 * address, and the page shipped the homepage's title and metadata, so every
 * unfinished URL looked like a duplicate of the homepage to a search engine.
 *
 * A planned section still gets its own name and its own title, so when the page
 * lands nothing has to be untangled. It also gets the same banner as every other
 * inner page, so an unfinished section is recognisably part of the site.
 */
export function RouteNoticePage({ variant, title, description }: RouteNoticePageProps) {
  const isPlanned = variant === 'planned'
  const heading = isPlanned ? (title ?? 'Coming Soon') : 'Page Not Found'

  // The unmatched address, echoed back so a mistyped URL is obvious. Read from
  // the router rather than passed in, so every catch-all route gets it for free.
  const { pathname } = useLocation()

  const heroDescription = isPlanned
    ? (description ??
      'This section is on the way. In the meantime, browse the properties already available or speak to the team.')
    : (description ??
      'This address does not match anything on the site. It may have moved, or the link may be mistyped.')

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <PageHero
        eyebrow={isPlanned ? 'Coming soon' : 'Page not found'}
        title={heading}
        description={heroDescription}
        image={{
          src: '/images/development/oasis-main.webp',
          alt: 'Exterior view of The Oasis Residences development in Lekki, Lagos',
        }}
        breadcrumbs={pageCrumbs({ label: heading })}
      />

      <section className="bg-white pb-24 pt-16 sm:pt-20 lg:pb-28 lg:pt-24">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center rounded-xl border border-sand-200 bg-white px-6 py-16 text-center shadow-sm sm:px-12">
            <span className="flex size-16 items-center justify-center rounded-pill bg-tint-50 text-accent-600">
              <Icon name={isPlanned ? 'sparkles' : 'search'} className="size-7" strokeWidth={1.75} />
            </span>

            {pathname && !isPlanned ? (
              <p className="mt-5 max-w-md break-words text-sm text-ink-500">
                Nothing is published at <span className="font-medium text-ink-600">{pathname}</span>.
              </p>
            ) : (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-500">
                {isPlanned
                  ? 'Browse the properties already available while this page is being built.'
                  : 'Try the address again, or start from the catalogue below.'}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={routes.properties} variant="primary" size="lg" withArrow>
                Browse Properties
              </ButtonLink>

              <ButtonLink
                href={buildWhatsAppUrl(
                  company.phone,
                  'Hello, I would like to know more about your properties.',
                )}
                target="_blank"
                rel="noreferrer noopener"
                variant="outline"
                size="lg"
              >
                Ask on WhatsApp
              </ButtonLink>
            </div>

            <p className="mt-6 text-sm text-ink-400">
              or call{' '}
              <a href={buildCallUrl(company.phone)} className="font-semibold text-accent-700 hover:underline">
                {company.phone}
              </a>
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
