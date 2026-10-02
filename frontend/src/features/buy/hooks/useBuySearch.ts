import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  buildBuySearchHref,
  emptyBuySearch,
  findBuySearchProblem,
  hasBuySearch,
  parseBuySearch,
  serialiseBuySearch,
} from '@/features/buy/utils/buyQuery'
import type {
  BuyLocation,
  BuySearchController,
  BuySearchCriteria,
} from '@/features/buy/types/buy.types'

/**
 * Owns the Buy page search panel's criteria and keeps the URL in sync.
 *
 * The address bar is the shareable form of the visitor's search, the same way it
 * is on `/properties`: `useSearchParams` is reactive, so a shared
 * `/buy?location=lekki&bedrooms=4` link and the browser back button are the same
 * event as a change in the panel. Nothing mirrors the criteria into component
 * state.
 *
 * Changes are written with `replace`, so a tweak never floods the back button.
 *
 * One deliberate wrinkle: the area list arrives asynchronously from the
 * catalogue, and an area is only recognisable by the catalogue slugs behind it.
 * So the panel does not touch the URL until the areas are known — otherwise it
 * would overwrite a deep link with an empty search before the areas loaded.
 */
export function useBuySearch(areas: readonly BuyLocation[]): BuySearchController {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const areAreasKnown = areas.length > 0

  // Derived, never mirrored. Before the areas arrive the URL is deliberately left
  // unreadable here — `parseBuySearch` would see no catalogue to match against and
  // report an empty search — and the tidying effect below waits for the areas so
  // it cannot rewrite the deep link in the meantime.
  const criteria = useMemo(() => parseBuySearch(searchParams, areas), [searchParams, areas])

  /** Writes a change back to the URL, seeing the criteria as they are now. */
  const commit = useCallback(
    (recipe: (current: BuySearchCriteria) => BuySearchCriteria) => {
      setSearchParams((current) => {
        const next = recipe(parseBuySearch(current, areas))

        return hasBuySearch(next) ? serialiseBuySearch(next, areas) : new URLSearchParams()
      }, { replace: true })
    },
    [setSearchParams, areas],
  )

  // Tidies a hand-typed or legacy link once on arrival, but only once the areas
  // are known: until then the URL is the only record of a deep link this hook
  // cannot yet read, and rewriting it would destroy it.
  useEffect(() => {
    if (!areAreasKnown) return

    const canonical = hasBuySearch(criteria) ? serialiseBuySearch(criteria, areas) : new URLSearchParams()
    if (canonical.toString() !== searchParams.toString()) setSearchParams(canonical, { replace: true })
  }, [criteria, areas, areAreasKnown, searchParams, setSearchParams])

  const update = useCallback(
    <K extends keyof BuySearchCriteria>(key: K, value: BuySearchCriteria[K]) =>
      commit((current) => ({ ...current, [key]: value })),
    [commit],
  )

  const reset = useCallback(() => commit(() => emptyBuySearch), [commit])

  const submit = useCallback(() => {
    navigate(buildBuySearchHref(criteria, areas))
  }, [criteria, areas, navigate])

  const { isFiltered, isValid, validationMessage } = useMemo(() => {
    const problem = findBuySearchProblem(criteria)

    return { isFiltered: hasBuySearch(criteria), validationMessage: problem, isValid: problem === null }
  }, [criteria])

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