import { useCallback, useEffect, useRef, useState } from 'react'

import { getTestimonials } from '@/data'
import { cn } from '@/shared/lib/cn'
import type { Testimonial } from '@/types'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Rating } from '@/shared/components/ui/Rating'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

function Author({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <span className={cn('flex items-center gap-3.5', className)}>
      <SkeletonImage
        src={testimonial.avatar.src}
        alt={testimonial.avatar.alt}
        width={56}
        height={56}
        className="size-12 shrink-0 rounded-pill sm:size-14"
        imgClassName="rounded-pill object-cover"
      />
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-ink-900 sm:text-base">{testimonial.name}</span>
        <span className="text-xs text-ink-500 sm:text-sm">
          {testimonial.role} · {testimonial.location}
        </span>
      </span>
    </span>
  )
}

const AUTO_ROTATE_INTERVAL = 5000

/** "What Our Clients Say" — auto-rotating carousel of client stories. */
export function Testimonials() {
  const testimonials = getTestimonials()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const count = testimonials.length

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count)
  }, [count])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (isPaused || count <= 1) return

    const timer = setInterval(() => {
      handleNext()
    }, AUTO_ROTATE_INTERVAL)

    return () => clearInterval(timer)
  }, [isPaused, count, handleNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX

      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          handleNext()
        } else {
          handlePrev()
        }
      }
      touchStartX.current = null
    }
    setIsPaused(false)
  }

  return (
    <Section id="testimonials" tone="warm">
      <Container>
        <SectionHeading
          eyebrow="Client stories"
          title="What Our Clients Say"
          description="A few words from the families, tenants and investors we have worked with."
          align="center"
        />

        <Reveal className="relative mx-auto mt-10 max-w-3xl sm:mt-12 2xl:max-w-4xl">
          <div
            className="group relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slides track */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full shrink-0">
                    <figure className="relative flex min-h-[280px] flex-col justify-between rounded-2xl border border-sand-200 bg-white p-6 shadow-sm transition-all duration-300 sm:min-h-[320px] sm:p-9 md:p-10">
                      <div className="absolute right-6 top-6 text-sand-300 sm:right-8 sm:top-8" aria-hidden>
                        <Icon name="quote" className="size-8 text-sand-300 opacity-60 sm:size-10" />
                      </div>

                      <div>
                        <Rating
                          value={testimonial.rating}
                          label={`${testimonial.rating} out of 5 from ${testimonial.name}`}
                        />
                        <blockquote className="mt-5 pr-8 sm:mt-6">
                          <p className="font-display text-base leading-relaxed text-ink-800 sm:text-lg md:text-xl">
                            “{testimonial.quote}”
                          </p>
                        </blockquote>
                      </div>

                      <figcaption className="mt-6 border-t border-sand-200 pt-5 sm:mt-8 sm:pt-6">
                        <Author testimonial={testimonial} />
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls: Prev/Next and Dots */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className={cn(
                  'inline-flex size-11 items-center justify-center rounded-pill border border-sand-200 bg-white text-ink-900 shadow-sm',
                  'transition-all duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                )}
              >
                <Icon name="chevron-left" className="size-5" strokeWidth={2} />
              </button>

              {/* Dots indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show testimonial ${index + 1} of ${count}`}
                    aria-current={index === activeIndex}
                    className={cn(
                      'h-2.5 rounded-pill transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                      index === activeIndex
                        ? 'w-7 bg-accent-600'
                        : 'w-2.5 bg-sand-300 hover:bg-accent-300',
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className={cn(
                  'inline-flex size-11 items-center justify-center rounded-pill border border-sand-200 bg-white text-ink-900 shadow-sm',
                  'transition-all duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                )}
              >
                <Icon name="chevron-right" className="size-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
