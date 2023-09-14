import { z } from 'zod'

/**
 * Generic zod schema utility that returns an optional version of the input zod schema.
 */
export function makeZodSchemaOptional<T extends z.ZodTypeAny>(schema: T): z.ZodOptional<T> {
  return schema.optional()
}

/**
 * Zod schema that parses an empty string and transforms it to `undefined`.
 */
export const zEmptyStringToUndefined = z.literal('').transform(() => undefined)

/**
 * Zod schema utility that returns its input schema as optional plus adds a union vs. another schema that
 * parses empty strings and transforms them to `undefined`.
 *
 * Intended for HTML form fields that are not required including use-cases related to http PATCH requests
 * where only properties with defined values are to be updated.
 *
 * @see zEmptyStringToUndefined
 */
export function makeZodOptionalTextField<ZS extends z.ZodTypeAny>(
  zSchema: ZS,
): z.ZodUnion<[z.ZodOptional<ZS>, z.ZodEffects<z.ZodLiteral<''>, undefined, ''>]> {
  return zSchema.optional().or(zEmptyStringToUndefined)
}
