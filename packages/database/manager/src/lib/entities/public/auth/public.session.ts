import type { DatabasePool, IdentifierSqlToken } from 'slonik'
import { sqlx } from '@rfx/database-slonik'

export const sessionTableIdentifierTuple: [string, string] = ['public', 'session']
const sqlTableIdentifier: IdentifierSqlToken = sqlx.identifier(sessionTableIdentifierTuple)

export async function seed(_pool: DatabasePool): Promise<void> {
  console.log('Seed for public.session is a noop')
}

export async function drop(pool: DatabasePool): Promise<void> {
  const query = sqlx.typeAlias('void')`DROP TABLE IF EXISTS ${sqlTableIdentifier} CASCADE;`
  await pool.connect((connection) => connection.query(query))

  return
}
