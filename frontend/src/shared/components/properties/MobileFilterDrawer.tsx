import { PropertyFilterSheet, type PropertyFilterSheetProps } from './PropertyFilterSheet'

export type MobileFilterDrawerProps = PropertyFilterSheetProps

/**
 * Filter drawer / sheet:
 * - On mobile and small tablets, slides up as a bottom sheet.
 * - On desktop on the Properties page, remains hidden as desktop uses the inline sidebar rail.
 */
export function MobileFilterDrawer(props: PropertyFilterSheetProps) {
  return <PropertyFilterSheet {...props} isDesktopDrawer={props.isDesktopDrawer ?? false} />
}
