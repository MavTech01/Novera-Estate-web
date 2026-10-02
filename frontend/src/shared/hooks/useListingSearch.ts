import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  buildListingSearchHref,
  emptyListingSearch,
  findListingSearchProblem,
  hasListingSearch,
  parseListingSearch,
  serialiseListingSearch,
  type ListingSearchArea,
  type ListingSearchCriteria,
} from '@/shared/lib/propertySearchQuery'
import type { PropertyPurpose } from '@/types'

/**
 * The engine behind the Buy and Rent search panels.
 *
 * The address bar is the shareable form of a visitor's search, the same way it is
 * on `/properties`: `useSearchParams` is reactive, so a shared
 * `/rent?location=lekki&bedrooms=4` link and the browser back button are the same
 * event as a change in the panel. Nothing mirrors the criteria into component
 * state.
 *
 * Changes are written with `replace`, so a tweak never floods the back button.
 *
 * One deliberate wrinkle: the area list arrives asynchronously from the catalogue,
 * and an area is only recognisable by the catalogue slugs behind it. So this hook
 * does not touch the URL until the areas are known — otherwise it would read a
 * shared link as "no area" and overwrite it with an empty search before the areas
 * loaded.
 *
 * Buy and Rent differ in exactly two things, both passed in rather than branched
 * on: which listing purpose a submission targets, and the word that page uses for
 * money. Everything else is shared.
 */
export interface ListingSearchConfig {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly ListingSearchArea[]
  /** The listing purpose this panel searches, e.g. `'buy'` or `'rent'`. */
  purpose: PropertyPurpose
  /** How this page names money: `'price'` when buying, `'rent'` when renting. */
  priceNoun: string
}

export interface ListingSearchController {
  criteria: ListingSearchCriteria
  /** True when at least one field differs from the unfiltered state. */
  isFiltered: boolean
  /** False when the panel holds a minimum above its maximum. */
  isValid: boolean
  /** Message shown when `isValid` is false. */
  validationMessage: string | null
  update: <K extends keyof ListingSearchCriteria>(key: K, value: ListingSearchCriteria[K]) => void
  /** Sends the visitor to the listing page with these filters applied. */
  submit: () => void
  reset: () => void
}

export function useListingSearch({
  areas,
  purpose,
  priceNoun,
}: ListingSearchConfig): ListingSearchController {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const areAreasKnown = areas.length > 0

  // Derived, never mirrored. Before the areas arrive the area in the URL is
  // deliberately left unreadable — `parseListingSearch` would see no catalogue to
  // match against and report "any" — and the tidying effect below waits for the
  // areas so it cannot rewrite the deep link in the meantime.
  const criteria = useMemo(() => parseListingSearch(searchParams, areas), [searchParams, areas])

  /** Writes a change back to the URL, seeing the criteria as they are now. */
  const commit = useCallback(
    (recipe: (current: ListingSearchCriteria) => ListingSearchCriteria) => {
      setSearchParams((current) => {
        const next = recipe(parseListingSearch(current, areas))

        return hasListingSearch(next) ? serialiseListingSearch(next, areas) : new URLSearchParams()
      }, { replace: true })
    },
    [setSearchParams, areas],
  )

  // Tidies a hand-typed or legacy link once on arrival, but only once the areas
  // are known: until then the URL is the only record of a deep link this hook
  // cannot yet read, and rewriting it would destroy it.
  useEffect(() => {
    if (!areAreasKnown) return

    const canonical = hasListingSearch(criteria)
      ? serialiseListingSearch(criteria, areas)
      : new URLSearchParams()
    if (canonical.toString() !== searchParams.toString()) setSearchParams(canonical, { replace: true })
  }, [criteria, areas, areAreasKnown, searchParams, setSearchParams])

  const update = useCallback(
    <K extends keyof ListingSearchCriteria>(key: K, value: ListingSearchCriteria[K]) =>
      commit((current) => ({ ...current, [key]: value })),
    [commit],
  )

  const reset = useCallback(() => commit(() => emptyListingSearch), [commit])

  const submit = useCallback(() => {
    navigate(buildListingSearchHref(criteria, areas, purpose))
  }, [criteria, areas, purpose, navigate])

  const { isFiltered, isValid, validationMessage } = useMemo(() => {
    const problem = findListingSearchProblem(criteria, priceNoun)

    return { isFiltered: hasListingSearch(criteria), validationMessage: problem, isValid: problem === null }
  }, [criteria, priceNoun])

  return {
    criteria,
    isFiltered,
    isValid,
    validationMessage,
    update,
    submit,
    reset,
  }
}
