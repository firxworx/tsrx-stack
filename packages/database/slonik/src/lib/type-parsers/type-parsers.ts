import { type TypeParser } from 'slonik'

/**
 * Slonik type parser to map timestamptz fields to Date objects.
 * Slonik returns `int` timestamps by default in ms.
 */
export const timestamptzToDateParser: TypeParser<Date> = {
  name: 'timestamptz',
  parse: (input: unknown): Date => new Date(String(input)),
}

/**
 * Slonik type parser to map date fields to ISO date strings (10 character).
 *
 * Conversion to string is preferred by the slonik-trpc project.
 * Slonik returns `int` timestamps by default.
 */
export const dateToDateISOStringParser: TypeParser<string> = {
  name: 'date',
  parse: (a) => (!a || !Date.parse(a) ? a : new Date(a).toISOString().slice(0, 10)),
}

/**
 * Slonik type parser to map timestamptz fields to ISO date timestamp strings.
 *
 * Conversion to string is preferred by the slonik-trpc project.
 * Slonik returns `int` timestamps by default.
 */
export const timestamptzToDateISOStringParser: TypeParser<string> = {
  name: 'timestamptz',
  parse: (a) => (!a || !Date.parse(a) ? a : new Date(a).toISOString()),
}

/**
 * Slonik type parser to map timestamp fields to ISO date timestamp strings.
 * Conversion to string is preferred by the slonik-trpc project.
 *
 * Slonik returns `int` timestamps by default.
 */
export const timestampToDateISOStringParser: TypeParser<string> = {
  name: 'timestamp',
  parse: (a) => (!a || !Date.parse(a) ? a : new Date(a + 'Z').toISOString()),
}

/**
 * Slonik type parser that overrides default int8 -> integer parsing to map to bigint.
 */
export const int8ToBigIntParser: TypeParser<bigint> = {
  name: 'int8',
  parse(input: string | number | bigint): bigint {
    return BigInt(input)
  },
}
