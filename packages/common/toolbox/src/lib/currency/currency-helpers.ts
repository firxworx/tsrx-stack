/**
 * Format a Stripe currency amount into a human-friendly localized string using Intl.NumberFormat.
 * Defaults to USD and en-US locale.
 */
export function formatStripeCurrencyAmount(
  amount: number | undefined | null,
  currency: string | undefined | null = 'USD',
  locale = 'en-US',
): string {
  if (amount === null || amount === undefined) {
    return ''
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: String(currency).toUpperCase(),
    currencyDisplay: 'symbol',
    signDisplay: 'auto',
  })

  // minimumFractionDigits is 2 for USD and 0 for JPY
  const { maximumFractionDigits } = formatter.resolvedOptions()

  // convert amount to its main unit using the provided fractional information
  const divisor = Math.pow(10, maximumFractionDigits) // e.g. 100 for 2, 1 for 0
  const amountInMainUnit = amount / divisor

  return formatter.format(amountInMainUnit)
}

export function currencyHasFractionPart(currencyCode: string): boolean {
  const parts = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol',
  }).formatToParts(123.45)
  const hasFractionPart = !!parts.find((p) => p.type === 'fraction')
  return hasFractionPart
}

export function getCurrencyFractionDigits(
  currencyCode: string,
  locale = 'en-US',
): { minimumFractionDigits: number; maximumFractionDigits: number } {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: String(currencyCode).toUpperCase(),
  })

  // e.g. minimumFractionDigits (and maximum) is 2 for USD and 0 for JPY
  // for most currencies the min + max are equal
  const { minimumFractionDigits, maximumFractionDigits } = formatter.resolvedOptions()

  return { minimumFractionDigits, maximumFractionDigits }
}

/**
 * Return a positive integer representing an amount in the lowest currency unit of the given currency
 * e.g. 100 for $1.00 USD (as the lowest unit is cents) and 1 for ¥1 JPY (as the lowest unit is yen).
 *
 * Internally this function uses `Intl.NumberFormat` and determines a multiplier based on the
 * `maximumFractionDigits` value returned by the formatter.
 *
 * The input currency must be a currency code supported by the `Intl.NumberFormat` API in the
 * given browser or Node.js runtime where this function is called.
 *
 * This function accepts the currency as a case-insensitive string: it will be internally converted
 * to ISO uppercase.
 */
export function convertToStripeAmount(amount: number, currency: string, locale = 'en-US'): number {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  })

  const { maximumFractionDigits } = formatter.resolvedOptions()

  const multiplier = Math.pow(10, maximumFractionDigits)

  // use Math.round to ensure the returned value is an integer
  return Math.round(amount * multiplier)
}
