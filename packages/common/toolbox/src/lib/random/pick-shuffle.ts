/**
 * Return a random(ish) selected item from the given array.
 * Not cryptographically secure: for testing, mockups, and visual effects.
 *
 * @throws Error if the input array is empty
 */
export function pickRandomItem<T>(input: T[]): T[][number] {
  if (input.length === 0) {
    throw new Error('Cannot pick item from empty array')
  }

  return input[Math.floor(input.length * Math.random())] as T
}

/**
 * Return a random number between the given min and max values, and optionally a `fraction` number of decimal places.
 * Not cryptographically secure: for testing, mockups, and visual effects. Not for large values.
 *
 * @default fraction 0
 */
export function getRandomNumber({ min, max, fraction }: { min: number; max: number; fraction?: number }): number {
  const random = Math.random() * (max - min) + min
  return parseFloat(random.toFixed(fraction ?? 0))
}

/**
 * Return a random(ish) integer that's within the given range (inclusive of the min + max values).
 * Not cryptographically secure: for testing, mockups, and visual effects.
 */
export const getRandomIntFromRange = (min: number, max: number): number => {
  const minCeil = Math.ceil(min)

  return Math.floor(Math.random() * (Math.floor(max) - minCeil + 1) + minCeil)
}

/**
 * Return a random(ish) boolean `true` or `false` value.
 * Not cryptographically secure: for testing, mockups, and visual effects.
 */
export const getRandomBoolean = (): boolean => {
  return Boolean(getRandomIntFromRange(0, 1))
}

/**
 * Return a new array with the input array's items shuffled in a random(ish) order.
 * A useful first step to picking `n` unique random values from an array.
 *
 * Not cryptographically secure: for testing, mockups, and visual effects.
 */
export const shuffle = <T>(input: T[]): T[] => {
  return input
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
