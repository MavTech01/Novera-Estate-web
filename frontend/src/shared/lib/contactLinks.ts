import type { Property } from '@/types'

/**
 * Contact and share link builders.
 *
 * Every outbound action on the property page (WhatsApp, call, email, share)
 * goes through this module, so swapping the demo contact details or moving to a
 * real messaging endpoint later is a one-file change.
 */

/** Strips formatting so numbers are valid inside `tel:` and `wa.me` links. */
function toDialable(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}

/** `tel:` link for the agent's listed number. */
export function buildCallUrl(phone: string): string {
  return `tel:${toDialable(phone)}`
}

/**
 * `wa.me` deep link with a pre-filled message.
 * The text is URI-encoded so apostrophes and punctuation survive the hand-off.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${toDialable(phone)}?text=${encodeURIComponent(message)}`
}

/** The headline value the visitor sees next to the WhatsApp button. */
export function buildWhatsAppLabel(): string {
  return 'Chat on WhatsApp'
}

/** Pre-filled enquiry message — mirrors the copy shown on the page. */
export function buildPropertyInquiry(property: Pick<Property, 'title' | 'location'>): string {
  return `Hello, I'm interested in the ${property.title} in ${property.location.label}. I would like to know more about this property.`
}

/** Pre-filled message used by the inspection-request buttons. */
export function buildInspectionMessage(property: Pick<Property, 'title' | 'location'>): string {
  return `Hello, I would like to schedule an inspection for the ${property.title} in ${property.location.label}. Please share the available dates.`
}

export interface ShareLinks {
  whatsapp: string
  facebook: string
  x: string
}

/** Third-party share targets for a property URL. */
export function buildShareLinks(url: string, title: string, text: string): ShareLinks {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  }
}
