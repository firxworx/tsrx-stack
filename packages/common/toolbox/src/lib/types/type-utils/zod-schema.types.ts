import { z } from 'zod'

/**
 * Type utility for a zod object schema that parses environment variables or similar configuration objects.
 * The schema describes a `ZodObject` with string keys and unknown values (`ZodTypeAny`).
 *
 * The value type is unknown because the zod schema could preprocess/coerce/transform the input values into
 * different types vs. the raw input values (`string` for environment variables).
 */
export type ZodSchemaEnv = z.ZodObject<{
  [key: string]: z.ZodTypeAny
}>

/**
 * Type utility that removes the _brand_ from a zod type to enable accurate type extraction from all schemas.
 * @see https://github.com/colinhacks/zod#brand
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is ok for this ZodType generic type utility
export type RemoveBrandForTypeExtraction<T> = T extends z.ZodType<any, any, infer U> ? z.ZodType<U> : T

/**
 * Type utility that extracts the type from a zod schema.
 * Branded zod schemas are handled and the type will be extracted without the internal zod brand.
 */
export type ExtractZodSchemaType<T> = T extends z.ZodType<infer U> ? RemoveBrandForTypeExtraction<U> : never
