import { type RouterOptions, initContract } from '@ts-rest/core'
import { z } from 'zod'

import { zContractErrorResponse, zContractMessageResponse } from '../../z-response-schemas'
import { zAuthPasswordCredentials, zUserDto } from '@rfx/common-data'

export const AUTH_CONTRACT_PATH_PREFIX = '/auth'

// @future add a `code` or `tag` to standardize key names in errors + messages (plus assists with i18n)

const c = initContract()

const routerOptions: RouterOptions<typeof AUTH_CONTRACT_PATH_PREFIX> = {
  pathPrefix: AUTH_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

const zAuthHeader = z.object({
  Authorization: z.string().optional(),
})

// references:
// https://github.com/ninofaivre/transcendence/blob/master/contract/src/routers/auth.ts
// https://github.com/fastify/example/blob/master/fastify-session-authentication/authentication.js
// https://github.com/felamaslen/budget/blob/690f8b3af45d6ebca6090296055ab845828f12b9/src/api/modules/auth.ts#L7 (express-session)
// https://github.com/alan-hadyk/side-stacker-game/tree/main/server slonik
//   // neat manual migrations implementation https://github.com/alan-hadyk/side-stacker-game/blob/main/server/src/db/scripts/dbMigrations.ts
//   // https://github.com/alan-hadyk/side-stacker-game/blob/main/server/src/db/utils/tables/migrationTable.ts
//   // there's another example on github where someone does a custom umzog implementation
//
// https://github.com/Pictogrammers/pictogrammers.com/blob/main/api/endpoints/auth/getLogout.ts github auth with fastify-session
//    // also oauth2 https://github.com/Pictogrammers/pictogrammers.com/blob/main/api/types/fastify.d.ts
// https://github.com/fastify/session

/**
 * Auth contract definition for ts-rest.
 *
 * @future consider adding `metadata` to share required roles between the contract, api implementation, and client.
 */
export const authContract = c.router(
  {
    signIn: {
      method: 'POST',
      path: '/',
      responses: {
        200: zUserDto,
        401: zContractErrorResponse,
        400: zContractErrorResponse,
      },
      body: zAuthPasswordCredentials,
      headers: zAuthHeader,
      summary: 'Public user sign-in',
      description: 'Sign-in user and initiate an authenticated session',
    },
    signOut: {
      method: 'DELETE',
      path: '/',
      responses: {
        200: zContractMessageResponse,
        401: zContractErrorResponse,
      },
      body: z.object({}), // @todo @temp workaround for https://github.com/ts-rest/ts-rest/issues/383
      summary: 'Sign out',
      description: 'Sign out of the current session and clear the auth cookie.',
    },
    session: {
      method: 'GET',
      path: '/session',
      responses: {
        200: zUserDto,
        401: zContractErrorResponse,
      },
      query: null,
      summary: "Retrieve user's session profile if authenticated",
      description:
        "Retrieve the authenticated user's session (session profile data) or respond with 401 if authentication is missing or invalid.",
    },
    // register: {
    //   method: 'POST',
    //   path: '/register',
    //   responses: {
    //     201: zUserDto,
    //     400: zContractErrorResponse,
    //   },
    //   body: zAuthRegisterDto,
    //   summary: 'Public user registration',
    //   description: 'Register a new user',
    //   headers: zAuthHeader,
    //   // metadata: { roles: ['user', 'guest'] } as const,
    // },
    // verify: {
    //   method: 'POST',
    //   path: '/verify/:token',
    //   body: zAuthEmailVerificationDto,
    //   responses: createContractResponses({
    //     200: c.otherResponse({
    //       contentType: 'text/html',
    //       body: c.type<string>(),
    //     }),
    //   }),
    //   headers: zAuthHeader,
    //   summary: 'Verify user email',
    //   description: "Verify user's email address to confirm new user registration.",
    // },
  },
  routerOptions,
)
