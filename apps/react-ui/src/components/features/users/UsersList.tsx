import type { UserDto } from '@rfx/common-data'

import { apiQuery } from '../../../api/query-client'
import { CreateUserFormModalTrigger, DeleteUserButton, EditUserFormModalTrigger } from './UserForms'
import { cn } from '@rfx/react-core'

export interface UsersListProps {
  showCreateAction?: boolean
  showEditActions?: boolean
  showDeleteActions?: boolean
}

export interface UserCardProps {
  user: UserDto
  showEditAction?: boolean
  showDeleteAction?: boolean
}

export function UsersList({ showCreateAction, showEditActions, showDeleteActions }: UsersListProps): JSX.Element {
  const { data, isLoading, isError } = apiQuery.users.getMany.useQuery(
    ['users'], // react-query cache key
    {}, // query params, params, body, etc (all typed) e.g. { params: { id: '1' } }
    { staleTime: 1000 * 60 * 30 },
  )

  const users = data?.body ?? []

  if (isLoading && !isError) {
    return <div>Loading&hellip;</div>
  }

  return (
    <div>
      {!!showCreateAction && (
        <div className="flex justify-start mb-4">
          <CreateUserFormModalTrigger />
        </div>
      )}
      {(!data || (Array.isArray(data?.body) && !data.body.length)) && !isLoading && !isError ? (
        <div>No users found.</div>
      ) : (
        <div
          className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4', {
            ['animate-pulse bg-red-200 py-8']: isLoading,
          })}
        >
          {users.map((user) => (
            <UserCard
              key={user.uid}
              user={user}
              showEditAction={showEditActions}
              showDeleteAction={showDeleteActions}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function UserCard({ user, showEditAction, showDeleteAction }: UserCardProps): JSX.Element {
  return (
    <div
      key={user.uid}
      className={cn(
        'flex px-4 py-4 justify-between rounded-md bg-white transition-colors',
        'text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm',
      )}
    >
      <div className="overflow-hidden">
        <p className="truncate text-base font-medium">{user.name}</p>
        <p className="truncate text-sm text-slate-500">{user.email}</p>
        <p className="mt-1 text-xs uppercase text-slate-500">{user.role}</p>
      </div>
      <div
        className={
          showEditAction || showDeleteAction ? 'flex items-center flex-col xs:flex-row pl-4 gap-2 min-w-fit' : 'hidden'
        }
      >
        {!!showDeleteAction && (
          <div>
            <DeleteUserButton userUid={user.uid} />
          </div>
        )}
        {!!showEditAction && (
          <div>
            <EditUserFormModalTrigger user={user} />
          </div>
        )}
      </div>
    </div>
  )
}
