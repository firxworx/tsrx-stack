import { type RouterOptions, initContract } from '@ts-rest/core'
import { zCreateUserDto, zUidDto, zUpdateUserDto, zUserDto } from '@rfx/common-data'
import { z } from 'zod'
import { zContractErrorResponse, zContractMessageResponse } from '../../z-response-schemas'

export const USERS_CONTRACT_PATH_PREFIX = '/users'

const c = initContract()

const routerOptions: RouterOptions<typeof USERS_CONTRACT_PATH_PREFIX> = {
  strictStatusCodes: true,
  pathPrefix: USERS_CONTRACT_PATH_PREFIX,
}

/**
 * Users contract.
 *
 * - ts-rest `metadata` is defined to provide an example however it is not currently used in the implementation
 */
export const usersContract = c.router(
  {
    create: {
      method: 'POST',
      path: '/',
      responses: {
        201: zUserDto,
        400: zContractErrorResponse,
        409: zContractErrorResponse,
      },
      body: zCreateUserDto,
      summary: 'Create a user',
      metadata: { roles: ['user'] } as const,
    },
    update: {
      method: 'PATCH',
      path: '/:uid',
      pathParams: zUidDto,
      responses: {
        200: zUserDto,
        400: zContractErrorResponse,
        404: zContractErrorResponse,
        409: zContractErrorResponse,
        500: zContractErrorResponse,
      },
      body: zUpdateUserDto,
      summary: 'Update a user',
      metadata: {
        resource: 'user',
        identifierPath: 'params.uid',
        roles: ['user'],
      } as const,
    },
    delete: {
      method: 'DELETE',
      path: '/:uid',
      pathParams: zUidDto,
      responses: {
        200: zContractMessageResponse,
        404: zContractErrorResponse,
      },
      body: z.object({}), // @todo @temp workaround for https://github.com/ts-rest/ts-rest/issues/383
      summary: 'Delete a user',
      metadata: {
        resource: 'user',
        identifierPath: 'params.uid',
        roles: ['user'],
      } as const,
    },
    getOne: {
      method: 'GET',
      path: '/:uid',
      responses: {
        200: zUserDto,
        404: z.null(),
      },
      query: null,
      summary: 'Get a user by UID',
      metadata: { roles: ['guest', 'user'] } as const,
    },
    getMany: {
      method: 'GET',
      path: '/',
      responses: {
        200: zUserDto.array(),
      },
      // query: z.object({
      //   take: z.string().transform(Number).optional(),
      //   skip: z.string().transform(Number).optional(),
      //   search: z.string().optional(),
      // }),
      summary: 'Get users',
      // headers: z.object({
      //   'x-pagination': z.coerce.number().optional(),
      // }),
      metadata: { roles: ['guest', 'user'] } as const,
    },
  },
  routerOptions,
)
