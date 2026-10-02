/**
 * Public surface of the Contact feature.
 *
 * The page in `pages/Contact` and `routeManifest` import from here, so the internals
 * of the feature — its form rules, service and editorial data — can be reorganised
 * without any change outside this folder.
 */

export { ContactInfoCards } from './components/ContactInfoCards'
export { ContactQuickActions } from './components/ContactQuickActions'
export { ContactEnquiryForm } from './components/ContactEnquiryForm'
export { ContactMapPlaceholder } from './components/ContactMapPlaceholder'
export { ContactFaqPreview } from './components/ContactFaqPreview'
export { ContactFinalCta } from './components/ContactFinalCta'

export {
  CONTACT_HERO_IMAGE,
  contactChannels,
  contactEnquiryWhatsAppMessage,
  contactFaq,
  contactQuickActions,
  createEmptyContactEnquiry,
  defaultSubjectFor,
  enquiryTypeLabel,
  enquiryTypes,
  parseEnquiryType,
} from './data/contactData'

export { submitContactEnquiry } from './services/contactService'

export { enquiryTypeFromQuery, useContactEnquiry } from './hooks/useContactEnquiry'

export { toContactEnquiryPayload, validateContactEnquiry } from './utils/contactForm'

export type {
  ContactChannel,
  ContactEnquiry,
  ContactEnquiryErrors,
  ContactEnquiryPayload,
  ContactEnquiryReceipt,
  ContactFaqItem,
  ContactQuickAction,
  EnquiryType,
} from './types/contact.types'
