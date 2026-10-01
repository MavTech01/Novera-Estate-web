import { useCallback, useState } from 'react'

/**
 * Tracks which property ids the visitor has saved.
 * Local state for now; this becomes the `/api/favourites` endpoint later.
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>([])

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((current) =>
      current.includes(id) ? current.filter((favouriteId) => favouriteId !== id) : [...current, id],
    )
  }, [])

  const isFavourite = useCallback((id: string) => favourites.includes(id), [favourites])

  return { favourites, toggleFavourite, isFavourite }
}
