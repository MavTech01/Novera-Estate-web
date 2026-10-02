import { Link } from 'react-router-dom'

import { isInternalHref } from '@/shared/lib/href'

interface SmartLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  /** React 19 passes `ref` as a normal prop, so it is declared explicitly here. */
  ref?: React.Ref<HTMLAnchorElement>
}

/**
 * A link that navigates within the app when it can, and defers to the browser
 * when it cannot.
 *
 * `Button`, `ArrowLink` and `Breadcrumbs` all take an `href` and do not know or
 * care where it points: the same `ButtonLink` renders a route change beside
 * "View all properties" and a `tel:` tap in the footer. Rather than push that
 * decision onto every call site, it is made once, here, from the href itself.
 *
 * The split is the only thing this adds. In-app URLs are handed to React Router
 * so a route change is a client-side swap; everything else — `mailto:`, `tel:`,
 * WhatsApp, a social profile, a full `https://` URL — is a native anchor, which
 * is the only thing that can actually open a mail client or dial a number.
 *
 * React Router's own click handling already leaves alone everything the browser
 * is better at: middle clicks, ⌘/ctrl/shift/alt clicks, and `target="_blank"` all
 * fall through untouched, so "open in new tab" keeps working.
 */
export function SmartLink({ href, target, ref, ...rest }: SmartLinkProps) {
  if (!isInternalHref(href)) {
    return (
      <a
        ref={ref}
        href={href}
        target={target}
        // Without this, a new tab gets a live handle on `window.opener`.
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        {...rest}
      />
    )
  }

  return <Link ref={ref} to={href} target={target} {...rest} />
}
