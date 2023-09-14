import { Button, DropdownMenu, cn } from '@rfx/react-core'

import { apiQuery } from '../../api/query-client'
import { QUERY_KEYS } from '../../api/query-keys'
import { AuthModalTrigger } from './AuthModal'
import { useAuthSignOut } from './auth-hooks'
import { ChevronDownIcon, UserCircleIcon } from 'lucide-react'

export interface AuthMenuProps {}

/**
 * Conditional Auth Menu that renders a "Sign In" button if the user is not authenticated or
 * a dropdown menu with the user's name and "Sign Out" capability if the user is authenticated.
 *
 * Rendering this component will initiate a request to the API session endpoint to check if the
 * user is authenticated. This technique is compatible with httpOnly cookies.
 *
 * If the user is authenticated, the session data will be cached by react-query using the query cache
 * key `QUERY_KEYS.AUTH.SESSION`.
 *
 * It would be preferred to have a wrapper hook for user authentication and session status however
 * there is a bug with ts-rest's react-query client that breaks the react-query 'select' feature
 * and has related render/re-render issues.
 *
 * @see https://github.com/ts-rest/ts-rest/issues/289 -- ts-rest + react-query select bug
 * @see https://tkdodo.eu/blog/react-query-render-optimizations -- why select is important
 */
export function AuthMenu(_props: AuthMenuProps): JSX.Element {
  const { data } = apiQuery.auth.session.useQuery(
    QUERY_KEYS.AUTH.SESSION,
    {},
    { retry: false, staleTime: 1000 * 60 * 60 * 24 },
  )

  const { signOutAsync, isPendingSignOut } = useAuthSignOut()

  const user = data?.body

  return user ? (
    <div
      className={cn({
        ['animate-pulse']: isPendingSignOut,
      })}
    >
      <DropdownMenu modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline" className="group font-normal bg-slate-50" aria-label={`User Menu for ${user.name}`}>
            <UserCircleIcon className="mr-1.5 h-5 w-5 pt-0.5 text-sky-800 group-hover:text-sky-700/80" />
            <ChevronDownIcon className="h-4 w-4 pt-0.5 text-sky-800 group-hover:text-sky-700/80" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label className="text-slate-700">My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            onSelect={async () => {
              await signOutAsync({ body: {} })
            }}
          >
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  ) : (
    <AuthModalTrigger />
  )
}
