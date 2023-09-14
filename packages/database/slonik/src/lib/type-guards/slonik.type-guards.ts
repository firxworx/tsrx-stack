import type { IdentifierSqlToken } from 'slonik'
import { zSlonikIdentifierSqlToken } from '../zod-schemas/z-slonik'

export const isSlonikIdentifierSqlToken = (token: unknown): token is IdentifierSqlToken =>
  zSlonikIdentifierSqlToken.safeParse(token).success
