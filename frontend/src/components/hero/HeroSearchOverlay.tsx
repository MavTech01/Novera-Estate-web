import type { PropertySearchCriteria } from '../../types'
import { PropertySearch } from '../properties/PropertySearch'
import { Container } from '../ui/Container'

interface HeroSearchOverlayProps {
  criteria: PropertySearchCriteria
  onChange: <K extends keyof PropertySearchCriteria>(
    key: K,
    value: PropertySearchCriteria[K],
  ) => void
  onSubmit: () => void
}

/**
 * Pulls the search tool up into the hero on desktop and lets it sit in the
 * normal flow on small screens where the hero is already stacked.
 */
export function HeroSearchOverlay({ criteria, onChange, onSubmit }: HeroSearchOverlayProps) {
  return (
    <div className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28">
      <Container>
        <PropertySearch criteria={criteria} onChange={onChange} onSubmit={onSubmit} />
      </Container>
    </div>
  )
}
