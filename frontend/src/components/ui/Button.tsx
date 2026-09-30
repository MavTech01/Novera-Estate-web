import { cn } from '../../lib/cn'
import { Icon } from './Icon'

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'soft' | 'ghost' | 'onBrown' | 'white'
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
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-11 px-5 text-sm',
  md: 'h-12 px-6 text-[0.9375rem]',
  lg: 'h-14 px-8 text-base',
}

function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-[-0.005em]',
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

/** Primary action button (min 44px touch target at every size). */
export function Button({ variant = 'primary', size = 'md', withArrow = false, className, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonStyles(variant, size, className)} {...rest}>
      {children}
      {withArrow && <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />}
    </button>
  )
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  withArrow?: boolean
}

/** Anchor styled as a button — used until routing is introduced. */
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
    <a href={href} className={buttonStyles(variant, size, className)} {...rest}>
      {children}
      {withArrow && <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />}
    </a>
  )
}
