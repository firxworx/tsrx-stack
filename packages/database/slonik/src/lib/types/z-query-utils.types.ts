import { z } from 'zod'
import { sql } from 'slonik'

/**
 * Type utility that represents a slonik sql fragment (`SLONIK_TOKEN_FRAGMENT`).
 */
export type SlonikSqlFragment = ReturnType<typeof sql.fragment>

/**
 * Type representing SQL query sort direction (`ASC | DESC`).
 */
export type SqlSortDirection = 'ASC' | 'DESC'

/**
 * Generic type utility that represents an object shape of a zod schema for an object.
 * Intended for use with slonik + zod to support query building functions.
 */
export type ZodObjectShape<
  T extends z.ZodTypeAny,
  U = T extends z.ZodObject<infer P extends z.ZodRawShape> ? P : never,
> = U extends {
  [_ in keyof U]: z.ZodTypeAny
}
  ? U
  : never

/**
 * Generic type utility that represents the keys of a zod object schema.
 * Intended for use with slonik + zod to support query building functions.
 */
export type ZodObjectKeys<T extends z.ZodObject<z.ZodRawShape>> = keyof ZodObjectShape<T>
