import type { NavigationGroup } from '@/types'

interface FooterLinkColumnsProps {
  groups: NavigationGroup[]
  className?: string
}

/** Renders the footer's link columns from data. */
export function FooterLinkColumns({ groups, className }: FooterLinkColumnsProps) {
  return (
    <div className={className}>
      {groups.map((group) => (
        <nav key={group.id} aria-label={group.title}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">{group.title}</h3>

          <ul className="mt-4 flex flex-col gap-2.5">
            {group.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-8 items-center text-sm text-sand-300 transition-colors duration-200 hover:text-accent-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  )
}
