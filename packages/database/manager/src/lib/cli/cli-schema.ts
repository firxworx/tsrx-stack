import * as path from 'path'
import { sql } from 'slonik'
import { raw } from 'slonik-sql-tag-raw'

import { findSqlFileByIdentifier, readSqlFile } from './helpers/io-utils'
import { getDatabasePool, zTableIdentifier } from '@rfx/database-slonik'

// execute a query to create a given table in the database
//
// every table has an sql + ts file with its schema under `packages/database/manager/src/lib/entities/`
// following naming convention: `{schema}.{name}.sql` + `{schema}.{name}.ts`
//
// by project convention the ts file exports a `seed()` function used to populate the table with data
//
// a glob pattern is used to locate a table's files so the schema may be organized under folders
// the current folder layout is: `{schema}/{aggregate}/` (e.g. public/user/public.user.sql)
//
// usage:
// - refer to the `cli:pg:schema` script target in `package.json`
// - this script will run the sql file corresponding to the table argument <schema>.<table_name> e.g. 'public.user'
//
// ```sh
// pnpm cli:pg:schema <schema>.<table>
// ```
//
// tip: add dotenv-expand if you need to reference expanded environment variables

main()
  .then(() => {
    console.log('\nTable/model schema script execution complete.')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function main(): Promise<void> {
  const DB_URL = String(process.env['DB_URL'] ?? '')

  const modelArg = String(process.argv[2])
  const tableTuple = zTableIdentifier.safeParse(modelArg.split('.'))

  if (!modelArg || !tableTuple.success) {
    throw new Error('Missing model argument: please provide `{schema}.{table}` that corresponds to an sql file')
  }

  const sqlFile = await findSqlFileByIdentifier(tableTuple.data)
  const modelSql = await readSqlFile(sqlFile)

  const pool = await getDatabasePool(DB_URL)

  try {
    console.log(`Executing ${path.basename(sqlFile)}...`)
    const result = await pool.query(sql.unsafe`${raw(modelSql)}`)

    console.log(`Result notice count: ${result.notices.length}`)
    console.log('Done.')
  } catch (error: unknown) {
    console.error('Error executing queries')
    console.error(error)
  } finally {
    console.log('Closing connection pool...')
    await pool.end()
  }
}

// async function readModelSqlFile(model: string): Promise<string> {
//   try {
//     const filePath = path.join(__dirname, '..', 'models', model, `${model}.schema.sql`)
//     return fs.readFile(filePath, { encoding: 'utf-8' })
//   } catch (error: unknown) {
//     console.error(error)
//     throw new Error(`Error reading model file: ${model}`)
//   }
// }
