import { z } from 'zod'
import type { IdentifierSqlToken, ListSqlToken } from 'slonik'

import { camelToSnake, isStringArray } from '@rfx/common-toolbox'
import { sqlx } from '../client/slonik-sql'
import type { SlonikSqlFragment, ZodObjectKeys } from '../types/z-query-utils.types'
import { isSlonikIdentifierSqlToken } from '../type-guards/slonik.type-guards'
import { IdUidDto, zIdUidDto } from '@rfx/common-data'
import { type SqlQueryValueType, mapToQueryValue } from './query-values'

/**
 * Return a slonik `IdentifierSqlToken` for use in slonik-powered SQL queries given a string, string array, or
 * `IdentifierSqlToken`.
 *
 * These are typically used to express table names, column names, and other identifiers within an SQL query.
 *
 * This helper normalizes identifiers and ensures that they are appropriately wrapped in double quotes and that
 * code is protected from SQL injection attacks.
 *
 * It accepts varying input types as a convenience when building queries or writing functions that build queries
 * e.g. 'user', ['public', 'user'], or sql.identifier(['public', 'user']).
 */
export function getSlonikIdentifierSqlToken(input: string | string[] | IdentifierSqlToken): IdentifierSqlToken {
  return isSlonikIdentifierSqlToken(input) ? input : sqlx.identifier(Array.isArray(input) ? input : [input])
}

/**
 * Return a slonik `IdentifierSqlToken` for use in slonik-powered SQL queries given a string, string array, or
 * `IdentifierSqlToken`.
 *
 * Similar to `getSlonikIdentifierSqlToken()` except this function converts camelCase identifiers found in
 * `string` and `string[]` input to snake_case identifiers per project convention.
 *
 * Input that is already an `IdentifierSqlToken` is returned as-is.
 *
 * @see getSlonikIdentifierSqlToken
 * @throws {@link Error} if an unsupported input value type is encountered at runtime
 */
export function getNormalizedSlonikIdentifierSqlToken(
  input: string | string[] | IdentifierSqlToken,
): IdentifierSqlToken {
  if (isSlonikIdentifierSqlToken(input)) {
    return input
  }

  if (isStringArray(input)) {
    return getSlonikIdentifierSqlToken(input.map(camelToSnake))
  }

  if (typeof input === 'string') {
    return getSlonikIdentifierSqlToken(camelToSnake(input))
  }

  throw new Error('getNormalizedSlonikIdentifierSqlToken: unsupported input type')
}

/**
 * Build a list of fields/columns from a zod schema for use in a slonik-powered SQL query, returned
 * as a `ListSqlToken`.
 *
 * This function will convert camelCase field names to snake_case column names per project convention to
 * use snake_case within the database and camelCase within JS/TS.
 */
export function buildSqlColumnsList<T extends z.ZodObject<z.ZodRawShape>>(zodModelSchema: T): ListSqlToken {
  const fields: ZodObjectKeys<T>[] = Object.keys(zodModelSchema.shape).map(camelToSnake)
  const columns: IdentifierSqlToken[] = fields.map((fieldName) => sqlx.identifier([String(fieldName)]))

  return sqlx.join(columns, sqlx.fragment`, `)
}

/**
 * Build a 'SELECT ... FROM ...' SQL query/fragment with a given identifier (table name) and zod object schema
 * that describes the shape of the return value.
 */
export function buildSelectFromFragment<T extends z.ZodObject<z.ZodRawShape>>(
  tableIdentifier: string | string[] | IdentifierSqlToken,
  zodModelSchema: T,
): SlonikSqlFragment {
  const sqlColumnsList: ListSqlToken = buildSqlColumnsList(zodModelSchema)
  const sqlTableIdentifier = getNormalizedSlonikIdentifierSqlToken(tableIdentifier)

  return sqlx.fragment`SELECT ${sqlColumnsList} FROM ${sqlTableIdentifier}`
}

/**
 * Build a where _condition_ for a single row from a table identified by a `IdUidDto` object that
 * specifies one or both of `id` and `uid`.
 *
 * If both are defined they are both included in the generated SQL (joined by `AND`).
 *
 * The return value **does not** include the `WHERE` keyword or a trailing semicolon to support
 * greater flexibility in composing SQL queries.
 */
