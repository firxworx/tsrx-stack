/**
 * Convert a camelCase string value to lowercase snake_case.
 * https://github.com/blakeembrey/change-case/blob/master/packages/no-case/src/index.ts
 *
 * @deprecated favour shorter but similarly explicit export camelToSnake
 */
export function camelCaseToSnakeCase(input: string): string {
  return snakeCase(input)
}

// /**
//  * Convert a camelCase string value to lowercase snake_case. (from olivia-party-release)
//  *
//  * @see https://github.com/blakeembrey/change-case/blob/master/packages/no-case/src/index.ts
//  */
// export function camelToSnake(input: string): string {
//   return snakeCase(input)
// }

// from vensta api dev
export function camelToSnake(input = ''): string {
  return input.replace(/[A-Z]+/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, '')
}

// general-case utility camelToSnake like above (vensta camelToSnake) but handles StringISODate -> string_iso_date
// by assuming the letter before the capital is a word boundary
export function camelToSnakeBoundaries(input = ''): string {
  return input
    .replace(/[A-Z]+/g, (match) => `_${match.toLowerCase()}`)
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/^_/, '')
}

export interface Options {
  splitRegexp?: RegExp | RegExp[]
  stripRegexp?: RegExp | RegExp[]
  delimiter?: string
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
const DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g]

// Remove all non-word characters.
const DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi

/**
 * Normalize the string into something other libraries can manipulate easier.
 *
 * Credit Blake Embrey (MIT license):
 * https://github.com/blakeembrey/change-case/blob/master/packages/snake-case/src/index.ts
 */
export function noCase(input: string, options: Options = {}): string {
  const { splitRegexp = DEFAULT_SPLIT_REGEXP, stripRegexp = DEFAULT_STRIP_REGEXP, delimiter = ' ' } = options

  const result = replace(replace(input, splitRegexp, '$1\0$2'), stripRegexp, '\0')
  let start = 0
  let end = result.length

  // Trim the delimiter from around the output string.
  while (result.charAt(start) === '\0') start++
  while (result.charAt(end - 1) === '\0') end--

  // Transform each token independently
  return result
    .slice(start, end)
    .split('\0')
    .map((input) => String(input).toLowerCase())
    .join(delimiter)
}

/**
 * Given an input string, replace matches to the given regex, with the replacement value.
 * Helper function to noCase() conversion function.
 */
function replace(input: string, regex: RegExp | RegExp[], value: string): string {
  if (regex instanceof RegExp) {
    return input.replace(regex, value)
  }

  return regex.reduce((input, re) => input.replace(re, value), input)
}

export function snakeCase(input: string, options: Options = {}): string {
  return noCase(input, {
    delimiter: '_',
    ...options,
  })
}
