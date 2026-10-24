import { cn } from '@/shared/lib/cn'

import { Icon } from './Icon'
import { SmartLink as Link } from './SmartLink'

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'soft' | 'ghost' | 'onBrown' | 'white' | 'glassDark'
type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-600 text-white shadow-sm hover:bg-accent-700 hover:shadow-md active:bg-accent-800 active:shadow-sm',
  accent:
    'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-md active:bg-accent-700 active:shadow-sm',
  outline:
    'border border-accent-200 bg-white text-accent-700 hover:border-accent-400 hover:bg-tint-50 active:bg-tint-100',
  soft: 'bg-tint-50 text-accent-700 hover:bg-tint-100 active:bg-tint-200',
  ghost: 'text-ink-600 hover:bg-tint-50 hover:text-accent-700',
  onBrown: 'bg-accent-600 text-white shadow-sm hover:bg-accent-500 active:bg-accent-700',
  white: 'bg-white text-ink-900 shadow-sm hover:bg-tint-50 active:bg-tint-100',
  glassDark:
    'border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-xs hover:border-accent-300/50 hover:bg-ink-950/45 hover:text-white hover:shadow-md active:bg-ink-950/60 active:border-white/25',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-[clamp(2.375rem,2.15rem+1vw,2.75rem)] px-[clamp(0.75rem,0.65rem+0.5vw,1.25rem)] text-[clamp(0.75rem,0.72rem+0.2vw,0.875rem)]',
  md: 'h-[clamp(2.625rem,2.35rem+1.1vw,3rem)] px-[clamp(0.875rem,0.75rem+0.75vw,1.5rem)] text-[clamp(0.8125rem,0.76rem+0.25vw,0.9375rem)]',
  lg: 'h-[clamp(2.875rem,2.5rem+1.25vw,3.5rem)] px-[clamp(1.125rem,0.85rem+1.1vw,2rem)] text-[clamp(0.875rem,0.8125rem+0.3vw,1rem)]',
}

function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-[clamp(0.375rem,0.3rem+0.3vw,0.5rem)] whitespace-nowrap rounded-md font-semibold tracking-[-0.005em] max-w-full',
    'transition-all duration-200 ease-[var(--ease-out-soft)]',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  withArrow?: boolean
}

/** Primary action button with fluid responsive sizing that adapts seamlessly on mobile. */
export function Button({ variant = 'primary', size = 'md', withArrow = false, className, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonStyles(variant, size, className)} {...rest}>
      {children}
      {withArrow && (
        <Icon
          name="arrow-right"
          className="size-[clamp(0.875rem,0.8rem+0.25vw,1rem)] shrink-0"
          strokeWidth={2.2}
        />
      )}
    </button>
  )
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  withArrow?: boolean
}

/** Anchor styled as a button with fluid responsive sizing. Internal hrefs navigate without a page reload. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonStyles(variant, size, className)} {...rest}>
      {children}
      {withArrow && (
        <Icon
          name="arrow-right"
          className="size-[clamp(0.875rem,0.8rem+0.25vw,1rem)] shrink-0"
          strokeWidth={2.2}
        />
      )}
    </Link>
  )
}
