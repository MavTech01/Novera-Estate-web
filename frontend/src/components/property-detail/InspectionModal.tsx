import { useCallback, useState } from 'react'

import { submitInspectionRequest, type InspectionReceipt } from '../../data/inspectionRepository'
import { buildInspectionMessage, buildWhatsAppUrl } from '../../lib/contactLinks'
import type { InspectionRequestPayload, PropertyDetail } from '../../types'
import { Modal } from '../ui/Modal'
import { InspectionForm } from './InspectionForm'
import { InspectionSuccess } from './InspectionSuccess'

interface InspectionModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyDetail
}

/**
 * Inspection booking dialog.
 * Owns the request lifecycle so the trigger buttons elsewhere on the page only
 * need to call `open` — the form, the pending state and the confirmation are
 * all contained here.
 */
export function InspectionModal({ isOpen, onClose, property }: InspectionModalProps) {
  const [receipt, setReceipt] = useState<InspectionReceipt | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const close = useCallback(() => {
    onClose()
  }, [onClose])

  // Reopening always starts a fresh request rather than showing the last
  // confirmation, which could belong to a different visit.
  const handleClose = useCallback(() => {
    setReceipt(null)
    close()
  }, [close])

  const handleSubmit = useCallback(
    async (values: InspectionRequestPayload) => {
      setIsSubmitting(true)
      try {
        setReceipt(await submitInspectionRequest(values))
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  const handleWhatsApp = useCallback(() => {
    const href = buildWhatsAppUrl(
      property.agent.phone,
      buildInspectionMessage(property) +
        (receipt ? `\n\nMy inspection reference is ${receipt.reference}.` : ''),
    )

    window.open(href, '_blank', 'noopener,noreferrer')
  }, [property, receipt])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule an Inspection"
      description="Tell us when suits you and an agent will confirm."
      size="lg"
    >
      {receipt ? (
        <InspectionSuccess receipt={receipt} onClose={handleClose} onWhatsApp={handleWhatsApp} />
      ) : (
        <InspectionForm property={property} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </Modal>
  )
}
