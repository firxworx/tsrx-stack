import { z, ZodError } from 'zod'
import { IdentifierToken } from 'slonik/dist/tokens' // `as const` value

export const zTableIdentifier = z.tuple([z.string(), z.string()])

/**
 * Zod schema for an `IdentifierSqlToken`, the return type of slonik's `sql.identifier()`.
 */
export const zSlonikIdentifierSqlToken = z.object({
  names: z.array(z.string()),
  type: z.literal(IdentifierToken),
})

/**
 * Zod schema to parse 'ASC' or 'DESC' from a string.
 *
 * Accepts mixed case and whitespace padded input values and normalizes to uppercase 'ASC' or 'DESC',
 * otherwise will fail validation.
 *
 * Due to limitations of TypeScript and zod the output type is `string`.
 *
 * This schema is intended for use by `zSqlSortOrder`, a custom zod schema that returns the type 'ASC' | 'DESC'.
 *
 * @see zSqlSortOrder
 */
const zSqlSort = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => value === 'ASC' || value === 'DESC', {
    message: 'Order must be ASC or DESC',
  })

/**
 * Zod schema to parse 'ASC' or 'DESC' from a string and narrow type to 'ASC' | 'DESC'.
 *
 * This is a tolerant schema that accepts mixed case and whitespace padded input values and normalizes
 * the output. The behaviour is intended to facilitate accepting raw sort order input from the client
 * if/as required.
 */
export const zSqlSortOrder = z.custom<'ASC' | 'DESC'>(
  (input) => {
    const result = zSqlSort.safeParse(input)

    if (!result.success) {
      return { success: false, error: new ZodError(result.error.errors) }
    }

    return { success: true, value: result.data as 'ASC' | 'DESC' }
  },
  {
    message: 'Order must be ASC or DESC',
  },
)
