import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'

import { apiQuery } from '../../../api/query-client'
import { Spinner, cn } from '@rfx/react-core'

export interface PostProps {
  postId: string
}

/**
 * Query and display a single blog post.
 */
export function Post({ postId }: PostProps): JSX.Element | null {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, error, isLoading } = apiQuery.posts.getPost.useQuery(
    ['posts', postId],
    {
      params: { id: postId },
    },
    {
      networkMode: 'offlineFirst',
      enabled: postId !== undefined,
      staleTime: 1000 * 60 * 30,
    },
  )

  const { mutate: deletePost } = apiQuery.posts.deletePost.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      navigate('/')
    },
  })

  if (error) {
    return (
      <div className="prose w-full h-full flex flex-row justify-center items-center">
        <div>
          <h1>Post not found.</h1>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-row justify-center items-center">
        <div className="flex gap-4">
          <Spinner />
          <span>Loading&hellip;</span>
        </div>
      </div>
    )
  }

  const post = data.body

  return post ? (
    <div className="prose max-w-none mx-auto px-2 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl mb-2 font-bold tracking-tighter">{post.title}</h1>
          <h3 className="text-xl font-medium tracking-tight">{post.description}</h3>
        </div>
      </div>
      <p>{post.content}</p>
      <div className="flex flex-row gap-2 mt-8">
        <button
          className={cn(
            'inline-flex gap-1 px-3 py-2 items-center border rounded-md',
            'text-sm font-semibold',
            'border-red-800 text-red-900 hover:bg-red-50 transition-colors',
          )}
          onClick={() =>
            deletePost({
              params: { id: post.id },
              body: {}, // @todo @temp workaround for https://github.com/ts-rest/ts-rest/issues/383
            })
          }
        >
          <XIcon className="w-3 h-3" aria-hidden="true" />
          <span className="inline-block pb-0.5 leading-none">Delete Post</span>
        </button>
        {/*
          // not implementing for this example
          <Link to={`/post/${post.id}/edit`}>
            <button className="btn">Edit</button>
          </Link>
        */}
      </div>
    </div>
  ) : null
}
