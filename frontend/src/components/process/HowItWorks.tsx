import { getProcessSteps } from '../../data'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Stepper } from '../ui/Stepper'

/** "A Simple Path to Your Property" — the three-step client journey. */
export function HowItWorks() {
  const steps = getProcessSteps()

  return (
    <Section id="how-it-works" tone="warm" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="A Simple Path to Your Property"
          description="Three straightforward steps, with a Novera Estates agent beside you at each one."
          align="center"
        />

        <Stepper steps={steps} ariaLabel="How to buy or rent with Novera Estates" className="mt-12 lg:mt-16" />
      </Container>
    </Section>
  )
}
