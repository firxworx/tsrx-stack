import { z } from 'zod'

/**
 * JSON-related zod schemas and types based on the examples from the official zod docs/README.
 *
 * `zJson` is a lazy recursive schema that accepts allowed JSON values: `string`, `number`, `boolean`, and `null`,
 * plus `Array` and `Object` types that contain these values.
 *
 * Note that `JSON.stringify()` enforces non-circularity however this can't be easily checked without
 * stringifying the results which would have a performance impact especially for large objects.
 */

export type Json = JsonLiteral | { [key: string]: Json } | Json[]
export type JsonLiteral = z.infer<typeof zLiteral>
export type JsonObject = z.infer<typeof zJsonObject>

export type JsonLiteralWithDate = z.infer<typeof zLiteralWithDate>
export type JsonWithDate = JsonLiteralWithDate | { [key: string]: JsonWithDate } | JsonWithDate[]

export const zLiteral = z.union([z.string(), z.number(), z.boolean(), z.null()])

export const zJson: z.ZodType<Json> = z.lazy(() => z.union([zLiteral, z.array(zJson), z.record(zJson)]), {
  invalid_type_error: 'Invalid JSON',
})

export const zJsonObject = z.record(zJson)

export function parseJson(data: unknown): Json {
  return zJson.parse(data)
}

export const zLiteralWithDate = z.union([z.string(), z.number(), z.boolean(), z.null(), z.date()])

export const zJsonWithDate: z.ZodType<JsonWithDate> = z.lazy(
  () => z.union([zLiteral, z.array(zJson), z.record(zJson)]),
  {
    invalid_type_error: 'Invalid JSON',
  },
)

/**
 * Zod schema for JSON strings with a transformer that parses the JSON string into a JSON object.
 *
 * This schema is helpful to only run `JSON.parse(...)` once when handling JSON strings.
 * Otherwise you may end up
 */
export const zJsonStringToJson = z.string().transform<Json>((str, ctx): Json => {
  try {
    return JSON.parse(str)
  } catch (error: unknown) {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })

    return z.NEVER
  }
})
