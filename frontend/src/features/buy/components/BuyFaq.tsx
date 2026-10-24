import { GoodToKnowSection } from '@/shared/components/ui/GoodToKnowSection'
import type { BuyFaqItem } from '@/features/buy/types/buy.types'

interface BuyFaqProps {
  items: readonly BuyFaqItem[]
}

/**
 * Buying FAQ — questions buyers ask us.
 */
export function BuyFaq({ items }: BuyFaqProps) {
  return (
    <GoodToKnowSection
      idPrefix="buy-faq"
      title="Questions Buyers Ask Us"
      description="Straight answers about property purchases, inspections, documentation, and handover."
      items={items}
    />
  )
}
