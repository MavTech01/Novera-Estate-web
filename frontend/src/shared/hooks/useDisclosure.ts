import { useCallback, useState } from 'react'

/**
 * Open/close state for the inspection modal, lightbox and share menu.
 * Kept as a hook so each surface handles its own reset behaviour.
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])

  return { isOpen, open, close, toggle }
}
