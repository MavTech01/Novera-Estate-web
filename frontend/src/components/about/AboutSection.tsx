import { company, getStats } from '@/data'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

const promises = [
  'Every listing inspected before it is published',
  'Title and survey documents verified up front',
  'One consultant from viewing to handover',
]

/** "Find Out More About Us" — company story with supporting proof points. */
export function AboutSection() {
  const stats = getStats()

  return (
    <Section id="about" tone="warm" className="scroll-mt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Media */}
          <Reveal className="relative order-2 lg:order-1">
            <div
              aria-hidden
              className="blob-orange absolute -bottom-6 -left-6 hidden h-48 w-48 rounded-[2.5rem] opacity-30 sm:block"
            />
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
              <SkeletonImage
                src="/images/locations/lekki.webp"
                alt="Novera Estates residential listing in Lekki, Lagos"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full"
              />
            </div>

            <div className="relative z-10 mt-4 flex flex-wrap gap-4 sm:absolute sm:-bottom-8 sm:right-6 sm:mt-0 sm:w-max sm:flex-col sm:gap-3">
              {stats.slice(0, 2).map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-md"
                >
                  <span className="font-display text-2xl font-bold leading-none text-accent-600">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="max-w-[9rem] text-xs font-semibold leading-snug text-ink-600">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About Novera Estates"
              title="Find Out More About Us"
              description={company.description}
            />

            <ul className="mt-8 flex flex-col gap-3.5">
              {promises.map((promise) => (
                <li key={promise} className="flex items-start gap-3 text-[0.9375rem] text-ink-600">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                    <Icon name="badge-check" className="size-3.5" strokeWidth={2.2} />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/#contact" variant="primary" size="lg" withArrow>
                Talk to a Consultant
              </ButtonLink>
              <span className="flex items-center gap-2 text-sm text-ink-500">
                <Icon name="clock" className="size-4 text-accent-500" strokeWidth={2} />
                {company.hours}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
