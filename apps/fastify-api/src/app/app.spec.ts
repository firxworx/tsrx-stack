import Fastify, { FastifyInstance } from 'fastify'
import { app } from './app'

/**
 * Unit tests with fastify + jest that leverage `fastify.inject()` are generally suitable for testing individual
 * plugins and routes in isolation.
 *
 * For more realistic tests use the `fastify-api-e2e` project in this Nx workspace.
 *
 * Run the tests in this app by executing the following command:
 *
 * ```sh
 * pnpm nx test fastify-api
 * ```
 */
describe('GET /', () => {
  let server: FastifyInstance

  beforeEach(() => {
    server = Fastify()
    server.register(app)
  })

  it('is a dummy test', () => {
    expect(true).toBe(true)
  })

  // this boilerplate test will now halt and fail because the app now autoloads plugins and routes
  //
  // it('should respond with a message', async () => {
  //   const response = await server.inject({
  //     method: 'GET',
  //     url: '/',
  //   })

  //   expect(response.json()).toEqual({ message: 'Hello API' })
  // })
})
