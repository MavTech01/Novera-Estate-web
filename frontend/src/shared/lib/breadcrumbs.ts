import type { BreadcrumbItem } from '@/shared/components/ui/Breadcrumbs'
import { routes } from './routes'

/**
 * A breadcrumb trail that always starts at the homepage.
 *
 * Every inner page opens with the same "Home / …" prefix, so it is prepended
 * here once instead of being repeated at each call site. The final item is the
 * current page and is passed without an `href`; `Breadcrumbs` renders it as
 * plain text with `aria-current="page"`.
 */
export function pageCrumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ label: 'Home', href: routes.home }, ...items]
}
