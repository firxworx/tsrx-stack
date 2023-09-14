import * as path from 'path'

import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import AutoLoad from '@fastify/autoload'

import { loadEnv } from './config/environment'

export interface AppOptions {}

const ENV = loadEnv()

/**
 * Configure the fastify app: load all plugins and routes.
 */
export async function app(fastify: FastifyInstance, opts: AppOptions): Promise<void> {
  // @see ts-rest issue #383 -- issue w/ ts-rest client and fastify content type parser issue re empty body w/ JSON
  fastify.log.info({ message: 'App initialization started' })

  // configure cors as priority before autoloading other plugins
  // https://github.com/fastify/fastify-cors
  fastify.register(cors, {
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })

  // autoload all plugins defined under app/plugins
  fastify.log.info({ message: 'Autoloading plugins...' })
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  })
  fastify.log.info({ message: 'Plugins loaded.' })

  // autoload all route handlers under app/routes
  // routes related to ts-rest contract implementations are registered in `app/routes/contracts.ts`
  fastify.log.info({ message: 'Autoloading routes...' })
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  })
  fastify.log.info({ message: 'Routes loaded.' })

  // an alternative to the approach of autoloading ts-rest contracts is manual registration of routes
  // s.registerRouter(apiCombinedFastifyContract, contractsRouter, fastify, {
  //   logInitialization: true,
  // })

  // fastify.setErrorHandler(requestValidationErrorHandler(options.requestValidationErrorHandler))
}

// to customize error handling in fastify with ts-rest:
// note that inititServer().registerRouter()'s requestValidationErrorHandler option is equivalent to calling
// fastify.setErrorHandler(requestValidationErrorHandler(options.requestValidationErrorHandler))
//
// @see https://github.com/ts-rest/ts-rest/libs/ts-rest/fastify/src/lib/ts-rest-fastify.ts
// @see https://ts-rest.com/docs/fastify/
