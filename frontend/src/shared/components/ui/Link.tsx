import { isInternalHref } from '@/shared/lib/router'
import { navigate } from '@/shared/hooks/useRouter'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** React 19 passes `ref` as a normal prop, so it is declared explicitly here. */
  ref?: React.Ref<HTMLAnchorElement>
}

/**
 * Anchor that navigates without a full page reload for in-app URLs.
 *
 * Modified clicks, middle clicks and `target="_blank"` fall through to native
 * browser behaviour, so "open in new tab" and external links keep working.
 */
export function Link({ href, onClick, target, ref, children, ...rest }: LinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (target === '_blank') return
    if (!isInternalHref(href)) return

    event.preventDefault()
    navigate(href)
  }

  return (
    <a ref={ref} href={href} target={target} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
