import Fastify, { type FastifyInstance } from 'fastify'
import { SlonikError } from 'slonik'
import { z } from 'zod'

import { app } from './app/app'
import { loadEnv } from './app/config/environment'

const ENV = loadEnv()

const HOST = ENV.HOST ?? 'localhost'
const PORT = ENV.PORT ? Number(ENV.PORT) : 3939

// initialize fastify with its default logger (pino)
const fastify: FastifyInstance = Fastify({
  logger: { level: 'info' },
  trustProxy: ENV.TRUST_PROXY,
  ignoreTrailingSlash: true,
})

// ts-rest routes are autoloaded from app/routes/ via fastify AutoLoad (refer to app.ts)
fastify.register(app)

// global error handler to suppress details in unhandled errors from leaking into the response
fastify.setErrorHandler((error, _request, reply) => {
  const errorResponse = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Internal Server Error',
  }

  // ts-rest contracts will handle request vadliation and 400 cases (this is for unhandled errors in the api)
  if (error instanceof z.ZodError) {
    fastify.log.error(error, 'Unhandled internal zod parse error')
    return reply.status(500).send(errorResponse)
  }

  // log database errors with a keyword in the message so they are easier to find in the logs
  if (error instanceof SlonikError) {
    fastify.log.error(error, 'Unhandled internal slonik database error')
    return reply.status(500).send(errorResponse)
  }

  if (error instanceof Error) {
    fastify.log.error(error, 'Unhandled error')
    return reply.status(500).send(errorResponse)
  }

  // pass along any other errors without intervention (may not be suitable for production)
  return reply.send(error)
})

const start = async (): Promise<void> => {
  process.on('unhandledRejection', (error) => {
    console.error(error)
    process.exit(1)
  })

  try {
    await fastify.listen({ host: HOST, port: PORT })
  } catch (error: unknown) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
