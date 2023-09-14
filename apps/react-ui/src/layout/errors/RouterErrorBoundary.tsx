import { useRouteError } from 'react-router-dom'
import { getErrorMessage } from '../../lib/error-utils'
import { PageHeading } from '../PageLayout'

/**
 * Error boundary for react-router that displays route errors.
 */
export function RouterErrorBoundary(): JSX.Element {
  const error = useRouteError()

  return (
    <section>
      <PageHeading title="Router Error Boundary" />
      <small>{getErrorMessage(error)}</small>
    </section>
  )
}
