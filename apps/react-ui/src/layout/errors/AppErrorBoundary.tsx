import React from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Button } from '@rfx/react-core'

/**
 * Application Error Boundary component.
 *
 * @see https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react
 */
export function AppErrorBoundary({ children }: React.PropsWithChildren): JSX.Element {
  const [retryCount, setRetryCount] = React.useState(0)

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setRetryCount(retryCount + 1)}
      resetKeys={[retryCount]} // resets the error boundary when `retryCount` changes
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error fallback component used by the ErrorBoundary.
 * Renders a button to reset the error boundary and try again.
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps): JSX.Element {
  return (
    <div role="alert" className="mx-auto my-8 sm:my-12 max-w-2xl p-4 rounded-md bg-slate-100">
      <p>Something went wrong:</p>
      <pre className="my-4 p-4 rounded-md text-red-800 font-mono">{error.message}</pre>
      <div className="flex gap-4">
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  )
}
