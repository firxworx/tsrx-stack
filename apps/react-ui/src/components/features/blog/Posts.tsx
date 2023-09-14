import { Link } from 'react-router-dom'

import { apiQuery } from '../../../api/query-client'
import { cn } from '@rfx/react-core'

/**
 * Query and display a a list of blog posts.
 * This component demonstrates react-query's useInfiniteQuery hook via the ts-rest query client.
 */
export function Posts(): JSX.Element {
  const PAGE_SIZE = 5

  const { isLoading, isError, data, hasNextPage, fetchNextPage } = apiQuery.posts.getPosts.useInfiniteQuery(
    ['posts'],
    ({ pageParam = { skip: 0, take: PAGE_SIZE } }) => ({
      query: {
        skip: pageParam.skip,
        take: pageParam.take,
      },
    }),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.status === 200
          ? lastPage.body.count > allPages.length * PAGE_SIZE
            ? { take: PAGE_SIZE, skip: allPages.length * PAGE_SIZE }
            : undefined
          : undefined,
      networkMode: 'offlineFirst',
      staleTime: 1000 * 5,
    },
  )

  if (isLoading && !isError) {
    return <div>Loading&hellip;</div>
  }

  if (!isLoading && !data) {
    return <div>No posts found</div>
  }

  const posts = data.pages.flatMap((page) => (page.status === 200 ? page.body.posts : []))

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            to={`/posts/${post.id}`}
            key={post.id}
            className={cn(
              'group block border w-full transition-colors rounded-md',
              'cursor-pointer',
              'border-slate-200 hover:border-slate-300 p-4 bg-white shadow-sm',
            )}
          >
            <div className="flex flex-row justify-between mb-4">
              <h2
                className={cn(
                  'text-xl font-medium tracking-tighter text-sky-900 transition-all',
                  'group-hover:underline',
                )}
              >
                {post.title}
              </h2>
              <div>
                <div className="avatar placeholder">
                  <div className="flex items-center justify-center bg-slate-200 rounded-full w-8 h-8">
                    <span className="text-xs">XX</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 mb-6">{post.description}?</p>
            <div className="flex justify-end flex-wrap gap-2 text-xs">
              {post.tags.map((tag) => (
                <div key={tag} className="rounded-lg px-2 py-2 bg-slate-200">
                  {tag}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <button
          disabled={!hasNextPage}
          className={cn('px-3 py-2 rounded-md', 'bg-sky-800 hover:bg-sky-900 transition-colors text-white', {
            'btn-disabled': !hasNextPage,
          })}
          onClick={() => fetchNextPage()}
        >
          Load More&hellip;
        </button>
      </div>
    </div>
  )
}
