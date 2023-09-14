import { initServer } from '@ts-rest/fastify'

import { apiContract, type Post, mockPostFixtureFactory, zPost } from '@rfx/common-contracts'
import { ZodError } from 'zod'

const DEFAULT_SKIP = 0
const DEFAULT_TAKE = 5

const s = initServer()

const RANDOM_POSTS: Post[] = Array.from({ length: 100 }, () => mockPostFixtureFactory())

export const blogPostsRouter = s.router(apiContract.posts, {
  getPost: async ({ params: { id } }) => {
    const post = RANDOM_POSTS.find((post) => post.id === id)

    if (!post) {
      return {
        status: 404,
        body: null,
      }
    }

    return {
      status: 200,
      body: post,
    }
  },
  getPosts: async ({ query }) => {
    const skip = query.skip ?? DEFAULT_SKIP
    const take = query.take ?? DEFAULT_TAKE
    const posts = RANDOM_POSTS.slice(skip, skip + take)

    return {
      status: 200,
      body: {
        posts,
        count: RANDOM_POSTS.length,
        skip,
        take,
      },
    }
  },
  createPost: async ({ body }) => {
    const post = mockPostFixtureFactory(body)
    RANDOM_POSTS.push(post)

    return {
      status: 201,
      body: post,
    }
  },
  updatePost: async ({ params: { id }, body }) => {
    const postIndex = RANDOM_POSTS.findIndex((post) => post.id === id)

    if (postIndex === -1) {
      return {
        status: 404,
        body: { message: 'Post not found' },
      }
    }

    try {
      const updatedPost = zPost.parse({ ...RANDOM_POSTS[postIndex], ...body, id })
      RANDOM_POSTS[postIndex] = updatedPost

      return {
        status: 200,
        body: updatedPost,
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return {
          status: 400,
          body: { message: 'Invalid post data' },
        }
      }
    }

    return {
      status: 500,
      body: { message: 'Internal server error' },
    }
  },
  deletePost: async ({ params: { id } }) => {
    const postIndex = RANDOM_POSTS.findIndex((post) => post.id === id)

    if (postIndex === -1) {
      return {
        status: 404,
        body: { message: 'Post not found' },
      }
    }

    RANDOM_POSTS.splice(postIndex, 1)

    // ts-rest + fastify has an issue sending empty response body for 204 (no-content) responses
    // refer to "content type parsers" in the fastify docs for further insights
    return {
      status: 200,
      body: { message: 'Post deleted' },
    }
  },
  // testPathParams: async ({ params }) => {
  //   return {
  //     status: 200,
  //     body: params,
  //   }
  // },
})
