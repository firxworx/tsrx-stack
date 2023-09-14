import { useState, useEffect } from 'react'

/**
 * Debounced value hook that sets internal state to the given value after a delay.
 * The internal timeout is cleared if the value or delay changes or the component unmounts.
 *
 * The hook returns the debounced value.
 */
export function useDebounce<T = string>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // cancel the timeout if value or delay changes or calling component unmounts
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
