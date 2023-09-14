import { createPool } from 'slonik'
import type { ClientConfiguration, DatabasePool } from 'slonik'

import { throwIfNullish } from '@rfx/common-toolbox'
import { DEFAULT_SLONIK_POOL_CONFIG } from './config'

/**
 * Singleton record for storing Slonik database pools by connection URI.
 */
const pools: Record<string, DatabasePool> = {}

/**
 * Return a slonik `DatabasePool` as a singleton created using the provided connection URI.
 * If a custom client configuration is not provided the project's default configuration is used.
 */
export async function getDatabasePool(
  connectionUri: string,
  clientConfig?: Partial<ClientConfiguration>,
): Promise<DatabasePool> {
  return createSlonikPoolSingleton(connectionUri, clientConfig)
}

/**
 * End the slonik `DatabasePool` singleton associated with the given connection URI.
 * If no pool is found for the connection URI then no action is taken.
 */
export async function endDatabasePool(connectionUri: string): Promise<void> {
  const pool = await getDatabasePool(connectionUri)

  if (!pool) {
    return
  }

  await pool.end()
  return
}

/**
 * Return a slonik `DatabasePool` as a singleton created using the provided connection URI.
 *
 * If a custom client configuration is not provided the project's default configuration is used.
 *
 * The default configuration defines common type parsers + interceptors and includes a field name
 * transformation interceptor that maps lower_snake_case fields in query results to camelCase per
 * TypeScript convention.
 */
export async function createSlonikPoolSingleton(
  connectionUri: string,
  clientConfig: Partial<ClientConfiguration> = DEFAULT_SLONIK_POOL_CONFIG,
): Promise<DatabasePool> {
  if (!pools[connectionUri]) {
    const pool = await createPool(connectionUri, clientConfig)

    pools[connectionUri] = pool
  }

  return throwIfNullish(pools[connectionUri])
}
