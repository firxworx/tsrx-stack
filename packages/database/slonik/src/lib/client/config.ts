import { createTypeParserPreset, type ClientConfiguration, type Interceptor, type TypeParser } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'
import { createQueryLoggingInterceptor } from 'slonik-interceptor-query-logging'

import { timestamptzToDateParser } from '../type-parsers/type-parsers'
import { createResultParserInterceptor } from '../interceptors/slonik-result-parser-interceptor'
import { sqlx } from './slonik-sql'

// the following allows an aws lambda handler to freeze and reuse the connection
// context.callbackWaitsForEmptyEventLoop = false;

const IS_LAMBDA_ENVIRONMENT = !!process.env['AWS_LAMBDA_FUNCTION_NAME']

/**
 * Slonik type parsers for connections:
 *
 * - includes the type parser preset exported by slonik with timestamp, timestamptz, and date types excluded
 * - parse timestamptz fields to Date objects
 */
export const typeParsers: TypeParser[] = [
  ...createTypeParserPreset().filter((i) => i.name !== 'timestamp' && i.name !== 'timestamptz' && i.name !== 'date'),
  timestamptzToDateParser,

  // uncomment to override int8->integer (warning: this can bork json serialization of bigint)
  // int8ToBigIntParser,
]

/**
 * Array of slonik interceptors including:
 * - map snake_case field names in results to camelCase to mutually respect postgres + TS conventions
 */
export const interceptors: Interceptor[] = [
  // the following package does not export types... its 4 year old js...
  // createQueryNormalisationInterceptor({
  //   stripComments: true,
  // }),
  {
    // slonik may warn that "unsupportedOptions":{"schema":"public"}}" (unsupported DSN parameter) and ignore connection uri params
    // the default schema can be enforced via the following query which executes after each connection is established
    afterPoolConnection: async (_connectionContext, connection) => {
      await connection.query(sqlx.typeAlias('null')`
        CREATE SCHEMA IF NOT EXISTS public;
        SET search_path TO public;

        SET TIME ZONE 'UTC';
      `)

      return null
    },
  },
  createFieldNameTransformationInterceptor({
    format: 'CAMEL_CASE',
  }),
  createResultParserInterceptor(),
  createQueryLoggingInterceptor(),
]

/**
 * Default slonik client configuration for initializing a slonik `DatabasePool` to connect to postgres.
 *
 * - captureStackTrace: true,
 * - generous connection and idle timeout for cloud pg database services that may have slow cold starts
 * - override default type parsers to map timestamp + timestamptz to strings vs. default js timestamps in ms
 * - apply fieldNameTransformationInterceptor to map snake_case field names to camelCase in query results
 */
export const DEFAULT_SLONIK_POOL_CONFIG: Partial<ClientConfiguration> = {
  captureStackTrace: true,
  connectionTimeout: 45000,
  idleTimeout: 45000,

  // statementTimeout: 'DISABLE_TIMEOUT', // may not be supported by pgBouncer (e.g. neon postgres)
  // idleInTransactionSessionTimeout: 'DISABLE_TIMEOUT', // may not be supported by pgBouncer (e.g. neon postgres)

  // restrict pool size to 1 in a lambda environment
  maximumPoolSize: IS_LAMBDA_ENVIRONMENT ? 1 : 10,

  // @see reference - https://github.com/ViacomInc/openap-inventory-manager/blob/399bc6a09d7a77ecb0c17d5263e54401cc9d4e51/src/db/config.ts
  interceptors: [
    createQueryLoggingInterceptor(),
    {
      // slonik may warn "unsupportedOptions":{"schema":"public"}}" (unsupported DSN parameter)
      // the default schema can be enforced via the following query which executes after each connection is established
      afterPoolConnection: async (_connectionContext, connection) => {
        // @see https://www.postgresonline.com/article_pfriendly/279.html for nuances regarding search_path
        await connection.query(sqlx.typeAlias('null')`
          CREATE SCHEMA IF NOT EXISTS public;
          SET search_path TO public;

          SET TIME ZONE 'UTC';
        `)

        return null
      },
    },
    createFieldNameTransformationInterceptor({
      format: 'CAMEL_CASE',
    }),
    createResultParserInterceptor(),
    createQueryLoggingInterceptor(),
  ],

  // use the default type parser presets with overrides for json, timestamp, and timestamptz
  // slonik's default behaviour for timestamp and timestamptz is to convert to js timestamp (milliseconds)
  //
  // @see typeParsers for example of configuring your own type parser configuration
  // @see type-parsers.ts for common type parsers
  typeParsers: [
    ...createTypeParserPreset(),
    {
      name: 'json',
      parse: (value: string): string => value,
    },
    {
      name: 'timestamp',
      parse: (value: string | null): string | null => value,
    },
    {
      name: 'timestamptz',
      parse: (value: string | null): string | null => value,
    },
    // example of the default node-pg behaviour which parses timestamptz to Date:
    // {
    //   name: 'timestamptz',
    //   parse: (str) => new Date(str),
    // },
  ],
}
