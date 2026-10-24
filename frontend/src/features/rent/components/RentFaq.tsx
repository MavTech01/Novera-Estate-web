import { GoodToKnowSection } from '@/shared/components/ui/GoodToKnowSection'
import type { RentFaqItem } from '@/features/rent/types/rent.types'

interface RentFaqProps {
  items: readonly RentFaqItem[]
}

/**
 * Renting FAQ — questions renters ask us.
 */
export function RentFaq({ items }: RentFaqProps) {
  return (
    <GoodToKnowSection
      idPrefix="rent-faq"
      title="Questions Renters Ask Us"
      description="Straight answers about property searches, viewings, inspections, and tenancy costs."
      items={items}
    />
  )
}
