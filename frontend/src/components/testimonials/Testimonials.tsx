import { getTestimonials } from '../../data'
import { cn } from '../../lib/cn'
import type { Testimonial } from '../../types'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Rating } from '../ui/Rating'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { SkeletonImage } from '../ui/SkeletonImage'

function Author({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <SkeletonImage
        src={testimonial.avatar.src}
        alt={testimonial.avatar.alt}
        width={52}
        height={52}
        className="size-12 shrink-0 rounded-pill"
        imgClassName="rounded-pill object-cover"
      />
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-ink-900">{testimonial.name}</span>
        <span className="text-xs text-ink-500">
          {testimonial.role} · {testimonial.location}
        </span>
      </span>
    </span>
  )
}

/** "What Our Clients Say" — one featured quote with supporting testimonials. */
export function Testimonials() {
  const testimonials = getTestimonials()
  const [featured, ...supporting] = testimonials

  if (!featured) return null

  return (
    <Section id="testimonials" tone="warm">
      <Container>
        <SectionHeading
          eyebrow="Client stories"
          title="What Our Clients Say"
          description="A few words from the families, tenants and investors we have worked with."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
          {/* Featured quote */}
          <Reveal className="lg:col-span-7">
            <figure className="flex h-full flex-col justify-between gap-8 rounded-2xl bg-ink-700 p-8 text-white sm:p-10">
              <div>
                <Icon name="quote" className="size-10 text-accent-500" strokeWidth={1.5} />
                <blockquote className="mt-6">
                  <p className="font-display text-xl leading-relaxed tracking-[-0.01em] sm:text-2xl">
                    “{featured.quote}”
                  </p>
                </blockquote>
              </div>

              <figcaption className="flex flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Author testimonial={featured} />
                <Rating
                  value={featured.rating}
                  label={`${featured.rating} out of 5 from ${featured.name}`}
                />
              </figcaption>
            </figure>
          </Reveal>

          {/* Supporting quotes */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {supporting.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 110} className="flex-1">
                <figure className="flex h-full flex-col justify-between gap-5 rounded-xl border border-sand-200 bg-white p-6 transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent-200 hover:shadow-md sm:p-7">
                  <div>
                    <Rating
                      value={testimonial.rating}
                      label={`${testimonial.rating} out of 5 from ${testimonial.name}`}
                    />
                    <blockquote className="mt-4">
                      <p className="text-[0.9375rem] leading-relaxed text-ink-600">{testimonial.quote}</p>
                    </blockquote>
                  </div>

                  <figcaption className="border-t border-sand-200 pt-5">
                    <Author testimonial={testimonial} />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
