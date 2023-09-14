import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import cookie from '@fastify/cookie'
import fastifySession from '@mgcrea/fastify-session'
import { SODIUM_AUTH } from '@mgcrea/fastify-session-sodium-crypto'
import SlonikPgSessionStore from '@firx/fastify-session-slonik-store'

import { loadEnv } from '../config/environment'
import type { AuthUserSessionDao } from '@rfx/common-data'

declare module '@mgcrea/fastify-session' {
  interface SessionData {
    user: AuthUserSessionDao | undefined
  }
}

const ENV = loadEnv()

/**
 * This plugin handles authentication for the app.
 * Refer to the accompanying implementation of the ts-rest _auth_ contract in `app/contracts/auth.ts`.
 */
export default fp(
  async function (fastify: FastifyInstance) {
    const pool = fastify.slonik

    // uncomment if using jwt for auth
    // fastify.register(jwt, {
    //   secret: ENV.JWT_SECRET,
    // })

    fastify.log.info(`NODE ENV IS: ${ENV.NODE_ENV}`)

    // https://github.com/fastify/fastify-cookie
    fastify.register(cookie, {
      secret: [ENV.COOKIE_SECRET], // support signed cookies
      hook: 'onRequest',
      parseOptions: {
        domain: ENV.COOKIE_DOMAIN || undefined,
        secure: ENV.NODE_ENV === 'production',
        httpOnly: ENV.NODE_ENV === 'production',
        sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    })

    // https://github.com/mgcrea/fastify-session
    fastify.register(fastifySession, {
      cookieName: 'session',
      saveUninitialized: false,

      // ensure httponly cookie is used for auth
      cookie: {
        domain: ENV.COOKIE_DOMAIN || undefined,
        path: '/',
        secure: ENV.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: ENV.NODE_ENV === 'strict',
        maxAge: ENV.SESSION_DURATION_MINUTES * 60,
      },

      // to use redis sessions check out @mgcrea/fastify-session-redis-store
      store: new SlonikPgSessionStore<{ user: AuthUserSessionDao }>({
        pool,
        tableIdentifier: ['public', 'session'],
        ttlSeconds: ENV.SESSION_DURATION_MINUTES * 60,
      }),

      // for signed sessions using @mgcrea/fastify-session-sodium-crypto
      // the `key` must be min 32 bytes (256 bits) and base64 encoded (vs. `secret` which a key is derived from)
      key: Buffer.from(ENV.SESSION_SECRET, 'base64'),
      crypto: SODIUM_AUTH,
    })
  },
  {
    name: 'fx-auth',
    dependencies: ['@fastify/request-context', 'fx-fastify-slonik'],
    fastify: '4.x',
  },
)
