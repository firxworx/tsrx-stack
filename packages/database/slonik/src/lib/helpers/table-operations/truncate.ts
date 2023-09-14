import type { DatabasePoolConnection } from 'slonik'
import { sqlx } from '../../client/slonik-sql'

/**
 * Truncate (empty) a given table and reset the id sequence of its primary key field.
 * Intended for development and testing purposes.
 */
export async function truncate(
  connection: DatabasePoolConnection,
  tableIdentifier: [string, string], // [schema, table]
): Promise<void> {
  await connection.query(sqlx.typeAlias('void')`
    DELETE FROM ${sqlx.identifier(tableIdentifier)};
    ALTER SEQUENCE ${sqlx.identifier([tableIdentifier[1] + '_id_seq'])} RESTART WITH 1;
  `)

  // await Promise.all(
  //   RELATION_TABLES.map(async (table) => {
  //     console.log(`truncate relation table: ${table}`)
  //     await connection.query(sqlx.typeAlias('void')`
  //       DELETE FROM ${sqlx.identifier(['public', table])};
  //     `)
  //   }),
  // )
}
