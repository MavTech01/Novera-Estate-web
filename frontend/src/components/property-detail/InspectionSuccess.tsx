import { formatDate } from '../../lib/format'
import { inspectionTimeOptions } from '../../lib/inspectionForm'
import type { InspectionReceipt } from '../../data/inspectionRepository'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

interface InspectionSuccessProps {
  receipt: InspectionReceipt
  onClose: () => void
  /** Sends the visitor straight into a WhatsApp conversation to confirm. */
  onWhatsApp: () => void
}

/** Confirmation shown after a valid request, replacing the form in place. */
export function InspectionSuccess({ receipt, onClose, onWhatsApp }: InspectionSuccessProps) {
  const timeLabel =
    inspectionTimeOptions.find((option) => option.value === receipt.preferredTime)?.label ?? receipt.preferredTime

  return (
    <div role="status" className="flex flex-col items-center py-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-pill bg-success-100 text-success-600">
        <Icon name="check" className="size-8" strokeWidth={2.2} />
      </span>

      <h3 className="mt-5 font-display text-xl text-ink-900">Inspection Request Received</h3>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600">
        Thank you. A Novera Estates representative will contact you to confirm your inspection.
      </p>

      <dl className="mt-6 w-full max-w-sm overflow-hidden rounded-md border border-sand-200 text-left">
        <div className="flex items-baseline justify-between gap-4 border-b border-sand-200 px-4 py-3">
          <dt className="text-sm text-ink-500">Reference</dt>
          <dd className="text-sm font-semibold text-ink-900">{receipt.reference}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-sand-200 px-4 py-3">
          <dt className="text-sm text-ink-500">Property</dt>
          <dd className="truncate text-sm font-semibold text-ink-900">{receipt.propertyTitle}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-sand-200 px-4 py-3">
          <dt className="text-sm text-ink-500">Preferred date</dt>
          <dd className="text-sm font-semibold text-ink-900">{formatDate(receipt.preferredDate)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 px-4 py-3">
          <dt className="text-sm text-ink-500">Preferred time</dt>
          <dd className="text-right text-sm font-semibold text-ink-900">{timeLabel}</dd>
        </div>
      </dl>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5">
        <Button size="lg" className="w-full" onClick={onWhatsApp}>
          Confirm on WhatsApp
        </Button>
        <Button variant="ghost" size="md" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
