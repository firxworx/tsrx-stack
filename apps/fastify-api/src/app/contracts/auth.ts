import { initServer } from '@ts-rest/fastify'
import type { FastifyRequest } from 'fastify'

// import { InvalidInputError, UniqueIntegrityConstraintViolationError } from 'slonik'

import {
  apiContract,
  buildMessageResponse,
  buildSafeUserDtoResponse,
  getUnauthorizedResponse,
} from '@rfx/common-contracts'
import { createAuthService, createUserRepository } from '@rfx/database-manager'

import { getFastifySlonikDatabasePool } from '../plugins/slonik'
import { AuthUserSessionDao, mapUserDaoToAuthUserSessionDao } from '@rfx/common-data'

const s = initServer()

export function isAuthenticated(
  request: FastifyRequest,
): request is FastifyRequest & { session: { id: string; data: { user: AuthUserSessionDao } } } {
  return !!request?.session?.id && !!request?.session?.data?.user?.email
}

export const authRouter = s.router(apiContract.auth, {
  session: async ({ request }) => {
    return isAuthenticated(request) ? buildSafeUserDtoResponse(request.session.data.user) : getUnauthorizedResponse()
  },
  signIn: async ({ request, body }) => {
    const pool = getFastifySlonikDatabasePool()

    const userRepository = createUserRepository(pool)
    const authService = createAuthService(userRepository)

    try {
      const userDao = await authService.authenticate(body)

      if (!userDao) {
        return getUnauthorizedResponse()
      }

      // saving the session persists it to the store and sets the cookie response header
      request.session.set('user', mapUserDaoToAuthUserSessionDao(userDao))
      await request.session.save()

      return buildSafeUserDtoResponse(userDao)
    } catch (error: unknown) {
      request.log.error(error, `Failed to authenticate user via email and password: ${body.email}`)
      throw error
    }
  },
  signOut: async ({ request }) => {
    try {
      if (request?.session?.id) {
        await request.session.destroy()
      }

      // return a success response even if no session (arguably/technically the request was successful)
      return buildMessageResponse('Signed out')
    } catch (error: unknown) {
      request.log.error(
        error,
        `Failed to destroy session ${request?.session?.id} of user ${request?.session?.data?.user?.email} `,
      )
      throw error
    }
  },
})
