import { Icon } from '../ui/Icon'

interface PropertiesPageHeaderProps {
  title: string
  description: string
  /** Breadcrumb trail rendered above the heading. */
  eyebrow?: string
  className?: string
}

/**
 * Compact page header for the listing page.
 * Deliberately shorter than a hero so the search tool is reached quickly.
 */
export function PropertiesPageHeader({
  title,
  description,
  eyebrow = 'Properties',
  className,
}: PropertiesPageHeaderProps) {
  return (
    <div className={className}>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
          <li>
            <a href="/" className="transition-colors duration-200 hover:text-accent-700">
              Home
            </a>
          </li>
          <li aria-hidden>
            <Icon name="chevron-right" className="size-3.5" strokeWidth={2} />
          </li>
          <li className="text-ink-600" aria-current="page">
            Properties
          </li>
        </ol>
      </nav>

      <p className="mt-5 flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-600">
        <span className="h-px w-6 bg-accent-300" aria-hidden />
        {eyebrow}
      </p>

      <h1 className="mt-3 text-[length:clamp(1.875rem,3.6vw,2.75rem)] leading-[1.12] tracking-[-0.028em] text-ink-900">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-500">{description}</p>
    </div>
  )
}
