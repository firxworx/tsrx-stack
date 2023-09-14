import type { ExtractZodSchemaType, ZodSchemaEnv } from '@rfx/common-toolbox'

/**
 * Singleton for caching environment variables that have been parsed by a zod schema by
 * calling the "loadEnv" function returned by the `createLoadEnv()` factory.
 *
 * @see createLoadEnv
 */
let ENV: {
  [x: string]: unknown
}

/**
 * Factory that returns a function that parses `process.env` using the given zod schema and caches the
 * result in-memory for subsequent calls using the singleton pattern.
 *
 * This function helps ensure that API's read and parse environment variables only once at startup.
 *
 * Ensure that the calling app runs `dotenv` and/or `dotenv-expand` as required to populate `process.env`
 * as required prior to calling this function.
 *
 * @param zodEnvSchema schema for required environment variables
 * @returns zod-parsed environment variables
 */
export function createLoadEnv<ZodSchema extends ZodSchemaEnv>(
  zodEnvSchema: ZodSchema,
): () => ExtractZodSchemaType<ZodSchema> {
  return function loadEnv(): ExtractZodSchemaType<ZodSchema> {
    if (!ENV) {
      ENV = zodEnvSchema.parse(process.env)
    }

    return ENV as ExtractZodSchemaType<ZodSchema>
  }
}
