import type { InspectionRequestPayload } from '../types'

/**
 * Inspection request submission.
 *
 * The single seam for the enquiry form: it already returns the same data the
 * `POST /api/inspections` endpoint will produce, so the modal and form above it
 * do not change when the backend is introduced.
 *
 * Validation still runs on the client — the server will re-check everything
 * once it exists.
 */
const MOCK_LATENCY_MS = 500

export interface InspectionReceipt {
  /** Reference returned to the visitor, e.g. "INS-4F82A". */
  reference: string
  /** Preferred slot echoed back for the confirmation message. */
  preferredDate: string
  preferredTime: string
  propertyTitle: string
}

function createReference(): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `INS-${suffix}`
}

export async function submitInspectionRequest(
  payload: InspectionRequestPayload,
): Promise<InspectionReceipt> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

  return {
    reference: createReference(),
    preferredDate: payload.preferredDate,
    preferredTime: payload.preferredTime,
    propertyTitle: payload.propertyTitle,
  }
}
