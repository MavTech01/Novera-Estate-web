import { cn } from '@/shared/lib/cn'
import type { IconName, ImageAsset } from '@/types'
import { Breadcrumbs, type BreadcrumbItem } from '@/shared/components/ui/Breadcrumbs'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { Icon } from '@/shared/components/ui/Icon'

/** Button variants that stay legible on the banner's dark overlay. */
type PageHeroActionVariant = 'primary' | 'outline' | 'white'

export interface PageHeroAction {
  label: string
  href: string
  /** Defaults to `primary`; `white` and `outline` are the alternatives that read on dark. */
  variant?: PageHeroActionVariant
  withArrow?: boolean
  icon?: IconName
  target?: string
  rel?: string
}

export interface PageHeroProps {
  title: string
  description?: string
  /** Small uppercase line above the title, e.g. the section or a place name. */
  eyebrow?: string
  /** Full-width banner photograph, dimmed by the overlay so text stays readable. */
  image: ImageAsset
  /** Trail from the homepage; build it with `pageCrumbs`. */
  breadcrumbs?: readonly BreadcrumbItem[]
  /** Optional calls to action. The first should be the primary one. */
  actions?: readonly PageHeroAction[]
  /**
   * Where the copy sits on desktop. Mobile always stacks left-aligned, since
   * right-aligned body copy is harder to read on a narrow screen.
   */
  align?: 'right' | 'left'
  /** `compact` for pages whose first tool sits immediately below the banner. */
  size?: 'default' | 'compact'
  /**
   * Content pulled up over the lower edge of the banner — a search panel, for
   * example. Only one page uses the slot, but it is what keeps every hero on the
   * site one component instead of a shared banner with two bespoke copies.
   */
  children?: React.ReactNode
  /** A small reassurance row under the actions (icons + short labels). */
  meta?: React.ReactNode
  /** Overrides the heading id when a page needs a more specific hook. */
  headingId?: string
  className?: string
}

const contentMinHeight: Record<NonNullable<PageHeroProps['size']>, string> = {
  default: 'min-h-[clamp(22rem,46vh,30rem)]',
  compact: 'min-h-[clamp(18rem,36vh,24rem)]',
}

/**
 * The banner that opens every inner page.
 *
 * One full-width photograph, a directional scrim, and the page title set in the
 * display type — deliberately not a plain title block. `align="right"` mirrors
 * the composition toward the right on desktop, matching the flow of the site,
 * while the photograph and the scrim carry the atmosphere.
 *
 * The photograph settles into place on load via `.hero-settle` (a single
 * transform, disabled under `prefers-reduced-motion`). Copy is not revealed on
 * scroll: the banner is above the fold on arrival, so delaying it would only
 * make the visitor wait for what they came for.
 */
export function PageHero({
  title,
  description,
  eyebrow,
  image,
  breadcrumbs,
  actions,
  align = 'right',
  size = 'default',
  children,
  meta,
  headingId = 'page-hero-heading',
  className,
}: PageHeroProps) {
  const alignsRight = align === 'right'

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'relative isolate flex flex-col justify-end overflow-hidden bg-ink-700',
        // Clears the fixed navbar; the closing padding is the banner's own.
        'pt-28 sm:pt-32 lg:pt-36',
        children ? 'pb-0' : 'pb-14 sm:pb-16 lg:pb-20',
        contentMinHeight[size],
        className,
      )}
    >
      {/* Photograph and scrim, both behind the copy. */}
      <div className="absolute inset-0 -z-20">
        <SkeletonImage
          src={image.src}
          alt={image.alt}
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="size-full"
          imgClassName="hero-settle"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-900/55" />
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10',
          alignsRight
            ? 'bg-gradient-to-l from-ink-900/90 via-ink-900/50 to-ink-900/25'
            : 'bg-gradient-to-r from-ink-900/90 via-ink-900/50 to-ink-900/25',
        )}
      />
      {/* Deepens the bottom edge so the copy holds on small screens. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink-900/80 via-ink-900/25 to-transparent"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-white/10" />

      <Container
        className={cn(
          'relative z-10 flex w-full flex-1 items-end',
          children ? 'pb-28 sm:pb-32' : undefined,
        )}
      >
        <div
          className={cn(
            'flex w-full flex-col gap-5',
            alignsRight ? 'lg:ml-auto lg:max-w-2xl lg:items-end lg:text-right' : 'lg:mr-auto lg:max-w-2xl',
          )}
        >
          {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={[...breadcrumbs]} tone="onBrown" />}

          {eyebrow && (
            <p
              className={cn(
                'flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300',
                alignsRight && 'lg:justify-end',
              )}
            >
              <span aria-hidden className="h-px w-6 bg-accent-300/60" />
              {eyebrow}
            </p>
          )}

          <h1 id={headingId} className="text-white">
            {title}
          </h1>

          {description && (
            <p className="text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
          )}

          {actions && actions.length > 0 && (
            <div className={cn('mt-1 flex flex-col gap-3 sm:flex-row', alignsRight && 'lg:justify-end')}>
              {actions.map((action) => (
                <ButtonLink
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  variant={action.variant ?? 'primary'}
                  size="lg"
                  withArrow={action.withArrow}
                  target={action.target}
                  rel={action.rel}
                >
                  {action.icon && <Icon name={action.icon} className="size-4" strokeWidth={2} />}
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          )}

          {meta && (
            <div
              className={cn(
                'mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/75',
                alignsRight && 'lg:justify-end',
              )}
            >
              {meta}
            </div>
          )}
        </div>
      </Container>

      {children && <Container className="relative z-10 -mt-28 sm:-mt-32">{children}</Container>}
    </section>
  )
}
