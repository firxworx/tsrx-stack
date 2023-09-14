import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleIcon } from 'lucide-react'

import { Post } from '../components/features/blog/Post'

export function PostPage(): JSX.Element {
  const { id } = useParams()

  return (
    <div>
      <aside className="flex justify-between items-center mb-4">
        <Link
          to="/"
          className="inline-flex gap-1 leading-none items-center no-underline font-semibold hover:underline text-sky-800"
        >
          <ArrowLeftCircleIcon className="w-4 h-4" aria-hidden="true" />
          <span className="inline-block pb-0.5">All Posts</span>
        </Link>
      </aside>
      <article>{id?.trim().length ? <Post postId={id} /> : <div>No post found.</div>}</article>
    </div>
  )
}
