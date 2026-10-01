import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'

/**
 * The honesty bar.
 *
 * Every count, price and listing on this page comes from the demo catalogue, so
 * the page says so above the fold rather than burying it in the FAQ — a buyer
 * acting on a sample price deserves to know it is one immediately.
 */
export function BuyDemoNotice() {
  return (
    <Container>
      <Reveal>
        <p className="mt-8 flex items-start gap-3 rounded-xl border border-sand-200 bg-tint-50 px-5 py-4 text-sm leading-relaxed text-ink-600">
          <Icon name="badge-check" className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
          <span>
            <strong className="font-semibold text-ink-900">Demonstration experience.</strong> Every
            listing, price and count on this page is sample data, not live inventory — the layout,
            search and filters are all real, but nothing here is a real offer. Contact our team for
            the properties currently available.
          </span>
        </p>
      </Reveal>
    </Container>
  )
}