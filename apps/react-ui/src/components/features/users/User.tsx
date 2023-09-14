import { apiQuery } from '../../../api/query-client'
import { DeleteUserButton } from './UserForms'

export interface UserProps {
  uid: string
}

/**
 * Example component to demonstrate ts-rest + react-query client `getOne()` with the `useQuery()` hook.
 * Not in use in the app.
 */
export function User({ uid }: UserProps): JSX.Element | null {
  const { data, error, isLoading } = apiQuery.users.getOne.useQuery(
    [['users', uid]],
    {
      params: { uid },
    },
    {
      // only enable the query if there is a valid uid
      enabled: uid !== undefined,
      onSettled: () => {
        // console.log('tried')
      },
      staleTime: 1000 * 60 * 30,
      // networkMode: 'offlineFirst',
    },
  )

  if (error) {
    return (
      <div className="prose w-full h-full flex flex-row justify-center items-center">
        <div>
          <h1>User not found.</h1>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="prose w-full h-full flex flex-row justify-center items-center">
        <div>
          <h1>Loading&hellip;</h1>
          <progress className="progress w-56" />
        </div>
      </div>
    )
  }

  const user = data.body

  return user ? (
    <div className="prose max-w-none mx-auto px-2 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl mb-2 font-bold tracking-tighter">{user.name}</h1>
          <h3 className="text-xl font-medium tracking-tight">{user.email}</h3>
        </div>
      </div>
      <p>{user.role}</p>
      <div className="flex flex-row gap-2 mt-8">
        <DeleteUserButton userUid={uid} />
      </div>
    </div>
  ) : null
}
