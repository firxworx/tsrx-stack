/**
 * Zod preprocessor function (helper) that normalizes `null`, `undefined`, falsey empty strings,
 * and whitespace strings to `undefined`.
 *
 * Any non-nullish non-string input values are converted to strings via `String()` and
 * the result value is trimmed of whitespace.
 */
export const emptyToUndefined = (arg: unknown): string | undefined => {
  if (arg === null || arg === undefined) {
    return undefined
  }

  return String(arg).trim() || undefined
}

/**
 * Zod preprocessor function (helper) that normalizes `null`, `undefined`, falsey empty strings,
 * and whitespace strings to `null`.
 *
 * Any non-nullish non-string input values are converted to strings via `String()` and
 * the result is trimmed of whitespace.
 */
export const emptyToNull = (arg: unknown): string | null => {
  if (arg === null || arg === undefined) {
    return null
  }

  return String(arg).trim() || null
}

/**
 * Zod preprocessor function (helper) that converts unknown input to string via `String()` and
 * strips any dash `-` characters.
 *
 * No other transformations are performed: the result string is not trimmed of whitespace.
 */
export const stripDashes = (arg: unknown): string => {
  return String(arg).replace(/-/g, '')
}

/**
 * Zod preprocessor function (helper) that converts numeric integer strings to integers otherwise
 * it returns `undefined`.
 */
export const stringToInt = (arg: unknown): number | undefined =>
  typeof arg == 'string' && /^\d+$/.test(arg) ? parseInt(arg, 10) : undefined
