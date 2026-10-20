import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/cn'
import type { IconName, ImageAsset } from '@/types'
import { useHeroParallax } from '@/shared/hooks/useHeroParallax'
import { Breadcrumbs, type BreadcrumbItem } from '@/shared/components/ui/Breadcrumbs'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { WaveDivider } from './WaveDivider'

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

export interface PageHeroTrustItem {
  id: string
  icon: IconName
  label: string
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
  /** A small reassurance row under the actions (icon + short label each). */
  trust?: readonly PageHeroTrustItem[]
  /** Overrides the heading id when a page needs a more specific hook. */
  headingId?: string
  /**
   * Fill of the wave at the base. Match the background of the section that
   * follows so the two read as one surface. `none` drops the wave entirely.
   */
  wave?: 'white' | 'cream' | 'none'
  className?: string
}

const delay = (ms: number) => ({ '--hero-delay': `${ms}ms` }) as CSSProperties

/**
 * The banner that opens every inner page.
 *
 * One full-width photograph (drifting slowly on scroll), a scrim that runs dark
 * on the left to light on the right, and the copy held left-aligned at a
 * comfortable measure. It animates in on load rather than on scroll: the words
 * of the title rise and un-blur one after another, the eyebrow rule draws
 * itself, and the supporting copy fades up — all of it one-shot and disabled
 * under `prefers-reduced-motion`. A `WaveDivider` then dissolves the banner
 * into the next section.
 */
export function PageHero({
  title,
  description,
  eyebrow,
  image,
  breadcrumbs,
  actions,
  trust,
  headingId = 'page-hero-heading',
  wave = 'white',
  className,
}: PageHeroProps) {
  const parallaxRef = useHeroParallax<HTMLDivElement>()
  const titleWords = title.split(' ')

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'relative isolate flex flex-col overflow-hidden bg-ink-700',
        'min-h-[clamp(34rem,72vh,40rem)]',
        className,
      )}
    >
      {/* Photograph (parallax) plus a faint film grain, both behind the copy. */}
      <div className="hero-grain absolute inset-0 -z-20 overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-x-0 -top-[14%] h-[128%] will-change-transform">
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
      </div>

      {/* Left-to-right scrim: darkest behind the copy, lightest at the right edge. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#140e0a]/85 via-[#140e0a]/60 to-[#140e0a]/25"
      />
      {/* Soft vignette that settles the top and bottom edges. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(130%_120%_at_18%_45%,transparent_45%,rgba(20,14,10,0.5)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#140e0a]/40 to-transparent"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-white/10" />

      <Container className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-24">
        <div className="flex w-full max-w-[45rem] flex-col gap-6 2xl:max-w-[54rem]">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="hero-fade" style={delay(0)}>
              <Breadcrumbs items={[...breadcrumbs]} tone="onBrown" />
            </div>
          )}

          {eyebrow && (
            <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-400">
              <span aria-hidden className="hero-line h-px w-6 bg-accent-400/60" style={delay(60)} />
              <span className="hero-fade" style={delay(140)}>
                {eyebrow}
              </span>
            </p>
          )}

          <h1
            id={headingId}
            className="max-w-[45rem] text-[length:clamp(2.5rem,4.4vw,4rem)] font-bold leading-[1.1] text-white 2xl:max-w-[54rem]"
          >
            {titleWords.map((word, index) => (
              <span key={`${word}-${index}`}>
                <span className="hero-word" style={delay(180 + index * 45)}>
                  {word}
                </span>
                {index < titleWords.length - 1 ? ' ' : null}
              </span>
            ))}
          </h1>

          {description && (
            <p className="hero-fade max-w-[35rem] text-lg leading-relaxed text-white/85 2xl:max-w-[42rem]" style={delay(480)}>
              {description}
            </p>
          )}

          {actions && actions.length > 0 && (
            <div className="hero-fade mt-1 flex flex-col gap-4 sm:flex-row" style={delay(580)}>
              {actions.map((action) => {
                const isPrimary = (action.variant ?? 'primary') === 'primary'

                return (
                  <ButtonLink
                    key={`${action.label}-${action.href}`}
                    href={action.href}
                    variant={action.variant ?? 'primary'}
                    size="lg"
                    target={action.target}
                    rel={action.rel}
                    className={cn(
                      'group relative h-12 w-full justify-center text-base transition-transform duration-300 hover:-translate-y-0.5 sm:h-13 sm:w-auto',
                      isPrimary && 'hero-cta',
                    )}
                  >
                    {action.icon && <Icon name={action.icon} className="size-4" strokeWidth={2} />}
                    {action.label}
                    {action.withArrow && (
                      <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
                    )}
                  </ButtonLink>
                )
              })}
            </div>
          )}

          {trust && trust.length > 0 && (
            <ul
              className="hero-fade mt-2 flex flex-col gap-3 text-sm font-medium text-white/85 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0"
              style={delay(680)}
            >
              {trust.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 sm:border-l sm:border-white/20 sm:px-6 sm:first:border-l-0 sm:first:pl-0"
                >
                  <Icon name={item.icon} className="size-4 text-accent-400" strokeWidth={2} />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      {wave !== 'none' && <WaveDivider color={wave === 'cream' ? 'cream' : 'white'} className="relative z-0" />}
    </section>
  )
}
