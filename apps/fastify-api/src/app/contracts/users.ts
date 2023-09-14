import { initServer } from '@ts-rest/fastify'
import { InvalidInputError, UniqueIntegrityConstraintViolationError } from 'slonik'

import { apiContract } from '@rfx/common-contracts'
import { createUserRepository } from '@rfx/database-manager'
import { getFastifySlonikDatabasePool } from '../plugins/slonik'
import type { Mutable } from '@rfx/common-toolbox'
import { stringifyKeyValueDto } from '@rfx/database-slonik'

const s = initServer()

export const usersRouter = s.router(apiContract.users, {
  getMany: async () => {
    const pool = getFastifySlonikDatabasePool()
    const userFunctions = createUserRepository(pool)

    const users = await userFunctions.getMany()

    return {
      status: 200,
      body: users as Mutable<typeof users>,
    }
  },
  create: async ({ request, body }) => {
    const pool = getFastifySlonikDatabasePool()
    const userRepository = createUserRepository(pool)

    try {
      const user = await userRepository.create(body)

      return {
        status: 201,
        body: user,
      }
    } catch (error: unknown) {
      if (error instanceof UniqueIntegrityConstraintViolationError) {
        request.log.warn(`Failed to create user: unique violation`, error)

        return {
          status: 409,
          body: {
            message: `Conflict: user already exists`,
          },
        }
      }

      request.log.error(error, `Failed to create user ${body.email}`)
      throw error
    }
  },
  update: async ({ request, body, params: { uid } }) => {
    const pool = getFastifySlonikDatabasePool()
    const userRepository = createUserRepository(pool)

    try {
      const user = await userRepository.update(Object.assign({ uid }, body))

      return {
        status: 200,
        body: user,
      }
    } catch (error: unknown) {
      if (error instanceof UniqueIntegrityConstraintViolationError) {
        request.log.warn(`Failed to update user: unique violation`, error)

        return {
          status: 409,
          body: {
            message: `Conflict: user already exists`,
          },
        }
      }

      if (error instanceof InvalidInputError) {
        return {
          status: 400,
          body: {
            message: `Bad request: ${error.message}`,
          },
        }
      }

      request.log.error(error)
      throw error
    }
  },
  delete: async ({ request, params }) => {
    const pool = getFastifySlonikDatabasePool()
    const userRepository = createUserRepository(pool)

    const user = await userRepository.delete(params)

    if (!user) {
      request.log.warn(`Failed to delete user: ${stringifyKeyValueDto(params)} not found`)

      return {
        status: 404,
        body: {
          message: 'Not found',
        },
      }
    }

    request.log.info(`User deleted: ${stringifyKeyValueDto(params)}`)

    // ts-rest + fastify has an issue sending empty response body for 204 (no-content) responses
    // refer to "content type parsers" in the fastify docs for further insights
    return {
      status: 200,
      body: {
        message: 'User deleted',
      },
    }
  },
  getOne: async ({ request, params: { uid } }) => {
    const pool = getFastifySlonikDatabasePool()
    const userRepository = createUserRepository(pool)

    const user = await userRepository.find({ uid })

    if (!user) {
      request.log.warn(`Failed to retrieve user: uid ${uid} not found`)

      return {
        status: 404,
        body: null,
      }
    }

    return {
      status: 200,
      body: user,
    }
  },
})
