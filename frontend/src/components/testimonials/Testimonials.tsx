import { getTestimonials } from '@/data'
import { cn } from '@/shared/lib/cn'
import type { Testimonial } from '@/types'
import { Container } from '@/shared/components/ui/Container'
import { Rating } from '@/shared/components/ui/Rating'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

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

/** "What Our Clients Say" — equal testimonial cards in the standard section grid. */
export function Testimonials() {
  const testimonials = getTestimonials()

  return (
    <Section id="testimonials" tone="warm">
      <Container>
        <SectionHeading
          eyebrow="Client stories"
          title="What Our Clients Say"
          description="A few words from the families, tenants and investors we have worked with."
          align="center"
        />

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {testimonials.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.id} delay={index * 110} className="flex">
              <figure className="flex h-full w-full flex-col justify-between gap-5 rounded-xl border border-sand-200 bg-white p-6 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent-200 hover:shadow-md sm:p-7">
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
        </ul>
      </Container>
    </Section>
  )
}
