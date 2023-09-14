import { z } from 'zod'
import type { IdentifierSqlToken, ListSqlToken, QuerySqlToken } from 'slonik'
import {
  buildSelectFromFragment,
  buildSingleRowWhereCondition,
  buildSqlColumnsList,
  buildSqlKeyValuesSet,
  getNormalizedSlonikIdentifierSqlToken,
} from './query-helpers'
import { sqlx } from '../client/slonik-sql'
import { IdUidDto, zIdUidDto } from '@rfx/common-data'
import { camelToSnake } from '@rfx/common-toolbox'
import { mapToQueryValue } from './query-values'

/**
 * Return a slonik `QuerySqlToken` that will parse the given zod schema that returns a single row from a
 * given table using a simple SQL SELECT statement.
 *
 * If the `whereValue` is a string, the query will use the `uid` column for the WHERE clause,
 * and if it is a number, the query will use the `id` column.
 */
export function buildSelectOneQueryStatement<ZS extends z.ZodObject<z.ZodRawShape>>(
  tableIdentifier: string | string[] | IdentifierSqlToken,
  recordIdentifierDto: IdUidDto,
  zodModelSchema: ZS,
): QuerySqlToken<ZS> {
  const sqlWhereCondition = buildSingleRowWhereCondition(recordIdentifierDto)

  return sqlx.type(zodModelSchema)`
    ${buildSelectFromFragment(tableIdentifier, zodModelSchema)}
    WHERE ${sqlWhereCondition};
  `
}

/**
 * Return a slonik `QuerySqlToken` that executes an SQL DELETE statement for a single row from a table.
 *
 * To use the SQL statement returned by this function with slonik `DatabasePool.query()`:
 *
 * - `result.rowCount === 0` indicates the record was not found
 * - `result.rowCount === 1` indicates the record was found and deleted
 */
export function buildDeleteOneQueryStatement(
  tableIdentifier: string | string[] | IdentifierSqlToken,
  recordIdentifierDto: IdUidDto,
): QuerySqlToken<z.ZodVoid> {
  const sqlTableIdentifier = getNormalizedSlonikIdentifierSqlToken(tableIdentifier)

  const sqlWhereCondition = buildSingleRowWhereCondition(recordIdentifierDto)

  return sqlx.typeAlias('void')`
    DELETE FROM ${sqlTableIdentifier}
    WHERE ${sqlWhereCondition};
  `
}

// @todo revise so resultDto also accepts zod void or zod null and handle
export function buildCreateOneQueryStatement<
  ZodCreateDtoSchema extends z.ZodObject<z.ZodRawShape>,
  ZodResultDtoSchema extends z.ZodObject<z.ZodRawShape>,
>(
  tableIdentifier: string | string[] | IdentifierSqlToken,
  zCreateDto: ZodCreateDtoSchema,
  zResultDto: ZodResultDtoSchema,
  data: unknown,
): QuerySqlToken<ZodResultDtoSchema> {
  const cDto = zCreateDto.parse(data)

  const sqlTableIdentifier = getNormalizedSlonikIdentifierSqlToken(tableIdentifier)

  const keys = Object.keys(cDto).map((key) => sqlx.identifier([camelToSnake(key)]))
  const values = Object.values(cDto).map(mapToQueryValue)

  const resultDtoSqlColumns: ListSqlToken = buildSqlColumnsList(zResultDto)

  const query = sqlx.type(zResultDto)`
      INSERT INTO ${sqlTableIdentifier} (${sqlx.join(keys, sqlx.fragment`, `)})
      VALUES (${sqlx.join(values, sqlx.fragment`, `)})
      RETURNING ${resultDtoSqlColumns};
    `

  return query
}

// @todo revise so resultDto also accepts zod void or zod null and handle
export function buildUpdateOneQueryStatement<
  ZodUpdateDtoSchema extends z.ZodObject<z.ZodRawShape>, // typeof zIdUidDto
  ZodResultDtoSchema extends z.ZodObject<z.ZodRawShape>,
>(
  tableIdentifier: string | string[] | IdentifierSqlToken,
  zUpdateDto: ZodUpdateDtoSchema,
  zResultDto: ZodResultDtoSchema,
  data: unknown,
): QuerySqlToken<ZodResultDtoSchema> {
  const xIdDto = zIdUidDto.parse(data)
  const uDto = zUpdateDto.parse(data)

  const sqlTableIdentifier = getNormalizedSlonikIdentifierSqlToken(tableIdentifier)
  const resultDtoSqlColumns: ListSqlToken = buildSqlColumnsList(zResultDto)

  const query = sqlx.type(zResultDto)`
      UPDATE ${sqlTableIdentifier}
      SET ${buildSqlKeyValuesSet(uDto, { stripUndefinedValues: true })}
      WHERE ${buildSingleRowWhereCondition(xIdDto)}
      RETURNING ${resultDtoSqlColumns};
    `

  return query
}
