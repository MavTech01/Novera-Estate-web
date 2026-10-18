import { Link } from 'react-router-dom'
import { formatDate } from '@/shared/lib/format'
import type { Article } from '@/types'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Badge } from '@/shared/components/ui/Badge'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

interface ArticleCardProps {
  article: Article
}

/** Standard editorial card for the insights section. */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-tint-100">
        <SkeletonImage
          src={article.image.src}
          alt={article.image.alt}
          width={900}
          height={620}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="softOrange">{article.category}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-500">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden className="size-1 rounded-full bg-sand-300" />
          <span>{article.readTimeMinutes} min read</span>
        </p>

        <h3 className="mt-3 font-display text-xl leading-snug text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <Link to={`/insights/${article.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {article.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{article.excerpt}</p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-sand-200 pt-4">
          <span className="text-xs font-medium text-ink-500">By {article.author}</span>
          <ArrowLink href={`/insights/${article.slug}`}>Read Article</ArrowLink>
        </div>
      </div>
    </article>
  )
}
