import { type Query, QueryCache, QueryClient, MutationCache } from '@tanstack/react-query'
import { IS_PRODUCTION } from '../constants'

/**
 * `QueryClient` instance for react-query `QueryClientProvider` used to configure query, cache, and error handling.
 *
 * @see App for usage
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 10, // 10 minutes (note: `Infinity` is 'never stale')
      // retry: 0,
      retry: (failureCount, error) => {
        if (error instanceof Error) {
          if (!IS_PRODUCTION) {
            console.error(error)
          }

          // example of more detailed conditional handling of the error
          //
          // const status = getHttpErrorStatus(error)
          // const errorMessage = getErrorMessage(error).toLowerCase()

          // if (
          //   error instanceof AuthError ||
          //   status === 401 ||
          //   errorMessage.includes('401') ||
          //   errorMessage.includes('unauthorized')
          // ) {
          //   return false
          // }

          // if (
          //   error instanceof AuthError ||
          //   status === 403 ||
          //   errorMessage.includes('403') ||
          //   errorMessage.includes('forbidden')
          // ) {
          //   return false
          // }

          // if (status === 404 || errorMessage.includes('404') || errorMessage.includes('not found')) {
          //   return false
          // }
        }

        return failureCount < 3
      },

      // implement exponential backoff with jitter to randomize retry delay
      retryDelay: (attemptIndex) => {
        const minDelay = Math.pow(2, attemptIndex) * 1000
        const maxDelay = minDelay * 2

        return Math.random() * (maxDelay - minDelay) + minDelay
      },
    },
    mutations: {
      retry: false, // e.g. (`false` (default) or for example `error.response?.status >= 500`)
      useErrorBoundary: false, // do not throw errors to the global error boundary

      // example of custom conditions for the global error boundary based on hypothetical custom error classes
      // useErrorBoundary: (error: unknown): boolean =>
      //   !(
      //     // ApiError ??
      //     error instanceof FormError ||
      //     error instanceof ConflictError ||
      //     error instanceof AuthError ||
      //     error instanceof NetworkError
      //   ),
    },
  },
  queryCache: new QueryCache({
    onError: (error: unknown, query: Query): void => {
      // @future log to remote telemetry or observability service (e.g. sentry)

      if (import.meta.env.DEV) {
        console.error('queryCache error', error, query)
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown, query: unknown): void => {
      // @future log to remote telemetry or observability service (e.g. sentry)

      if (import.meta.env.DEV) {
        console.error('mutationCache error', error, query)
      }
    },
  }),
})
