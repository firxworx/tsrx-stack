import { z } from 'zod'
import { isRecord, type AtLeastOneDefined } from '@rfx/common-toolbox'

export interface IdDto extends z.infer<typeof zIdDto> {}
export interface UidDto extends z.infer<typeof zUidDto> {}

/**
 * Type representing a database object/record with either `id` or `uid` or both defined.
 *
 * Use alongside `zIdOrUidDto` zod schema which parses/validates this type at runtime.
 * This type exists because zod/TypeScript cannot infer this type from a schema implemented with `z.refine()`.
 *
 * @see zIdOrUidDto
 */
export type IdUidDto = AtLeastOneDefined<{ id: number; uid: string }> & { [key: string]: unknown }

/**
 * Zod schema of an object with positive integer `id`.
 */
export const zIdDto = z.object({
  id: z.number().int().positive('Must be a valid ID'),
})

/**
 * Zod schema of an object with positive string `uid` that must be a valid UUID.
 */
export const zUidDto = z.object({
  uid: z.string().uuid('Must be a valid UUID'),
})

/**
 * Zod schema of an object with conventional "audit" fields: `createdAt` and `updatedAt`.
 *
 * This schema will coerce string values to `Date` objects so take note when defining types/interfaces
 * with this schema (e.g. `z.input` vs. `z.output`).
 */
export const zAuditDto = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

/**
 * Zod schema of a base Data Access Object (DAO) with common database table fields including
 * `id`, `uid`, `createdAt`, and `updatedAt`.
 */
export const zBaseDao = z.object({
  id: z.number().int().positive(),
  uid: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

/**
 * Zod schema of a base Data Transfer Object (DTO) with common database table fields including
 * `uid`, `createdAt`, and `updatedAt`.
 *
 * By project convention a DTO is a DAO with `id`, sensitive fields (e.g. `password`), and audit
 * fields (e.g. `createdAt`) omitted and is intended for data transfer between client and server.
 */
export const zBaseDto = zUidDto

export const zAnyIdDto = z
  .object({
    id: z.number().int().positive('Must be a valid ID'),
    uid: z.string().uuid('Must be a valid UUID'),
  })
  .partial()

/**
 * Zod schema to provide run-time enforcement of the type `IdUidDto`: an object that must specify
 * at least one of `id` or `uid` or both.
 *
 * This schema may not be as flexible to use in combination with zod features related to object schemas
 * (such as `merge()`, etc) because `ZodType`/`ZodEffect` resulting from using zod `refine()` are not
 * equivalent to `ZodObject`.
 *
 * A type predicate is added to the `refine()` operation to assist with type inference.
 *
 * Due to limitations of TS + zod traditional type guards are also defined to support implementations.
 *
 * @see IdUidDto
 */
export const zIdUidDto: z.ZodType<IdUidDto, z.ZodTypeDef, z.input<typeof zAnyIdDto>> = zAnyIdDto.refine(
  (data): data is IdUidDto => data.id !== undefined || data.uid !== undefined,
  {
    message: 'At least one of id or uid must be defined',
  },
)

/**
 * TypeScript type guard that evaluates if the given input is a valid `IdUidDto`.
 *
 * This type guard can help narrow types in implementations faced with limitations of TypeScript + zod
 * when using schemas with ZodEffect's such as `refine()` and `transform()`, such as `zIdUidDto`.
 */
export function isIdUidDto(input: unknown): input is IdUidDto {
  if (!isRecord(input)) {
    return false
  }

  if ('id' in input && !Number.isInteger(input['id'])) {
    return false
  }

  if ('uid' in input && !zUidDto.safeParse(input['uid']).success) {
    return false
  }

  return true
}

/**
 * Validate and return an input `IdUidDto` or throw an Error.
 */
export const getIdUidDto = (input: unknown): IdUidDto => {
  if (!isIdUidDto(input)) {
    throw new Error('invalid input: id or uuid must be defined')
  }

  return input
}
