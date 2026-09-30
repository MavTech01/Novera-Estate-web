import {
  ArrowRight,
  BadgeCheck,
  Bath,
  Bed,
  Building2,
  Building,
  CalendarSearch,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Heart,
  House,
  Key,
  LandPlot,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'

import type { IconName } from '../../types'

/**
 * Central icon registry.
 * Data files reference icons by name, so adding an icon never requires a data
 * file change and components never import icon libraries directly.
 */
const icons = {
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowRight,
  'badge-check': BadgeCheck,
  bath: Bath,
  bed: Bed,
  building: Building,
  'building-2': Building2,
  'calendar-search': CalendarSearch,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  clock: Clock,
  close: X,
  compass: Compass,
  'file-text': FileText,
  heart: Heart,
  house: House,
  key: Key,
  'land-plot': LandPlot,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  phone: Phone,
  quote: Quote,
  ruler: Ruler,
  search: Search,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  store: Store,
  'trending-up': TrendingUp,
  users: Users,
} satisfies Record<IconName, LucideIcon>

export type IconProps = {
  name: IconName
  className?: string
  strokeWidth?: number
  'aria-hidden'?: boolean | 'true' | 'false'
}

export function Icon({ name, className, strokeWidth = 1.5, ...rest }: IconProps) {
  const LucideIcon = icons[name]
  return <LucideIcon className={className} strokeWidth={strokeWidth} aria-hidden {...rest} />
}
