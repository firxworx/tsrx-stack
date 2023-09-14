/**
 * Type guard that evaluates whether its input is an array of strings.
 * Returns `true` for an empty array.
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}
