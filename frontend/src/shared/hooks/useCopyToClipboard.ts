import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copies text to the clipboard and reports success for a short window.
 *
 * Uses the async Clipboard API where it is available and falls back to a hidden
 * textarea, which keeps the "Copy link" action working on http:// origins and
 * older mobile browsers. The reference is copied too, so pasting into an email
 * client puts the URL on the clipboard either way.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  const copy = useCallback(
    async (value: string) => {
      const writeToClipboard = async () => {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value)
          return
        }

        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      try {
        await writeToClipboard()
        setCopied(true)
        if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => setCopied(false), resetAfterMs)
      } catch {
        setCopied(false)
      }
    },
    [resetAfterMs],
  )

  return { copied, copy }
}
