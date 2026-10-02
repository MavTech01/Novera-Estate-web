import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { navigate, replaceSearchParams, useRouter } from '@/shared/hooks/useRouter'
import {
  buildRentSearchHref,
  emptyRentSearch,
  findRentSearchProblem,
  hasRentSearch,
  parseRentSearch,
  serialiseRentSearch,
} from '@/features/rent/utils/rentQuery'
import type {
  RentLocation,
  RentSearchController,
  RentSearchCriteria,
} from '@/features/rent/types/rent.types'

/**
 * Owns the Rent page search panel's criteria and keeps the URL in sync.
 *
 * The address bar is the shareable form of the visitor's search, the same way
 * it is on `/properties`: it seeds the panel on arrival, receives every change
 * via `replaceState` (so a tweak never floods the back button), and re-seeds
 * when a shared `/rent?location=lekki&bedrooms=4` link is followed.
 *
 * One deliberate wrinkle: the area list arrives asynchronously from the
 * catalogue, and an area is only recognisable by the catalogue slugs behind it.
 * So the panel does not touch the URL until the areas are known — otherwise it
 * would overwrite a deep link with an empty search before the areas loaded.
 */
export function useRentSearch(areas: readonly RentLocation[]): RentSearchController {
  const { query } = useRouter()

  const areAreasKnown = areas.length > 0
  const [criteria, setCriteria] = useState<RentSearchCriteria>(() =>
    parseRentSearch(query, areas),
  )

  /** The query string we last wrote ourselves, used to ignore our own echo. */
  const ownQueryKey = useRef<string | null>(areAreasKnown ? query.toString() : null)

  // Adopt filter state pushed into the URL by navigation or a deep link.
  const incomingQueryKey = query.toString()
  useEffect(() => {
    if (incomingQueryKey === ownQueryKey.current) return

    ownQueryKey.current = incomingQueryKey
    setCriteria(parseRentSearch(query, areas))
    // `query` is derived from `incomingQueryKey`; `areas` is the real second dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingQueryKey, areAreasKnown, areas])

  // Publish state changes to the address bar — once we can trust the area list.
  useEffect(() => {
    if (!areAreasKnown) return

    const isFiltered = hasRentSearch(criteria)
    const next = isFiltered ? serialiseRentSearch(criteria, areas) : new URLSearchParams()
    ownQueryKey.current = next.toString()
    replaceSearchParams(next)
  }, [criteria, areas, areAreasKnown])

  const update = useCallback(
    <K extends keyof RentSearchCriteria>(key: K, value: RentSearchCriteria[K]) => {
      setCriteria((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const reset = useCallback(() => {
    setCriteria(emptyRentSearch)
    ownQueryKey.current = ''
  }, [])

  const submit = useCallback(() => {
    navigate(buildRentSearchHref(criteria, areas))
  }, [criteria, areas])

  const { isFiltered, isValid, validationMessage } = useMemo(() => {
    const problem = findRentSearchProblem(criteria)

    return { isFiltered: hasRentSearch(criteria), validationMessage: problem, isValid: problem === null }
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
