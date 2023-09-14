/**
 * Mark all properties of an object as nullable (e.g. string -> string | null).
 * Useful for JSON and database queries.
 *
 * @see https://typeofnan.dev/making-every-object-property-nullable-in-typescript/
 */
export type Nullable<T> = { [K in keyof T]: T[K] | null }

/**
 * Recursively mark all properties of an object as nullable (e.g. string -> string | null).
 * Useful for JSON and database queries.
 *
 * @see https://typeofnan.dev/making-every-object-property-nullable-in-typescript/
 */
export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null
}

/**
 * Generic utility type that ensures at least one property of the object type provided in the generic is defined.
 *
 * e.g. `AtLeastOneDefined<{ id: number, uid: string }>` will ensure that either `id` or `uid` or both are defined.
 *
 * May be combined with `& { [key: string]: unknown }` in a type definition to allow for additional properties.
 *
 * This utility is intended for use alongside strong runtime validation with zod and exists to handle
 * cases where zod `refine()` provides a guarantee of runtime type safety however `z.infer()` is not able to
 * accurately infer the type.
 */
export type AtLeastOneDefined<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]
