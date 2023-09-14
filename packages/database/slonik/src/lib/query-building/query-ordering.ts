import { sql } from 'slonik'
import { camelToSnake } from '@rfx/common-toolbox'
import type { SlonikSqlFragment } from '../types/z-query-utils.types'
import { zSqlSortOrder } from '../zod-schemas/z-slonik'

/**
 * Helper function to normalize input sort direction to one of 'ASC' or 'DESC'.
 * This helper smooths over
 */
export function normalizeSortDirection(input: string): 'ASC' | 'DESC' {
  return zSqlSortOrder.parse(input)
}

/**
 * Function that accepts sort Record where keys are column names and values are 'asc' or 'desc'
 * and returns a slonik sql fragment for ORDER BY that can be appended to a query.
 *
 * The sort order is defined by the order of the keys in the Record.
 *
 * @see https://github.com/lab49/quickbits-pagination-showcase example discovered while implementing this
 */
export function buildOrderByFragment<T extends Record<string, unknown>>(
  sort?: Record<keyof T, 'asc' | 'desc' | 'ASC' | 'DESC'>,
): SlonikSqlFragment {
  if (!sort || Object.keys(sort).length === 0) {
    return sql.fragment``
  }

  const orderBys = Object.entries(sort).map(([column, direction]) => {
    const pgColumn = camelToSnake(column)

    // slonik doesn't like ASC or DESC strings but will accept the following (reportedly... untested)
    // @see https://github.com/lab49/quickbits-pagination-showcase/blob/cb7fe51a7213834cd5200e0901162be1a14c4cc6/utils/createOrderByFragment.ts#L4
    return normalizeSortDirection(direction) === 'ASC'
      ? sql.fragment`${sql.identifier([pgColumn])} ASC`
      : sql.fragment`${sql.identifier([pgColumn])} DESC`
  })

  return sql.fragment`ORDER BY ${sql.join(orderBys, sql.fragment`, `)}`
}
