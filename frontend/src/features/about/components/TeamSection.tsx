import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { findNotice } from '@/features/about/hooks/useAboutData'
import type { AboutNotice, AboutTeamMember } from '@/features/about/types/aboutTypes'
import { TeamCard } from './TeamCard'

interface TeamSectionProps {
  team: AboutTeamMember[]
  notices: AboutNotice[]
}

/** The id the team placeholder disclosure is filed under. */
const TEAM_NOTICE_ID = 'team-placeholder'

/**
 * "Meet the People Behind Novera Estates".
 *
 * The notice above the grid is not decoration and must not be removed: this is
 * a demonstration build, the profiles are placeholders, and presenting invented
 * people as staff would be the single most misleading thing on the page. The
 * notice is returned by the service alongside the roster, so replacing the data
 * with the real `agents` records drops it without touching this component.
 */
export function TeamSection({ team, notices }: TeamSectionProps) {
  const notice = findNotice(notices, TEAM_NOTICE_ID)
  const showNotice = team.some((member) => member.isDemo) && Boolean(notice)

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Our team"
          title="Meet the People Behind Novera Estates"
          description="Every enquiry is handled by a person, from the first search through to the inspection and the paperwork after it."
        />

        {showNotice && notice && (
          <p className="mt-8 flex items-start gap-2.5 rounded-md border border-sand-200 bg-sand-100 px-4 py-3 text-xs leading-relaxed text-ink-600">
            <Icon name={notice.icon} className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
            <span>{notice.message}</span>
          </p>
        )}

        {team.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {team.map((member, index) => (
              <li key={member.id} className="flex">
                <Reveal delay={(index % 3) * 90} className="flex w-full">
                  <TeamCard member={member} className="w-full" />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 rounded-xl border border-dashed border-sand-300 bg-sand-100 p-10 text-center text-sm text-ink-500">
            Team profiles will be published here shortly. In the meantime, our agents are available to talk
            through what you are looking for.
          </p>
        )}
      </Container>
    </Section>
  )
}