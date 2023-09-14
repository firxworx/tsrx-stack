import { type RouterOptions, initContract } from '@ts-rest/core'
import { z } from 'zod'

import { zContractErrorResponse } from '../../z-response-schemas'

// Post is based on example from the ts-rest repo
export interface Post extends z.infer<typeof zPost> {}

export const BLOG_POSTS_CONTRACT_PATH_PREFIX = '/posts'

export const zPost = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string().nullable(),
  published: z.boolean(),
  tags: z.array(z.string()),
})

const c = initContract()

const routerOptions: RouterOptions<typeof BLOG_POSTS_CONTRACT_PATH_PREFIX> = {
  pathPrefix: BLOG_POSTS_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
  // baseHeaders: z.object({
  //   'x-api-key': z.string(),
  // }),
}

export const blogPostsContract = c.router(
  {
    createPost: {
      method: 'POST',
      path: '/',
      responses: {
        201: zPost,
        400: zContractErrorResponse,
      },
      body: z.object({
        title: z.string().transform((v) => v.trim()),
        content: z.string(),
        published: z.boolean().optional(),
        description: z.string().optional(),
      }),
      summary: 'Create a post',
      metadata: { roles: ['user'] } as const,
    },
    updatePost: {
      method: 'PATCH',
      path: `/:id`,
      responses: { 200: zPost, 400: zContractErrorResponse, 404: zContractErrorResponse, 500: zContractErrorResponse },
      body: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
        description: z.string().optional(),
      }),
      summary: 'Update a post',
      metadata: {
        roles: ['user'],
        resource: 'post',
        identifierPath: 'params.id',
      } as const,
    },
    deletePost: {
      method: 'DELETE',
      path: `/:id`,
      responses: {
        200: zContractErrorResponse,
        404: zContractErrorResponse,
      },
      body: z.object({}), // @todo @temp workaround for https://github.com/ts-rest/ts-rest/issues/383
      summary: 'Delete a post',
      metadata: {
        roles: ['user'],
        resource: 'post',
        identifierPath: 'params.id',
      } as const,
    },
    getPost: {
      method: 'GET',
      path: `/:id`,
      responses: {
        200: zPost,
        404: z.null(),
      },
      query: null,
      summary: 'Get a post by id',
      metadata: { roles: ['guest', 'user'] } as const,
    },
    getPosts: {
      method: 'GET',
      path: '/',
      responses: {
        200: z.object({
          posts: zPost.array(),
          count: z.number(),
          skip: z.number(),
          take: z.number(),
        }),
      },
      query: z.object({
        take: z.string().transform(Number).optional(),
        skip: z.string().transform(Number).optional(),
        search: z.string().optional(),
      }),
      summary: 'Get all posts',
      headers: z.object({
        'x-pagination': z.coerce.number().optional(),
      }),
      metadata: { roles: ['guest', 'user'] } as const,
    },

    // commented-out example from ts-rest repo
    // testPathParams: {
    //   method: 'GET',
    //   path: '/test/:id/:name',
    //   pathParams: z.object({
    //     id: z
    //       .string()
    //       .transform(Number)
    //       .refine((v) => Number.isInteger(v), {
    //         message: 'Must be an integer',
    //       }),
    //   }),
    //   query: z.object({
    //     field: z.string().optional(),
    //   }),
    //   responses: {
    //     200: z.object({
    //       id: z.number().lt(1000),
    //       name: z.string(),
    //       defaultValue: z.string().default('hello world'),
    //     }),
    //   },
    //   metadata: { roles: ['guest', 'user'] } as const,
    // },
  },
  routerOptions,
)
