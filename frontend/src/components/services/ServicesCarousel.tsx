import { useCallback, useEffect, useRef, useState } from 'react'

import { getServices } from '../../data'
import { cn } from '../../lib/cn'
import type { Service } from '../../types'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { SkeletonImage } from '../ui/SkeletonImage'

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-tint-100">
        <SkeletonImage
          src={service.image.src}
          alt={service.image.alt}
          width={800}
          height={600}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />
        <span className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-pill bg-accent-600 text-white shadow-md">
          <Icon name={service.icon} className="size-5" strokeWidth={1.75} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-600">
          {service.caption}
        </p>
        <h3 className="mt-2 font-display text-xl text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <a href={service.href} className="after:absolute after:inset-0 after:content-['']">
            {service.title}
          </a>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">{service.description}</p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          Learn More
          <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
        </span>
      </div>
    </article>
  )
}

/** "Our Services" — horizontally swipeable rail with buttons and dots. */
export function ServicesCarousel() {
  const services = getServices()
  const railRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const syncScrollState = useCallback(() => {
    const rail = railRef.current
    if (!rail) return

    const maxScroll = rail.scrollWidth - rail.clientWidth
    setCanScrollLeft(rail.scrollLeft > 8)
    setCanScrollRight(rail.scrollLeft < maxScroll - 8)

    const card = rail.firstElementChild as HTMLElement | null
    if (!card) return

    const step = card.getBoundingClientRect().width + 24
    setActiveIndex(Math.round(rail.scrollLeft / step))
  }, [])

  useEffect(() => {
    syncScrollState()

    const rail = railRef.current
    if (!rail) return

    rail.addEventListener('scroll', syncScrollState, { passive: true })
    window.addEventListener('resize', syncScrollState)
    return () => {
      rail.removeEventListener('scroll', syncScrollState)
      window.removeEventListener('resize', syncScrollState)
    }
  }, [syncScrollState])

  const scrollByCard = (direction: -1 | 1) => {
    const rail = railRef.current
    if (!rail) return

    const card = rail.firstElementChild as HTMLElement | null
    const step = card ? card.getBoundingClientRect().width + 24 : rail.clientWidth
    rail.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  const scrollToIndex = (index: number) => {
    const rail = railRef.current
    const card = rail?.firstElementChild as HTMLElement | undefined
    if (!rail || !card) return

    const step = card.getBoundingClientRect().width + 24
    rail.scrollTo({ left: step * index, behavior: 'smooth' })
  }

  return (
    <Section id="services" tone="white" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Our Services"
          description="Sales, rentals, land and investment support under one roof."
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous services"
                className={cn(
                  'inline-flex size-12 items-center justify-center rounded-pill border border-sand-200 bg-white text-ink-900',
                  'transition-all duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
                  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-sand-200 disabled:hover:bg-white disabled:hover:text-ink-900',
                )}
              >
                <Icon name="chevron-left" className="size-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canScrollRight}
                aria-label="Next services"
                className={cn(
                  'inline-flex size-12 items-center justify-center rounded-pill border border-sand-200 bg-white text-ink-900',
                  'transition-all duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
                  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-sand-200 disabled:hover:bg-white disabled:hover:text-ink-900',
                )}
              >
                <Icon name="chevron-right" className="size-5" strokeWidth={2} />
              </button>
            </div>
          }
        />

        <Reveal className="mt-10 lg:mt-12">
          <ul
            ref={railRef}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 py-2 scroll-px-5 sm:-mx-6 sm:px-6 sm:scroll-px-6 lg:-mx-8 lg:px-8 lg:scroll-px-8"
            aria-label="Services"
          >
            {services.map((service) => (
              <li
                key={service.id}
                className="w-[82%] shrink-0 snap-start last:snap-end sm:w-[46%] lg:w-[calc((100%-4.5rem)/3)]"
              >
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Pagination dots double as jump targets on small screens. */}
        <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
          {services.map((service, index) => (
            <button
              key={service.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Show ${service.title}`}
              aria-current={index === activeIndex}
              className={cn(
                'h-2.5 rounded-pill transition-all duration-300',
                index === activeIndex ? 'w-7 bg-accent-600' : 'w-2.5 bg-sand-300 hover:bg-accent-300',
              )}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
