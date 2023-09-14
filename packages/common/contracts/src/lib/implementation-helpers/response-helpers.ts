import { type UserDto, zUserDto } from '@rfx/common-data'
import type { ContractMessageResponse } from '../z-response-schemas'

/**
 * Return a 401 response with boilerplate 'Unauthorized' message.
 */
export const getUnauthorizedResponse = (): { status: 401; body: { message: string } } => ({
  status: 401,
  body: {
    message: 'Unauthorized',
  },
})

/**
 * Return a 200 response with the given `UserDto` body.
 *
 * This function parses the DTO with zod as a safety/sanity check to ensure a valid response that
 * excludes any sensitive data fields (hence the inclusion of "safe" in the name).
 *
 * The performance hit of potentially multiple zod validations is a negligible trade-off vs.
 * added protection that's resilient to regressions.
 */
export const buildSafeUserDtoResponse = (rawBody: unknown): { status: 200; body: UserDto } => {
  const dto = zUserDto.parse(rawBody)

  // a final sanity and security check
  if ('password' in dto && dto['password']) {
    throw new Error('Unexpected sensitive data in outbound user DTO')
  }

  return {
    status: 200,
    body: dto,
  }
}

/**
 * Return a 200 response with the given JSON body with string `message`.
 */
export const buildMessageResponse = (message: string): { status: 200; body: ContractMessageResponse } => ({
  status: 200,
  body: { message },
})
