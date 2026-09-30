import {
  InspectionModal,
  MobilePropertyActions,
  PropertyBreadcrumb,
  PropertyContent,
  PropertyDetailCTA,
  PropertyDetailSidebar,
  PropertyDetailSkeleton,
  PropertyGallery,
  PropertyHeader,
  PropertyNotFoundState,
  PropertyOverview,
  SimilarProperties,
} from '../../components/property-detail'
import { PropertyErrorState } from '../../components/properties/PropertyErrorState'
import { Container } from '../../components/ui/Container'
import { getSimilarProperties } from '../../data'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useFavourites } from '../../hooks/useFavourites'
import { usePropertyDetail } from '../../hooks/usePropertyDetail'
import { getBreadcrumbItems, type BreadcrumbItem } from '../../lib/propertyDetails'
import { routes } from '../../lib/routes'

interface PropertyDetailsPageProps {
  /** Route param from `/properties/:slug`. */
  slug: string
}

/** Trail shown when the requested slug matches no listing. */
const notFoundTrail: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: routes.home },
  { id: 'properties', label: 'Properties', href: routes.properties },
  { id: 'not-found', label: 'Property Not Found' },
]

/**
 * Property detail page — `/properties/:slug`.
 *
 * The component only orchestrates: `usePropertyDetail` owns the request
 * lifecycle (loading, not-found, error, ready) and every visual decision is
 * delegated to a focused component that receives a plain `PropertyDetail`. Once
 * the Express API is live, only the hook's data source changes.
 */
export function PropertyDetailsPage({ slug }: PropertyDetailsPageProps) {
  const { status, property, retry } = usePropertyDetail(slug)
  const { isFavourite, toggleFavourite } = useFavourites()
  const inspection = useDisclosure()

  if (status === 'loading') {
    return (
      <main id="main-content" className="bg-white pb-24 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
        <Container>
          <PropertyDetailSkeleton />
        </Container>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main id="main-content" className="bg-white pb-24 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
        <Container>
          <PropertyErrorState
            message="We couldn't load this property right now. Please try again."
            onRetry={retry}
            className="mx-auto max-w-2xl"
          />
        </Container>
      </main>
    )
  }

  if (status === 'not-found' || !property) {
    return (
      <main id="main-content" className="bg-white pb-24 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
        <Container>
          <PropertyBreadcrumb items={notFoundTrail} className="mb-8" />
          <PropertyNotFoundState slug={slug} />
        </Container>
      </main>
    )
  }

  return (
    <>
      <main id="main-content" className="bg-white">
        {/* Identity band: trail, gallery and header */}
        <section className="pb-8 pt-28 sm:pt-32 lg:pt-36">
          <Container>
            <PropertyBreadcrumb items={getBreadcrumbItems(property)} className="mb-6" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10">
              <PropertyGallery images={property.gallery} propertyTitle={property.title} />

              <div className="min-w-0">
                <PropertyHeader
                  property={property}
                  isFavourite={isFavourite(property.id)}
                  onToggleFavourite={() => toggleFavourite(property.id)}
                />
              </div>
            </div>

            <PropertyOverview property={property} className="mt-10 lg:mt-12" />
          </Container>
        </section>

        {/* Reading column plus contact rail. The sidebar comes first in the DOM
            so it lands directly under the overview on mobile, and is moved
            second on desktop with `lg:order-2`. */}
        <section className="pb-16 sm:pb-20">
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10 xl:gap-12">
              <div className="min-w-0 lg:order-2">
                <PropertyDetailSidebar property={property} onRequestInspection={inspection.open} />
              </div>

              <div className="min-w-0 lg:order-1">
                <PropertyContent property={property} />
              </div>
            </div>
          </Container>
        </section>

        <SimilarProperties
          properties={getSimilarProperties(property)}
          isFavourite={isFavourite}
          onToggleFavourite={toggleFavourite}
        />

        <PropertyDetailCTA />
      </main>

      {/* Persistent actions for phones; steps aside over the footer. */}
      <MobilePropertyActions property={property} onRequestInspection={inspection.open} />

      <InspectionModal isOpen={inspection.isOpen} onClose={inspection.close} property={property} />
    </>
  )
}
