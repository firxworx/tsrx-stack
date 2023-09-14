export function isNonNullable<T>(input: unknown): input is NonNullable<T> {
  return input !== null && input !== undefined
}

export function isNullish(input: unknown): input is undefined | null {
  return input === null || input === undefined
}

export function isNull(input: unknown): input is null {
  return input === null
}

export function isUndefined(input: unknown): input is undefined {
  return input === undefined
}
