import { z } from 'zod'

/**
 * Zod schema for a tolerant boolean flag for environment variables that supports any of
 * case-insensitive "true", "on", or "1" as `true` and anything else as `false`.
 *
 * Aims to capture explicit intent for a `true` value seen in other codebases.
 * A project should aim to be consistent and always use the same convention for boolean flags.
 */
export const zEnvBoolean = z
  .string()
  .transform<boolean>(
    (value) =>
      !!value && (String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'on' || value === '1'),
  )

/** Constant for the minimum port number in a port range: `1`. */
export const MIN_PORT = 1

/** Constant for the maximum port number in a port range: `65535`. */
export const MAX_PORT = 65535

/**
 * Zod schema that coerces + parses a port number to an integer in the range of `1` to `65535`.
 *
 * Useful for parsing port numbers where the input type could be a string such as environment variables,
 * form inputs, or query parameters.
 */
export const zPort = z.coerce.number().refine((value) => {
  return Number.isInteger(value) && value > MIN_PORT && value < MAX_PORT
})
