import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants'

/**
 * API dev/debug component that fetches session data from the ts-rest powered API
 * using a fetch request instead of the API client.
 *
 * Retained in the codebase to provide an example of how ts-rest API's are compatible with any HTTP client.
 */
export const DebugFetchSession: React.FC = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/api/v1/auth/session`, {
          method: 'GET',
          credentials: 'include', // include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error))
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  return <div>Data: {JSON.stringify(data)}</div>
}
