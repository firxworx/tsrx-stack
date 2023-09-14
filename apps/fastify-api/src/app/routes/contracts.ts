import { type FastifyInstance } from 'fastify'
import { initServer } from '@ts-rest/fastify'
import { apiContract } from '@rfx/common-contracts'

import { authRouter } from '../contracts/auth'
import { usersRouter } from '../contracts/users'
import { blogPostsRouter } from '../contracts/blog-posts'

/**
 * Implementation (aka ts-rest "router") of the ts-rest contract.
 * Routes under `app/routes/` are autoloaded using the fastify AutoLoad plugin configuration in `app.ts`.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
  const s = initServer()

  const contractsRouter = s.router(apiContract, {
    auth: authRouter.routes,
    users: usersRouter.routes,
    posts: blogPostsRouter.routes,
  })

  fastify.log.info('loading ts-rest contracts router')
  fastify.register(s.plugin(contractsRouter))
}
