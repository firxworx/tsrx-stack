import { type Interceptor, type QueryResultRow, SchemaValidationError, SerializableValue } from 'slonik'

/**
 * Return a slonik interceptor that validates and transforms the results of any postgres query associated with
 * a zod schema using `safeParse()`.
 *
 * Queries not associated with a zod schema are not transformed.
 *
 * This parser interceptor uses the zod schema as-provided: it will not alter the `strict()` vs. not `strict()`
 * property of the schema.
 *
 * Usage example: query using `sql.type()` to associate the query result with the schema `zUserDto`:
 *
 * ```ts
 * const { rows } = await this.pool.query(sql.type(zUserDto)`
 *   SELECT name, email, created_at FROM ${sql.identifier(['public', 'user']);
 * `)
 * ```
 *
 * @see {@link https://github.com/gajus/slonik#user-content-result-parser-interceptor}
 * @see https://github.com/gajus/slonik/issues/499 open issue with incompatible types (worked around using `as` cast)
 */
export const createResultParserInterceptor = (): Interceptor => {
  /*
  from the docs:
  <https://github.com/gajus/slonik#user-content-result-parser-interceptor>

  If you are not going to transform results with Zod you should use `afterQueryExecution` instead.
  Future versions of Zod will provide a more efficient parser when parsing without transformations.

  You can combine the two: use `afterQueryExecution` to validate results, and (conditionally)
  transform results as needed in `transformRow`.
  */
  return {
    transformRow: (executionContext, actualQuery, row): QueryResultRow => {
      const { log, resultParser } = executionContext

      if (!resultParser) {
        if (process.env['NODE_ENV'] !== 'production') {
          log?.debug(`query with no result parser: ${actualQuery.sql}}`)
        }

        return row
      }

      const parsedResult = resultParser.safeParse(row)

      if (!parsedResult.success) {
        log.debug({}, `slonik result parser: zod schema validation of query result failed`)
        throw new SchemaValidationError(actualQuery, row as SerializableValue, parsedResult.error.issues)
      }
      return parsedResult.data as QueryResultRow
    },
  }
  // types messed up..? @see https://github.com/gajus/slonik/issues/499
  // return {
  //   afterQueryExecution(executionContext, query, result): QueryResultRow {
  //     const { log, resultParser } = executionContext
  //     if (!resultParser) {
  //       console.log('no result parser')
  //       return result
  //     }
  //     const validationResult = resultParser.safeParse(result)
  //     if (!validationResult.success) {
  //       log.debug({}, `slonik result parser: zod schema validation of query result failed`)
  //       throw new SchemaValidationError(query, result as SerializableValue, validationResult.error.issues)
  //     }
  //     return validationResult.data as QueryResultRow
  //   },
  // }
}
