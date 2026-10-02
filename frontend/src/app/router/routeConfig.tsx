import type { ReactNode } from 'react'

import { company } from '@/data/company'
import { AboutPage } from '@/pages/About/AboutPage'
import { BuyPage } from '@/pages/Buy/BuyPage'
import { ContactPage } from '@/pages/Contact/ContactPage'
import { FaqPage } from '@/pages/Faq/FaqPage'
import { HomePage } from '@/pages/HomePage'
import { LocationsPage } from '@/pages/Locations/LocationsPage'
import { PropertiesPage } from '@/pages/Properties/PropertiesPage'
import { PropertyDetailsPage } from '@/pages/Properties/PropertyDetailsPage'
import { ProjectsPage } from '@/pages/Projects/ProjectsPage'
import { ProjectDetailsPage } from '@/pages/Projects/ProjectDetailsPage'
import { RentPage } from '@/pages/Rent/RentPage'
import { routes } from '@/shared/lib/routes'

/** Document titles end in the site name, which `company` already defines. */
const SITE_NAME = company.name

/**
 * The `routes` keys that `routeManifest` marks `ready` and that therefore have
 * to resolve to a real page.
 *
 * Expressing this as a union of `typeof routes.x` rather than `string` is what
 * makes `routeConfig` exhaustive at compile time: marking a route `ready`
 * without registering a page for it is a type error, not a blank screen found in
 * production.
 */
export type ReadyRoutePattern =
  | typeof routes.home
  | typeof routes.properties
  | typeof routes.propertyDetail
  | typeof routes.buy
  | typeof routes.rent
  | typeof routes.projects
  | typeof routes.projectDetail
  | typeof routes.locations
  | typeof routes.about
  | typeof routes.contact
  | typeof routes.faq

export interface RoutePageEntry {
  /**
   * `null` hands the title to the page itself. The detail pages know the
   * property's or development's own name, and a title set here would overwrite
   * the one the page sets once its record resolves.
   */
  title: string | null
  render: (params: Record<string, string>) => ReactNode
}

/**
 * What each ready route renders, keyed by the manifest's own pattern.
 *
 * This is the only place a URL is connected to a component. The manifest stays
 * the single source of truth for *which* routes exist and what they load; this
 * table only adds the view, so the two cannot drift into separate route lists.
 */
export const routeConfig = {
  [routes.home]: {
    title: `${SITE_NAME} — Lagos Homes, Land & Investment Property`,
    render: () => <HomePage />,
  },
  [routes.properties]: {
    title: `Properties for Sale & Rent in Lagos — ${SITE_NAME}`,
    render: () => <PropertiesPage />,
  },
  [routes.propertyDetail]: {
    title: null,
    render: (params) => <PropertyDetailsPage slug={params.slug} />,
  },
  [routes.buy]: {
    title: `Buy Property in Lagos — ${SITE_NAME}`,
    render: () => <BuyPage />,
  },
  [routes.rent]: {
    title: `Rent Property in Lagos — ${SITE_NAME}`,
    render: () => <RentPage />,
  },
  [routes.projects]: {
    title: `Developments in Lagos — ${SITE_NAME}`,
    render: () => <ProjectsPage />,
  },
  [routes.projectDetail]: {
    // The page sets this from the development's name once loaded.
    title: null,
    render: (params) => <ProjectDetailsPage slug={params.slug} />,
  },
  [routes.locations]: {
    title: `Prime Locations in Lagos — ${SITE_NAME}`,
    render: () => <LocationsPage />,
  },
  [routes.about]: {
    title: `About Novera Estates — ${SITE_NAME}`,
    render: () => <AboutPage />,
  },
  [routes.contact]: {
    title: `Contact Novera Estates — Lagos Office & Enquiries`,
    render: () => <ContactPage />,
  },
  [routes.faq]: {
    title: `Frequently Asked Questions — ${SITE_NAME}`,
    render: () => <FaqPage />,
  },
} satisfies Record<ReadyRoutePattern, RoutePageEntry>

/**
 * Looks a ready route's page up by pattern.
 *
 * The cast is deliberate: `satisfies` above already proves every ready pattern
 * is covered, so an absent entry can only mean a manifest pattern that does not
 * match a key here. Callers must handle `undefined` rather than trust the table.
 */
export function getRouteEntry(pattern: string): RoutePageEntry | undefined {
  return (routeConfig as Record<string, RoutePageEntry | undefined>)[pattern]
}
