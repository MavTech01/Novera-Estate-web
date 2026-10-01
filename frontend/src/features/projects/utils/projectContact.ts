import { routes } from '@/shared/lib/routes'
import type { Project } from '@/features/projects/types/projectTypes'

/**
 * Builds the `wa.me` link for a project enquiry.
 *
 * Two separate links exist on a project page and they must not collide:
 *
 *  - `whatsappHref` — the consultant's number, for "Talk to a consultant".
 *  - `projectWhatsAppHref` — the same channel, but with the project name already
 *    in the draft so the visitor does not have to describe what they clicked.
 *
 * ⚠️ The demo catalogue points at `+234 000…` placeholder numbers, which are not
 * reachable WhatsApp accounts. Swapping in real numbers is a one-line change in
 * `../data/projectConsultants` — nothing here needs to know.
 *
 * The text is URL-encoded because it contains spaces and apostrophes, and sent
 * as `text=` so WhatsApp pre-fills a message rather than a link preview.
 */

/** "Hello, I would like to learn more about Novera Heights and available units." */
export function projectEnquiryMessage(project: Project): string {
  return `Hello, I would like to learn more about ${project.name} and available units.`
}

/** A wa.me link for the consultant, carrying the project enquiry message. */
export function projectWhatsAppHref(project: Project): string {
  return buildWhatsAppHref(project.consultant.whatsappHref, projectEnquiryMessage(project))
}

/** A wa.me link for any number — also used by the footer and mobile bar. */
export function buildWhatsAppHref(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, '')

  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`
}

/**
 * Internal link to the inspection form for this project, carrying it in the query
 * string so the form can pre-select the right development when it mounts.
 *
 * This is what the "Request Details" buttons point at — a visitor asking about
 * one configuration lands on the form already scoped to the project rather than
 * having to pick it again.
 */
export function projectInquiryHref(project: Project): string {
  return `${routes.contact}?type=inspection&project=${project.slug}`
}

/** "Book an Inspection" for this project. */
export function projectInspectionHref(project: Project): string {
  return projectInquiryHref(project)
}

/** The subset of the inspection form this module needs to describe a request. */
export interface ProjectInspectionDetails {
  fullName: string
  phone: string
  email: string
  preferredDate: string
  preferredTime: string
  message: string
}

/**
 * Turns the inspection form into a structured, readable message.
 *
 * The form has no backend in this phase, so rather than silently discarding what
 * the visitor typed, the success state offers to hand it to WhatsApp. The output
 * is deliberately plain text with labelled lines: it is meant to be pasted into
 * a message a person reads, and to become the body of the future
 * `POST /api/inspections` payload without having to be reformatted.
 */
export function buildProjectInspectionMessage(
  project: Project,
  details: ProjectInspectionDetails,
): string {
  const lines = [
    `Project inspection request — ${project.name}`,
    `Location: ${project.location}`,
    '',
    `Name: ${details.fullName}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Preferred date: ${details.preferredDate}`,
    `Preferred time: ${details.preferredTime}`,
  ]

  if (details.message.trim()) {
    lines.push('', `Notes: ${details.message.trim()}`)
  }

  return lines.join('\n')
}

/**
 * WhatsApp link carrying the completed inspection request.
 *
 * This is the local-only form's real outcome: the visitor can send their own
 * details straight to the consultant without the message being lost.
 */
export function projectInspectionWhatsAppHref(
  project: Project,
  details: ProjectInspectionDetails,
): string {
  return buildWhatsAppHref(project.consultant.whatsappHref, buildProjectInspectionMessage(project, details))
}

/** `tel:` link for the consultant, so mobile dials directly. */
export function projectConsultantTelHref(project: Project): string {
  return `tel:${project.consultant.phoneHref}`
}
