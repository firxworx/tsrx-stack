/**
 * Base URL of the back-end API.
 */
export const API_URL = String(import.meta.env.VITE_API_URL)

/**
 * Flag indicating if the app is running in production mode.
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
export const IS_PRODUCTION = import.meta.env.PROD

/**
 * Flag indicating if the app is running in production mode.
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
export const IS_CLIENT = import.meta.env.SSR === false

/**
 * Flag indicating if auth session ping (ping endpoint at given interval) is enabled.
 */
export const AUTH_SESSION_PING_ENABLED = true

/**
 * Time in milliseconds to ping the auth session endpoint.
 * Only relevant when `AUTH_SESSION_PING_ENABLED` is `true`.
 */
export const AUTH_SESSION_PING_INTERVAL_MS = 1000 * 60 * 10 // 10 min

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined')
}
