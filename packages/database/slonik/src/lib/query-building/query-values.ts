import { sql } from 'slonik'
import type { DateSqlToken, SqlFragment } from 'slonik/dist/types'

export type SqlQueryValueType = Date | string | null | undefined | boolean | number

/**
 * Return the appropriate slonik `SqlFragment`, `SqlToken`, or raw/primitive value to incorporate into
 * an SQL query given input of a primitive value (string, number, boolean, null, undefined) or `Date`.
 *
 * **IMPORTANT**:
 * - nullish values are normalized to `null` because `undefined` is not a valid SQL value
 * - if generating an UPDATE query remove fields that should not be updated prior to calling this function
 *
 * This behaviour is relevant to building `INSERT` and especially `UPDATE` queries: take care to avoid accidentally
 * nullifying fields whose values should not be modified.
 *
 * In case this function is called in a non-type-safe way due to naughty use of `as` casts or `any` and is passed
 * an an object or array it will throw an Error. If this happens you should fix your code.
 */
export function mapToQueryValue(v: SqlQueryValueType): DateSqlToken | SqlFragment | null | boolean | number {
  if (v instanceof Date) {
    return sql.date(v)
  }

  // return an SqlFragment for strings
  // fragment is preferred as the docs recommend against using `sql.literalValue()` for interpolation of strings
  if (typeof v === 'string') {
    return sql.fragment`${v}`
  }

  if (v === null || v === undefined) {
    return null
  }

  if (typeof v === 'object') {
    throw new Error('objects and arrays not supported by mapLiteralSqlValue')
  }

  return v as number | boolean | DateSqlToken | SqlFragment | null
}
