import type { Interceptor, QueryResult, QueryResultRow } from 'slonik'
import type { MaybePromise } from 'slonik/dist/types'

export type LogFunction = (data?: Record<string, unknown>, message?: string) => void
export type Logger = Record<string, LogFunction>

/**
 * Slonik query logging interceptor that logs query execution using the provided instance of a
 * NestJS-compatible logger. This includes fastify's default logger: pino.
 *
 * Commented out examples show how to use customize behaviour with pino.
 * Adapted from <https://github.com/ou-ca/ouca-backend> (MIT license) which was written for NestJS.
 */
export const createQueryLoggingInterceptor = (logger: Logger): Interceptor => {
  if (!logger || typeof logger['log'] !== 'function') {
    throw new Error('slonik query logger interceptor: logger argument must have a log() function')
  }

  return {
    afterQueryExecution: (context, _query, result): MaybePromise<null> => {
      // pinoLogger.trace(
      //   {
      //     executionTime: Number(process.hrtime.bigint() - BigInt(context.queryInputTime)) / 1_000_000,
      //     rowCount: result?.rowCount ?? null,
      //     queryId: context.queryId,
      //   },
      //   'query execution result',
      // )

      logger['log']?.(
        {
          executionTime: Number(process.hrtime.bigint() - BigInt(context.queryInputTime)) / 1_000_000,
          rowCount: result?.rowCount ?? null,
          queryId: context.queryId,
        },
        'query execution result',
      )

      return null
    },
    beforeQueryExecution: async (context, query): Promise<QueryResult<QueryResultRow> | null> => {
      // pinoLogger.trace(
      //   {
      //     sql: query.sql,
      //     queryId: context.queryId,
      //   },
      //   'executing query',
      // )
      logger['log']?.(
        {
          sql: query.sql,
          queryId: context.queryId,
        },
        'executing query',
      )

      return null
    },
    queryExecutionError: (_context, _query, error, _notices): MaybePromise<null> => {
      // pinoLogger.warn(
      //   {
      //     error: serializeError(error),
      //   },
      //   'query execution produced an error',
      // )

      logger['log']?.(
        {
          error, // error: serializeError(error),
        },
        'query execution produced an error',
      )

      return null
    },
  }
}
