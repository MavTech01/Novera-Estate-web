/**
 * Public surface of the FAQ feature.
 *
 * A data-only feature for now: `/faq` is a list, so there is nothing to compose
 * beyond the questions themselves. The barrel exists anyway, so that adding a
 * search box or grouped categories later does not reach past this folder.
 */

export { faqItems } from './data/faqData'
