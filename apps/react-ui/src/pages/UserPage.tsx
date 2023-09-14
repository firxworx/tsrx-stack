import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleIcon } from 'lucide-react'

import { User } from '../components/features/users/User'

export function UserPage(): JSX.Element {
  const { uid } = useParams()

  return (
    <div>
      <aside className="flex justify-between items-center mb-4">
        <Link
          to="/"
          className="inline-flex gap-1 leading-none items-center no-underline font-semibold hover:underline text-sky-800"
        >
          <ArrowLeftCircleIcon className="w-4 h-4" aria-hidden="true" />
          <span className="inline-block pb-0.5">All Users</span>
        </Link>
      </aside>
      <article>{uid?.trim().length ? <User uid={uid.trim()} /> : <div>No users found.</div>}</article>
    </div>
  )
}