export function buildSingleRowWhereCondition(idUidDto: IdUidDto): SlonikSqlFragment {
  const xid = zIdUidDto.parse(idUidDto)

  if (xid.id && xid.uid) {
    return sqlx.fragment`
      ${sqlx.identifier(['id'])} = ${Number(xid.id)} AND ${sqlx.identifier(['uid'])} = ${String(xid.uid)}
    `
  }

  if (xid.id) {
    return sqlx.fragment`${sqlx.identifier(['id'])} = ${Number(xid.id)}`
  }

  if (xid.uid) {
    return sqlx.fragment`${sqlx.identifier(['uid'])} = ${String(xid.uid)}`
  }

  // `false` fallback is a safety net to prevent accidental updates of all rows in the table
  return sqlx.fragment`false`
}

export function buildSingleRowWhereClause(idUidDto: IdUidDto): SlonikSqlFragment {
  return sqlx.fragment`WHERE ${buildSingleRowWhereCondition(idUidDto)}`
}

/**
 * Stringify a key-value object (TypeScript `Record`) with primitive values (e.g. `IdUidDto` object)
 * for use in logs and error messages.
 *
 * The typing is intentionally loose with `unknown` to support a variety of use cases.
 * This function's intended use-case is to support creating messages with `id` and/or `uid` values.
 *
 * Do not use this function to build queries.
 * For `UPDATE` queries use `buildSqlKeyValuesSet` which returns a `ListSqlToken`.
 */
export function stringifyKeyValueDto(idUidDto: Record<string, string | number | unknown>): string {
  return Object.entries(idUidDto)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')
}

export function buildSqlKeyValuesSet(
  input: Record<string, SqlQueryValueType>,
  options?: { stripUndefinedValues: boolean },
): ListSqlToken {
  const DEFAULT_OPTS = {
    stripUndefinedValues: true,
  }

  const opts = Object.assign({}, DEFAULT_OPTS, options)

  const entries = opts.stripUndefinedValues
    ? Object.entries(input).filter(([, v]) => v !== undefined)
    : Object.entries(input)

  const sqlKeyValuesSet = sqlx.join(
    entries.map(([key, value]) => sqlx.fragment`${sqlx.identifier([camelToSnake(key)])} = ${mapToQueryValue(value)}`),
    sqlx.fragment`, `,
  )

  return sqlKeyValuesSet
}

// /**
//  * Return a slonik `ListSqlToken` for use in `UPDATE` queries.
//  *
//  * This helper assists in building the `SET` key = value fragment of SQL of an `UPDATE` query based on the
//  * input: a `Record` object with string keys that correspond to field names in the database.
//  *
//  * Object keys (field names) in camelCase are converted to lower snake_case.
//  *
//  * Object entries with nullish values (`null` or `undefined`) _and_ empty strings are filtered/omitted from
//  * the return value. Non-empty strings including whitespace strings are included.
//  *
//  * Supported values:
//  *
//  * - primitive types
//  * - `Date` which is internally converted to a string value via `Date.toISOString()`.
//  *
//  * This implementation assumes that the database adheres to project conventions that use snake_case within the
//  * database and camelCase within JS/TS.
//  *
//  * @throws {@link TypeError} if an unsupported input value type is encountered at runtime
//  */
// export const objectToKeyValueSet = (
//   input: Record<string, string | number | boolean | Date | undefined | null>,
// ): ListSqlToken => {
//   return sqlx.join(
//     Object.entries(input)
//       .filter((entry): entry is [string, string | number | boolean | Date] => {
//         if (entry[1] === null || entry[1] === undefined) {
//           return false
//         }

//         if (
//           typeof entry[1] === 'boolean' ||
//           typeof entry[1] === 'number' ||
//           (typeof entry[1] === 'object' && entry[1] instanceof Date)
//         ) {
//           return true
//         }

//         if (typeof entry[1] === 'string') {
//           return !!entry[1]
//         }

//         throw new TypeError(`Invalid value type passed to objectToKeyValueSet: ${typeof entry[1]}`)
//       })
//       .map(([key, value]) => {
//         return sqlx.fragment`${sqlx.identifier([camelToSnake(key)])} = ${
//           input instanceof Date ? input.toISOString() : (value as string | number | boolean)
//         }`
//       }),
//     sqlx.fragment`, `,
//   )
// }

/**
 * example usage available --
 * @see https://github.com/Tampere/Hanna/blob/main/backend/src/components/sap/blanketContractReport.ts#L49
 */
export function textToTsQuery(text: string): SlonikSqlFragment | undefined {
  const searchTerm =
    text
      ?.trim()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => `${term}:*`)
      .join(' & ') || null

  if (!searchTerm) {
    return undefined
  }

  return sqlx.fragment`to_tsquery('simple', ${searchTerm})`
}
