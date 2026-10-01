import { useEffect } from 'react'

/**
 * Sets the document title for as long as the component is mounted.
 *
 * With no meta-tag management in place this is what keeps a deep link honest:
 * a property, a section and an unknown address each say what they are instead
 * of all claiming to be the homepage.
 *
 * `null` means "someone else owns this title" — a parent resolving the route
 * cannot know what a property is called, so it hands off rather than racing the
 * page that does.
 */
export function useDocumentTitle(title: string | null): void {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}