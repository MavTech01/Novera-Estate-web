import type { IconName } from '../types'

/**
 * Icon resolution for free-text feature and amenity labels.
 *
 * Features are stored as human-readable strings because that is how they will be
 * entered in the CMS and returned by the API. Rather than forcing every string
 * to carry an icon key, the first matching keyword wins and anything unknown
 * falls back to a neutral tick.
 *
 * Order matters: the first pattern that matches a label decides the icon, so
 * the more specific phrases come before the broader ones.
 */
const rules: { pattern: RegExp; icon: IconName }[] = [
  { pattern: /swimming|\bpool\b/i, icon: 'waves' },
  { pattern: /gym|fitness/i, icon: 'dumbbell' },
  { pattern: /kitchen/i, icon: 'chef-hat' },
  { pattern: /parking|carport|car park|garage/i, icon: 'car' },
  { pattern: /cctv|security|surveillance/i, icon: 'shield-check' },
  { pattern: /guard|gateman|manned gate|gate ?house/i, icon: 'shield-check' },
  { pattern: /generator/i, icon: 'zap' },
  { pattern: /electric|solar|power|inverter|lighting/i, icon: 'plug-zap' },
  { pattern: /water|borehole|treatment plant|swimming pool/i, icon: 'droplets' },
  { pattern: /garden|landscap|mature tree/i, icon: 'trees' },
  { pattern: /boys|staff|quarter|\bbq\b|maid|househelp/i, icon: 'users' },
  { pattern: /lift|elevator/i, icon: 'move-vertical' },
  { pattern: /furnish|wardrobe/i, icon: 'sofa' },
  { pattern: /waterfront|jetty|dock|marina/i, icon: 'anchor' },
  { pattern: /survey|title|deed|document|registration/i, icon: 'file-text' },
  { pattern: /laundry|washing|dry/i, icon: 'sparkles' },
  { pattern: /terrace|lawn|playground|recreation|green/i, icon: 'leaf' },
  { pattern: /internet|wifi|wi-fi|automation|smart home|tech/i, icon: 'wifi' },
  { pattern: /lounge|living room|reception|sitting/i, icon: 'sofa' },
  { pattern: /entertainment|cinema|tv|media/i, icon: 'tv' },
  { pattern: /store|pantry|walk ?in closet/i, icon: 'building-2' },
  { pattern: /road|expressway|street|commute/i, icon: 'navigation' },
  { pattern: /air conditioning|\bac\b/i, icon: 'sparkles' },
]

/** Maps a feature label such as "Fitted kitchen" to an icon name. */
export function getFeatureIcon(feature: string): IconName {
  const match = rules.find((rule) => rule.pattern.test(feature))
  return match ? match.icon : 'check'
}
