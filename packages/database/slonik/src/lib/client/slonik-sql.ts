import { z } from 'zod'
import { createSqlTag } from 'slonik'

// e.g. if using ULID's instead of UUID's
// import { zUlidAsCrockfordBase32Strict, zUlidAsUuid } from '@firx/common-toolbox'

export const sqlx = createSqlTag({
  typeAliases: {
    id: z.object({
      id: z.number(),
    }),
    uuid: z.object({
      uuid: z.string().uuid(),
    }),
    // many of our project schemas use the `uid` property for ULID-as-UUID's
    // uid: z.object({
    //   uid: zUlidAsUuid,
    // }),
    // ['ulid-32']: z.object({
    //   ulid: zUlidAsCrockfordBase32Strict,
    // }),
    // ['ulid-uuid']: z.object({
    //   uuid: zUlidAsUuid,
    // }),
    count: z.object({
      count: z.number(),
    }),
    null: z.null(),
    void: z.void(), // z.object({}).strict()
  },
})
