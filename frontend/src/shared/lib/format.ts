/**
 * Presentation formatters.
 * Kept in one place so currency/date rendering stays consistent across the UI
 * and can be localised centrally when the API goes live.
 */

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-NG')

/** ₦450,000,000 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

/** "450 sqm" */
export function formatArea(squareMetres: number): string {
  return `${numberFormatter.format(squareMetres)} sqm`
}

/** 18 February 2026 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formats a listing price, appending the rental period when relevant.
 * `null` prices are shown as "Price on request".
 */
export function formatPrice(price: number | null, period?: 'year' | 'month' | 'quarter'): string {
  if (price === null) return 'Price on request'
  const formatted = formatCurrency(price)
  if (!period) return formatted
  return `${formatted} / ${period}`
}
