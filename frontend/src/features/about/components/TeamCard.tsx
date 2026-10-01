import { BrandIcon } from '@/shared/components/ui/BrandIcon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { cn } from '@/shared/lib/cn'
import type { AboutTeamMember } from '@/features/about/types/aboutTypes'

interface TeamCardProps {
  member: AboutTeamMember
  className?: string
}

/**
 * A single team profile.
 *
 * The name is not a link: these placeholder profiles have no profile page, and
 * inventing one would only produce a dead route. Contact goes through the
 * company channels in the closing CTA instead, which is also what a real
 * deployment would do — an agent is a person to talk to, not a page to browse.
 *
 * The card renders whatever `socials` a record carries. Nothing is hard-coded,
 * so the real roster can link to an agent's own profile later without this
 * component changing.
 */
export function TeamCard({ member, className }: TeamCardProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white',
        'shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg',
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-tint-100">
        <SkeletonImage
          src={member.avatar.src}
          alt={member.avatar.alt}
          width={640}
          height={800}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-ink-900">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-accent-600">{member.role}</p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{member.description}</p>

        {member.focusAreas.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {member.focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-pill bg-sand-100 px-2.5 py-1 text-xs font-medium text-ink-600"
              >
                {area}
              </li>
            ))}
          </ul>
        )}

        {member.socials && member.socials.length > 0 && (
          <ul className="mt-5 flex items-center gap-2 border-t border-sand-200 pt-4">
            {member.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} on ${social.label} (opens in a new tab)`}
                  className="flex size-9 items-center justify-center rounded-pill border border-sand-200 text-ink-500 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700"
                >
                  <BrandIcon name={social.id} className="!size-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}