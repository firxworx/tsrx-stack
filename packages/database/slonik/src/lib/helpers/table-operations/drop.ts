import type { DatabasePoolConnection } from 'slonik'
import { sqlx } from '../../client/slonik-sql'

/**
 * Drop a given table with optional cascade.
 * All of the table's indexes, constraints, and triggers are dropped along with the table.
 */
export async function drop(
  connection: DatabasePoolConnection,
  tableIdentifier: [string, string], // [schema, table]
  options: { cascade?: boolean } = { cascade: false },
): Promise<void> {
  if (options.cascade) {
    await connection.query(sqlx.typeAlias('void')`
      DROP TABLE ${sqlx.identifier(tableIdentifier)} CASCADE;
    `)

    return
  }

  await connection.query(sqlx.typeAlias('void')`
    DROP TABLE ${sqlx.identifier(tableIdentifier)};
  `)

  return
}
