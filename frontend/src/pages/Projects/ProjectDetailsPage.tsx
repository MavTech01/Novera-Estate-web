import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  ProjectAmenities,
  ProjectContactCta,
  ProjectConsultantCard,
  ProjectDescription,
  ProjectDetailsSkeleton,
  ProjectDetailHero,
  ProjectDetailSidebar,
  ProjectDocumentation,
  ProjectFeatures,
  ProjectGallery,
  ProjectInspectionForm,
  ProjectLocation,
  ProjectLocationHighlights,
  ProjectMobileContactBar,
  ProjectOverview,
  ProjectRelatedProperties,
  ProjectUnitTypes,
  useProject,
} from '@/features/projects'
import { Button, ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Section } from '@/shared/components/ui/Section'
import { routes } from '@/shared/lib/routes'

/**
 * Project detail page — `/projects/:slug`.
 *
 * A thin composition of the feature's own sections, in the order a buyer actually
 * reads them: orient, look, then evaluate — overview, description, unit types,
 * amenities, features, location, documentation — before the two decisions:
 * inspect and enquire.
 *
 * The page holds no project data of its own. It calls `useProject`, which goes
 * through the service seam, so replacing the mock with `GET /api/projects/:slug`
 * touches nothing in this file.
 */
export function ProjectDetailsPage() {
  const { slug = '' } = useParams()
  const { project, status, error, retry } = useProject(slug)

  // Keep the tab title in step with what is actually on screen, and hand it back on
  // the way out so the next page does not inherit this one. The "not found" and
  // failed states get their own titles rather than leaving the default site title
  // on a page that is neither the project nor the home page.
  useEffect(() => {
    const previous = document.title

    if (status === 'loading') document.title = 'Loading project | Novera Estates'
    else if (status === 'error') document.title = 'Project unavailable | Novera Estates'
    else if (!project) document.title = 'Project not found | Novera Estates'
    else document.title = `${project.name} | Novera Estates`

    return () => {
      document.title = previous
    }
  }, [project, status])

  if (status === 'error') return <ProjectLoadError message={error} onRetry={retry} />

  if (!project) {
    return status === 'loading' ? <ProjectDetailsSkeleton /> : <ProjectNotFound />
  }

  return (
    <>
      {/*
        Bottom clearance for the fixed contact bar, which is 56px plus any
        safe-area inset. The bar is hidden from `lg` up, so the desktop page gets
        its normal rhythm back. Without this the bar sat on top of the closing
        section and clipped it.
      */}
      <main id="main-content" className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <ProjectDetailHero project={project} />

        {/*
          The gallery is the one block that reads as a single unit, so it goes
          straight after the hero at the page's own rhythm and shares the 1200px
          container with everything below it. It used to render with no container
          at all, which is why it ran edge to edge while every other section had
          a gutter.
        */}
        <Section tone="white" spacing="none" className="pt-8 lg:pt-10">
          <Container>
            <ProjectGallery project={project} />
          </Container>
        </Section>

        {/*
          The reading column and the summary column. `space-y` rather than each
          section carrying its own vertical rhythm, so the 56px / 96px gap between
          blocks is decided once instead of per section.

          The column order is content-then-sidebar in the DOM, which is the right
          order for reading and for a screen reader. The sidebar is not reordered
          visually: on desktop it sits to the right of the same grid row, so there
          is nothing to reorder.
        */}
        <div className="bg-white pb-14 lg:pb-20">
          <Container>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="space-y-6 lg:col-span-8 lg:space-y-8 xl:col-span-9">
                <ProjectOverview project={project} contained />

                <ProjectDescription project={project} />

                <ProjectFeatures project={project} contained />

                <ProjectLocation project={project} contained />
              </div>

              <ProjectDetailSidebar project={project} />
            </div>
          </Container>
        </div>

        <ProjectUnitTypes project={project} />

        <ProjectAmenities project={project} />

        <ProjectLocationHighlights project={project} />

        <ProjectDocumentation project={project} />

        <Section tone="white" spacing="tight">
          <Container>
            <ProjectConsultantCard project={project} className="mx-auto max-w-lg" />
          </Container>
        </Section>

        {/* Anchored so the sticky mobile bar yields once the form is on screen. */}
        <div id="project-inspection">
          <ProjectInspectionForm project={project} />
        </div>

        <ProjectRelatedProperties project={project} />

        <ProjectContactCta project={project} />
      </main>

      <ProjectMobileContactBar project={project} />
    </>
  )
}

/** Request failed — distinct from "no such project", and worth offering a retry. */
function ProjectLoadError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <main id="main-content">
      <section className="bg-white pb-24 pt-32 sm:pt-36">
        <Container>
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-xl border border-sand-200 bg-white px-6 py-16 text-center shadow-sm"
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-pill bg-tint-50 text-accent-600">
              <Icon name="triangle-alert" className="size-7" strokeWidth={1.75} />
            </span>

            <h1 className="mt-5 font-display text-2xl text-ink-900">We couldn't load this project</h1>

            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {message ?? 'Something went wrong while loading this development.'}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={onRetry} withArrow>
                Try Again
              </Button>

              <ButtonLink href={routes.projects} variant="outline">
                Back to Developments
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

/** A slug that resolves to nothing — renamed, removed, or never real. */
function ProjectNotFound() {
  return (
    <main id="main-content">
      <section className="bg-white pb-24 pt-32 sm:pt-36">
        <Container>
          <div className="mx-auto max-w-lg rounded-xl border border-dashed border-sand-300 bg-tint-50 px-6 py-16 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-pill bg-white text-accent-500 shadow-sm">
              <Icon name="search" className="size-7" strokeWidth={1.75} />
            </span>

            <h1 className="mt-5 font-display text-2xl text-ink-900">Project Not Found</h1>

            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              We couldn't find a development matching that address. It may have been renamed, or it may not
              have been published yet.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={routes.projects} withArrow>
                Browse All Developments
              </ButtonLink>

              <ButtonLink href={routes.contact} variant="outline">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
