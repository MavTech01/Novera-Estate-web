import type { IconName } from './icons'

export interface NavigationLink {
  label: string
  href: string
  /** Distinguishes the primary nav from utility/footer links. */
  variant?: 'default' | 'accent'
  /** Small icon shown beside the label inside a dropdown panel. */
  icon?: IconName
  /** One-line supporting copy shown under the label inside a dropdown panel. */
  description?: string
}

/**
 * A primary-navigation entry that opens a dropdown panel.
 *
 * The trigger is always a button — even when the group also has a landing page
 * in `href` — so the panel can be opened by pointer, keyboard and assistive
 * technology without the link itself navigating away.
 */
export interface NavigationMenu {
  label: string
  /** Optional landing page offered as the first item and in the mobile list. */
  href?: string
  items: NavigationLink[]
}

/** A top-level navigation row: either a plain link or a dropdown. */
export type NavigationEntry = NavigationLink | NavigationMenu

export interface NavigationGroup {
  id: string
  title: string
  links: NavigationLink[]
}
