/**
 * Type guard for `Record<string, unknown>`.
 */
export function isRecord(input: unknown): input is Record<string, unknown> {
  return !!input && !Array.isArray(input) && typeof input === 'object'
}
