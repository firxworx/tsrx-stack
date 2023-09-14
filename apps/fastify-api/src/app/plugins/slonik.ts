import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import { requestContext } from '@fastify/request-context'
import type { DatabasePool } from 'slonik'

import { getDatabasePool } from '@rfx/database-slonik'
import { loadEnv } from '../config/environment'

declare module 'fastify' {
  export interface FastifyInstance {
    slonik: DatabasePool
  }
}

declare module '@fastify/request-context' {
  interface RequestContextData {
    slonik: DatabasePool
  }
}

const ENV = loadEnv()

/**
 * This plugin provides an instance of the slonik-powered postgres database pool to fastify.
 *
 * Plugins can access the an instance of the pool via `fastify.slonik`.
 * Route handlers and ts-rest contract implementations can call `getFastifySlonikDatabasePool()` to get the pool.
 *
 * Add `fx-fastify-slonik` to the `dependencies` array of any plugins that depend on slonik.
 *
 * @see https://fastify.dev/docs/latest/Reference/Plugins/
 * @see https://github.com/fastify/fastify-plugin
 * @see https://github.com/gajus/postgres-bridge for an option to wrap the postgres API in a pg compatible API
 * @see https://github.com/sebinsua/modern-node-app/blob/main/workspaces/core/slonikConnection/slonikFastifyPlugin.ts
 */
export default fp(
  async function (fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> {
    try {
      // the following calls slonik's createPool with the connection string from env and project default client config
      const pool: DatabasePool = await getDatabasePool(ENV.DB_URL)

      // decorate the fastify instance to make the pool available to other plugins as `fastify.slonik`
      fastify.decorate('slonik', pool)

      // close the pool when fastify closes
      fastify.addHook('onClose', async () => {
        await pool.end()
      })

      // add the slonik pool to the request context per `@fastify/request-context`
      fastify.addHook('onRequest', (request, _, done) => {
        request.requestContext.set('slonik', pool)
        done()
      })

      // test viability of the connection pool and log and exit if there is a problem
      try {
        await pool.connect(async (_connection) => {
          fastify.log.info(`slonik pool connected to postgres database`)
        })
      } catch (error: unknown) {
        fastify.log.fatal(error)

        await pool.end()
        await fastify.close()

        process.exit(1)
      }
    } catch (error: unknown) {
      fastify.log.error(error)
    }
  },
  {
    name: 'fx-fastify-slonik',
    dependencies: ['@fastify/request-context'],
    fastify: '4.x',
  },
)

/**
 * Get the slonik database pool from the request context.
 *
 * This function can be called in route handlers and ts-rest contract implementations to get the database pool.
 * Plugins can access the pool via `fastify.slonik`.
 */
export function getFastifySlonikDatabasePool(): DatabasePool {
  const pool = requestContext.get('slonik')

  if (!pool) {
    throw new Error('DatabasePool (slonik) not found in request context')
  }

  return pool
}
