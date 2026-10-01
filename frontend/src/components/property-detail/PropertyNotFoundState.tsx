import { routes } from '@/shared/lib/routes'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyNotFoundStateProps {
  /** The slug that was requested, quoted back so the visitor can spot a typo. */
  slug?: string
  className?: string
}

/**
 * Shown when no listing matches the requested slug.
 * Offers a way forward rather than a dead end: back to the full catalogue, or
 * home.
 */
export function PropertyNotFoundState({ slug, className }: PropertyNotFoundStateProps) {
  return (
    <div
      role="status"
      className={`mx-auto flex max-w-2xl flex-col items-center rounded-xl border border-sand-200 bg-white px-6 py-16 text-center shadow-sm sm:px-12 ${className ?? ''}`}
    >
      <span className="flex size-16 items-center justify-center rounded-pill bg-tint-50 text-accent-600">
        <Icon name="search" className="size-7" strokeWidth={1.75} />
      </span>

      <h1 className="mt-5 text-ink-900">Property Not Found</h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
        The property you’re looking for may have been removed or is no longer available.
      </p>

      {slug && (
        <p className="mt-3 max-w-md break-words text-sm text-ink-400">
          We could not find a listing for <span className="font-medium text-ink-600">/{slug}</span>.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={routes.properties} variant="primary" size="lg" withArrow>
          Browse Properties
        </ButtonLink>

        <ButtonLink href={routes.home} variant="outline" size="lg">
          <Icon name="arrow-left" className="size-4" strokeWidth={2.2} />
          Return Home
        </ButtonLink>
      </div>
    </div>
  )
}
