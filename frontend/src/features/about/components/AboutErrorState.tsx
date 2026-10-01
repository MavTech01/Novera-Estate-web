import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Section } from '@/shared/components/ui/Section'

interface AboutErrorStateProps {
  message: string
  onRetry: () => void
}

/**
 * Shown when the About content request fails.
 *
 * Retry rather than a dead end: this is the one section of the page that cannot
 * be rendered from anywhere else, and the rest of the site stays reachable from
 * the navigation above.
 */
export function AboutErrorState({ message, onRetry }: AboutErrorStateProps) {
  return (
    <Section tone="white">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-sand-200 bg-sand-100 p-10 text-center sm:p-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-pill bg-white text-accent-600 shadow-xs">
            <Icon name="triangle-alert" className="size-6" strokeWidth={2} />
          </span>

          <h1 className="mt-6 font-display text-2xl text-ink-900">This Page Is Temporarily Unavailable</h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-500">{message}</p>

          <Button onClick={onRetry} size="md" className="mt-7">
            <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
            Try Again
          </Button>
        </div>
      </Container>
    </Section>
  )
}