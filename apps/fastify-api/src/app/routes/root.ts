import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

/**
 * Root route is a traditional fastify route unrelated to ts-rest.
 * This example demonstrates how fastify and ts-rest can coexist and how ts-rest can support incremental adoption.
 *
 * Be aware that fastify's defaults treat routes with trailing slashes as different routes from the same route without
 * a trailing slash. This behaviour is configurable via the `ignoreTrailingSlash` option when initializing fastify.
 *
 * Routes under `app/routes/` are autoloaded using the fastify AutoLoad plugin configuration per `app.ts`.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async function (_request: FastifyRequest, _reply: FastifyReply) {
    return { message: 'Hello API' }
  })
}
