import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { fastifyRequestContext } from '@fastify/request-context'

/**
 * This plugin configures @fastify/request-context to add thread-local request-scoped http context.
 *
 * Any variables set within the scope of a single http call won't be overwritten by simultaneous calls
 * to the api nor will variables remain available once a request has completed.
 *
 * Common use-cases for request-context include persisting request-aware logger instances and
 * persisting user authorization data for the duration of a request.
 *
 * @see https://www.npmjs.com/package/@fastify/request-context
 * @see https://github.com/sebinsua/modern-node-app for examples of using request-context
 */
export default fp(
  async function (fastify: FastifyInstance) {
    fastify.register(fastifyRequestContext, {})
  },
  {
    name: '@fastify/request-context',
  },
)
