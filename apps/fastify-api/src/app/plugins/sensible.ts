import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import sensible from '@fastify/sensible'

/**
 * Add the fastify-sensible plugin which provides utilities to handle http errors.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(
  async function (fastify: FastifyInstance) {
    fastify.register(sensible)
  },
  {
    name: '@fastify/sensible',
  },
)
