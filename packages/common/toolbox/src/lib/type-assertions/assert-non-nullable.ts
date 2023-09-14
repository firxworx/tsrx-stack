import { isNonNullable } from '../type-guards/non-nullable.type-guards'

/**
 * Generic type assertion function that asserts the input is `NonNullable`.
 * Sourced from fx-stack-lab.
 *
 * @throws Error if the input is `null` or `undefined`.
 */
export function assertNonNullable<T>(input: T, errorMessage?: string): asserts input is NonNullable<T> {
  if (!isNonNullable<T>(input)) {
    throw Error(errorMessage ?? 'NonNullable assertion error: input value is null or undefined')
  }
}

/**
 * Type utility that asserts the input is `NonNullable` (i.e. _not nullish_) and returns it with a narrowed type.
 *
 * TypeScript's naming can be _slightly_ confusing here as the official utility type is referred to as `NonNullable<T>`
 * however the `??` operator is referred to as the _nullish coalescing operator_. In some cases _nonnullable_ is used to
 * only refer to `null` and not `undefined` so this function name was as "nullish" to be more explicit.
 *
 * @throws Error if the input is `null` or `undefined`.
 */
export function throwIfNullish<T>(input: T, errorMessage?: string): NonNullable<T> {
  assertNonNullable(input, errorMessage)
  return input
}
