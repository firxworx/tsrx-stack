import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { expand as dotenvExpand } from 'dotenv-expand'
import { z } from 'zod'

import { zEnvBoolean, zPort } from '@rfx/common-toolbox'
import { DEFAULT_PORT, IS_PRODUCTION } from './constants'
import { createLoadEnv } from '@rfx/node-core'

/*
 * In development Nx will automatically resolve .env files in the app folder and root of the workspace.
 *
 * For production: any .env file in the path of the process working directory is conditionally loaded.
 * Ensure the host environment is configured such that all required environment variables are defined.
 */

const envPath = path.resolve(process.cwd(), '.env')

const dotenvVars = dotenv.config({
  path: IS_PRODUCTION && fs.existsSync(envPath) ? envPath : undefined,
})

/**
 * dotenv-expand supports variable expansion in .env files.
 *
 * This is useful for specifying the DB_URL when using an infrastructure service that provides each part
 * of a connection string as separate environment variable (e.g. AWS RDS + aws-cdk among others).
 */
dotenvExpand(dotenvVars)

/**
 * Object map (dictionary) of environment variables.
 */
export type EnvDict = z.infer<typeof zApiEnv>

/**
 * Zod schema representing environment variables required by the API.
 *
 * Setting 'sslmode=require' in the `DB_URL` is highly recommended (and may be required by providers
 * such as Neon Postgres) however it is not enforced by this schema to support flexibility.
 */
export const zApiEnv = z.object(
  {
    NODE_ENV: z.string(),

    DB_URL: z.string(),

    CORS_ORIGIN: z.string(),
    TRUST_PROXY: zEnvBoolean,

    HOST: z.string().optional(),
    PORT: zPort.default(DEFAULT_PORT),

    COOKIE_DOMAIN: z.string().optional(),
    COOKIE_SECRET: z.string().min(32),

    // uncomment if using jwt in the app
    // JWT_SECRET: z.string().min(32),

    SESSION_SECRET: z.string().min(32),
    SESSION_DURATION_MINUTES: z.coerce
      .number()
      .min(1)
      .max(365 * 24 * 60),

    // uncomment if deploying to aws
    // AWS_REGION: z.string(),
  },
  { description: 'Required environment variables' },
)

export const loadEnv = createLoadEnv(zApiEnv)
