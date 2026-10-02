import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'
import type { NavigationMenu } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'

interface NavMenuProps {
  menu: NavigationMenu
  isActive: boolean
}

/**
 * Desktop navigation dropdown.
 *
 * Opens on hover for pointer users and on click / `Enter` for everyone else, so
 * the trigger never navigates and the group's landing page lives as the first
 * item in the panel. `Escape` and a pointer press outside both close it, and the
 * chevron rotates to show the state. The panel is a plain list of links, which
 * keeps it keyboard-navigable without a custom focus trap.
 */
export function NavMenu({ menu, isActive }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLLIElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <li
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown') return
          event.preventDefault()
          setIsOpen(true)
        }}
        className={cn(
          'relative flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200 min-[1200px]:px-3 min-[1200px]:text-[0.9375rem]',
          isActive ? 'text-accent-700' : 'text-ink-600 hover:text-accent-600',
        )}
      >
        {menu.label}
        <Icon
          name="chevron-down"
          className={cn('size-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
          strokeWidth={2.4}
        />
        <span
          aria-hidden
          className={cn(
            'absolute -bottom-0.5 left-2 right-2 h-0.5 origin-left rounded-pill bg-accent-500 transition-transform duration-300 ease-[var(--ease-out-soft)] min-[1200px]:left-3 min-[1200px]:right-3',
            isActive ? 'scale-x-100' : 'scale-x-0',
          )}
        />
      </button>

      <div
        className={cn(
          'absolute left-0 top-full z-50 w-72 origin-top-left pt-2',
          'transition duration-200 ease-[var(--ease-out-soft)]',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-1 opacity-0',
        )}
      >
        <div
          id={panelId}
          aria-label={menu.label}
          className="rounded-xl border border-sand-200 bg-white p-2 shadow-lg"
        >
          {menu.items.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors duration-200 hover:bg-tint-50 focus-visible:bg-tint-50"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-tint-50 text-accent-600 transition-colors duration-200 group-hover:bg-accent-600 group-hover:text-white">
                {item.icon && <Icon name={item.icon} className="size-4" strokeWidth={2} />}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink-800 transition-colors duration-200 group-hover:text-accent-700">
                  {item.label}
                </span>
                {item.description && (
                  <span className="mt-0.5 text-xs leading-relaxed text-ink-400">
                    {item.description}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </li>
  )
}
