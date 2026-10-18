import { createBrowserRouter } from 'react-router-dom'

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
import { RouteNoticePage } from '@/pages/RouteNoticePage'
import { routes } from '@/shared/lib/routes'
import { AppShell } from './AppShell'
import { loaders, revalidateOnPathChange } from './loaders'

/**
 * The route table.
 *
 * This is the single answer to "where does this URL live?" — every path, the
 * component that renders it, the data it needs before it may be shown, and the
 * document title it owns.
 *
 * Every route that loads data also declares `shouldRevalidate`, so refining a
 * filter or changing the sort updates the grid without re-warming data the page
 * is already reading. See `revalidateOnPathChange`.
 *
 * `handle.title` is read back by `<RouteTitle />`. A `null` title means the page
 * owns it: the two detail pages know the property's or development's own name
 * and set it themselves once the record resolves, so the router hands off rather
 * than racing them.
 *
 * Sections that exist in the navigation but have no page yet are declared as real
 * routes rather than special-cased in a resolver, so a new section is one line
 * here whether or not it has a page.
 */

const SITE_NAME = company.name

export const router = createBrowserRouter([
  {
    // Root layout: the navbar, footer and route effects that surround every page.
    element: <AppShell />,
    children: [
      {
        path: routes.home,
        // The homepage is assembled from local data and its hero is preloaded in
        // index.html, so it is ready the moment the bundle runs.
        loader: loaders.none,
        shouldRevalidate: revalidateOnPathChange,
        element: <HomePage />,
        handle: { title: `${SITE_NAME} — Lagos Homes, Land & Investment Property` },
      },
      {
        path: routes.properties,
        loader: loaders.listing,
        shouldRevalidate: revalidateOnPathChange,
        element: <PropertiesPage />,
        handle: { title: `Properties for Sale & Rent in Lagos — ${SITE_NAME}` },
      },
      {
        path: routes.propertyDetail,
        loader: loaders.propertyDetail,
        shouldRevalidate: revalidateOnPathChange,
        element: <PropertyDetailsPage />,
        handle: { title: null },
      },
      {
        path: routes.buy,
        loader: loaders.buy,
        shouldRevalidate: revalidateOnPathChange,
        element: <BuyPage />,
        handle: { title: `Buy Property in Lagos — ${SITE_NAME}` },
      },
      {
        path: routes.rent,
        loader: loaders.rent,
        shouldRevalidate: revalidateOnPathChange,
        element: <RentPage />,
        handle: { title: `Rent Property in Lagos — ${SITE_NAME}` },
      },
      {
        path: routes.projects,
        loader: loaders.projectListing,
        shouldRevalidate: revalidateOnPathChange,
        element: <ProjectsPage />,
        handle: { title: `Developments in Lagos — ${SITE_NAME}` },
      },
      {
        path: routes.projectDetail,
        loader: loaders.projectDetail,
        shouldRevalidate: revalidateOnPathChange,
        element: <ProjectDetailsPage />,
        handle: { title: null },
      },
      {
        path: routes.locations,
        loader: loaders.locationListing,
        shouldRevalidate: revalidateOnPathChange,
        element: <LocationsPage />,
        handle: { title: `Prime Locations in Lagos — ${SITE_NAME}` },
      },
      {
        path: routes.locationDetail,
        element: (
          <RouteNoticePage
            variant="planned"
            title="Location"
            description="Full area guides — accessibility, schools, healthcare, amenities and every development we hold in each part of Lagos — are on the way."
          />
        ),
        handle: { title: `Location — ${SITE_NAME}` },
      },
      {
        path: routes.about,
        loader: loaders.about,
        shouldRevalidate: revalidateOnPathChange,
        element: <AboutPage />,
        handle: { title: `About Novera Estates — ${SITE_NAME}` },
      },
      {
        path: '/services',
        element: (
          <RouteNoticePage
            variant="planned"
            title="Services"
            description="Sales, rentals, land and investment advisory are all handled in person. Talk to an agent about what you are looking for."
          />
        ),
        handle: { title: `Services — ${SITE_NAME}` },
      },
      {
        path: routes.services,
        element: (
          <RouteNoticePage
            variant="planned"
            title="Services"
            description="Sales, rentals, land and investment advisory are all handled in person. Talk to an agent about what you are looking for."
          />
        ),
        handle: { title: `Services — ${SITE_NAME}` },
      },
      {
        path: '/insights',
        element: (
          <RouteNoticePage
            variant="planned"
            title="Market Insights"
            description="Our full market insights, property guides, and Lagos real estate trends will be available here soon."
          />
        ),
        handle: { title: `Market Insights — ${SITE_NAME}` },
      },
      {
        path: '/insights/:slug',
        element: (
          <RouteNoticePage
            variant="planned"
            title="Market Insights"
            description="Our full market insights, property guides, and Lagos real estate trends will be available here soon."
          />
        ),
        handle: { title: `Market Insights — ${SITE_NAME}` },
      },
      {
        path: routes.bookInspection,
        element: (
          <RouteNoticePage
            variant="planned"
            title="Book an Inspection"
            description="Online inspection scheduling is on the way. In the meantime our office is open Monday to Saturday and we answer every enquiry within one working day."
          />
        ),
        handle: { title: `Book an Inspection — ${SITE_NAME}` },
      },
      {
        path: routes.contact,
        loader: loaders.contact,
        shouldRevalidate: revalidateOnPathChange,
        element: <ContactPage />,
        handle: { title: `Contact Novera Estates — Lagos Office & Enquiries` },
      },
      {
        path: routes.faq,
        loader: loaders.faq,
        shouldRevalidate: revalidateOnPathChange,
        element: <FaqPage />,
        handle: { title: `Frequently Asked Questions — ${SITE_NAME}` },
      },
      {
        path: '*',
        element: <RouteNoticePage variant="missing" />,
        handle: { title: `Page Not Found — ${SITE_NAME}` },
      },
    ],
  },
])
