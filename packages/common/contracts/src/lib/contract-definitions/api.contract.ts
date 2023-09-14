import { type RouterOptions, initContract } from '@ts-rest/core'

import { usersContract } from './user/users.contract'
import { blogPostsContract } from './blog/posts.contract'
import { authContract } from './auth/auth.contract'

export const FASTIFY_API_PATH_PREFIX = '/api/v1'

const c = initContract()

const routerOptions: RouterOptions<typeof FASTIFY_API_PATH_PREFIX> = {
  strictStatusCodes: true,
  pathPrefix: FASTIFY_API_PATH_PREFIX,

  // to specify base headers required for all routes:
  // baseHeaders: z.object({ ... })
}

export const apiContract = c.router(
  {
    /** Auth contract */
    auth: authContract,

    /** Blog _Posts_ API Contract */
    posts: blogPostsContract,

    /** Fastify _Users_ API Contract */
    users: usersContract,
  },
  routerOptions,
)
