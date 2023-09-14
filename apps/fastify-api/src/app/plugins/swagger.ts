import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import { openApiDocument } from '../../docs'

/**
 * Swagger/OpenAPI plugin for this app that generates Swagger UI docs at `/docs`.
 *
 * @see https://github.com/fastify/fastify-swagger
 * @see https://github.com/fastify/fastify-swagger-ui
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify
    .register(fastifySwagger, {
      swagger: openApiDocument,
    })
    .register(fastifySwaggerUI, {
      routePrefix: '/docs',
    })
})
