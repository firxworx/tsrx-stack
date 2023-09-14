/**
 * Utility type to strip the `Readonly` flag from all properties of an object.
 *
 * This should not be necessary _within_ your application code however it can smooth over rough edges
 * when interfacing with certain third-party libraries.
 *
 * Example: `slonik` library uses `Readonly` in certain query results type which is generally good practice
 * however this can conflict with the response data types of an API framework when returning results.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
