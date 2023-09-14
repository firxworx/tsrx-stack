import { z } from 'zod'

import { zEmail, zPassword, makeZodOptionalTextField } from '@rfx/common-toolbox'
import { zAnyIdDto, zBaseDao, zBaseDto } from '../z-base'

export type User = z.infer<typeof zUser>

export interface UserDao extends z.infer<typeof zUserDao> {}
export interface UserDto extends z.output<typeof zUserDto> {}

export type CreateUserDto = z.infer<typeof zCreateUserDto>
export type UpdateUserDto = z.infer<typeof zUpdateUserDto>

export const zUser = z.object({
  name: z.string().nonempty('Name is required'),
  email: zEmail,
  password: zPassword,
  role: z.string(),
  emailVerifiedAt: z.coerce.date().nullable(),
})

export const zUserPublic = zUser.omit({ password: true })

export const zUserDao = zBaseDao.merge(zUser)
export const zUserDto = zBaseDto.merge(zUserPublic)

export const zCreateUserDto = zUser.omit({ emailVerifiedAt: true })
export const zUpdateUserDto = zUser
  .omit({ emailVerifiedAt: true })
  .extend({
    password: makeZodOptionalTextField(zPassword),
  })
  .deepPartial()

export const zUpdateUserQueryDto = zAnyIdDto
  .merge(zUpdateUserDto)
  .refine((data) => data.id !== undefined || data.uid !== undefined, {
    message: 'At least one of id or uid must be defined',
  })
