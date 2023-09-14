import { useQueryClient } from '@tanstack/react-query'
import type { ClientInferResponses } from '@ts-rest/core'

import type { apiContract } from '@rfx/common-contracts'
import type { UserDto } from '@rfx/common-data'

import { apiQuery } from '../../api/query-client'
import { QUERY_KEYS } from '../../api/query-keys'

export type AuthResponse = ClientInferResponses<typeof apiContract.auth.signIn, 200>

export interface AuthSignOutHookProps {
  onSuccess?: () => void
  onError?: () => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ts-rest type utilities aren't mature
export function useAuthSignOut({ onSuccess, onError }: AuthSignOutHookProps = {}) {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData<UserDto>(['auth', 'session'])

  const {
    mutateAsync: signOutAsync,
    isLoading,
    isError,
  } = apiQuery.auth.signOut.useMutation({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: () => {
      onError?.()
    },
    onSettled: () => {
      if (user) {
        queryClient.setQueryData(QUERY_KEYS.AUTH.SESSION, undefined)
        queryClient.removeQueries(QUERY_KEYS.AUTH.SESSION)
      }
    },
  })

  return { signOutAsync, isPendingSignOut: isLoading && !isError }
}
