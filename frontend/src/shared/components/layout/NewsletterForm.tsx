import { useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'

/**
 * Newsletter sign-up.
 * Client-side only for now — the form posts to `/api/newsletter` when the
 * Express backend is introduced.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!email.trim()) return
        setIsSubscribed(true)
        setEmail('')
      }}
      aria-label="Subscribe to the Novera Estates newsletter"
    >
      <label
        htmlFor="newsletter-email"
        className="block text-xs font-semibold uppercase tracking-[0.14em] text-sand-300"
      >
        Property newsletter
      </label>

      <div className="mt-3 flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 p-1.5 focus-within:border-accent-400">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-sand-400/70 focus:outline-none"
        />
        <button
          type="submit"
          className={cn(
            'inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-accent-600 text-white',
            'transition-colors duration-200 hover:bg-accent-500',
          )}
        >
          <span className="sr-only">Subscribe</span>
          <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
        </button>
      </div>

      <p className="mt-2.5 text-xs text-sand-400" role="status">
        {isSubscribed ? 'Thank you — you are on the list.' : 'New listings and market updates, once a month.'}
      </p>
    </form>
  )
}
