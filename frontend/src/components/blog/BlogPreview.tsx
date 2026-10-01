import { getArticles } from '@/data'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { ArticleCard } from './ArticleCard'

/** "Real Estate Insights" — editorial preview, ready to be driven by a CMS/API. */
export function BlogPreview() {
  const articles = getArticles(3)

  return (
    <Section id="insights" tone="white" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Insights"
          title="Real Estate Insights"
          description="Practical guidance on buying, renting and investing in Nigerian property."
          action={
            <ArrowLink href="/insights" size="md">
              View all insights
            </ArrowLink>
          }
        />

        <ul className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal as="li" key={article.id} delay={(index % 3) * 110} className="flex">
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
