import { z } from 'zod'
import { zEmail, zPassword, zAuthToken, type JsonObject } from '@rfx/common-toolbox'
import { type UserDao, zCreateUserDto, zUserDao } from '../z-entity-schemas/z-user'

export interface AuthUserSessionDao extends JsonObject, z.infer<typeof zAuthUserSessionDao> {}

export interface AuthPasswordCredentials extends z.infer<typeof zAuthPasswordCredentials> {}

export const zAuthPasswordCredentials = z.object({
  email: zEmail,
  password: zPassword,
})

export const zAuthEmailVerificationDto = z.object({
  email: zEmail,
  token: zAuthToken,
})

/**
 * Zod schema for typed user session data.
 *
 * This object must be serializable to JSON for persistence in the session store
 * (i.e. it must be parseable by the `zJsonObject` schema).
 *
 * In pursuit of JSON serializability date fields are represented as ISO strings.
 *
 * This schema exhaustively picks from zUserDao to protect from leaking sensitive data
 * in case new sensitive fields are added to the user entity in the future.
 */
export const zAuthUserSessionDao = zUserDao
  .pick({
    id: true,
    uid: true,
    name: true,
    email: true,
    role: true,
  })
  .extend({
    // for json serializable sessions coerce Dates to ISO strings
    emailVerifiedAt: z
      .date()
      .transform<string>((value) => {
        return value.toISOString()
      })
      .nullable(),
  })

export const mapUserDaoToAuthUserSessionDao = (userDao: UserDao): AuthUserSessionDao => {
  return zAuthUserSessionDao.parse(Object.assign({}, userDao, { password: undefined }))
}

export const zAuthRegisterDto = zCreateUserDto
