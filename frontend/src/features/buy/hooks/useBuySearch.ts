import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
 * The address bar is the shareable form of the visitor's search, the same way
 * it is on `/properties`: it seeds the panel on arrival, receives every change
 * via `replaceState` (so a tweak never floods the back button), and re-seeds
 * when a shared `/buy?location=lekki&bedrooms=4` link is followed.
 *
 * One deliberate wrinkle: the area list arrives asynchronously from the
 * catalogue, and an area is only recognisable by the catalogue slugs behind it.
 * So the panel does not touch the URL until the areas are known — otherwise it
 * would overwrite a deep link with an empty search before the areas loaded.
 */
export function useBuySearch(areas: readonly BuyLocation[]): BuySearchController {
  const [query, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const areAreasKnown = areas.length > 0
  const [criteria, setCriteria] = useState<BuySearchCriteria>(() =>
    parseBuySearch(query, areas),
  )

  /** The query string we last wrote ourselves, used to ignore our own echo. */
  const ownQueryKey = useRef<string | null>(areAreasKnown ? query.toString() : null)

  // Adopt filter state pushed into the URL by navigation or a deep link.
  const incomingQueryKey = query.toString()
  useEffect(() => {
    if (incomingQueryKey === ownQueryKey.current) return

    ownQueryKey.current = incomingQueryKey
    setCriteria(parseBuySearch(query, areas))
    // `query` is derived from `incomingQueryKey`; `areas` is the real second dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingQueryKey, areAreasKnown, areas])

  // Publish state changes to the address bar — once we can trust the area list.
  useEffect(() => {
    if (!areAreasKnown) return

    const isFiltered = hasBuySearch(criteria)
    const next = isFiltered ? serialiseBuySearch(criteria, areas) : new URLSearchParams()
    ownQueryKey.current = next.toString()
    setSearchParams(next, { replace: true })
  }, [criteria, areas, areAreasKnown, setSearchParams])

  const update = useCallback(
    <K extends keyof BuySearchCriteria>(key: K, value: BuySearchCriteria[K]) => {
      setCriteria((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const reset = useCallback(() => {
    setCriteria(emptyBuySearch)
    ownQueryKey.current = ''
  }, [])

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