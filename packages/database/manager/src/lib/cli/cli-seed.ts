import * as path from 'path'

import { getDatabasePool, zTableIdentifier } from '@rfx/database-slonik'
import { findTsFileByIdentifier, importFunctionFromFile } from './helpers/io-utils'

// execute the `seed()` function asociated with a given table in the database
//
// every table has an sql + ts file under `packages/database/manager/src/lib/entities/`
// following naming convention: `{schema}.{name}.sql` + `{schema}.{name}.ts`
//
// by project convention the ts file exports a `seed()` function used to populate the table with data
//
// a glob pattern is used to locate a table's files so the schema may be organized under folders
// the current folder layout is: `{schema}/{aggregate}/` (e.g. public/user/public.user.sql)
//
// usage:
// - refer to the `cli:pg:seed` script defined in `package.json`
// - this script will run `seed()` from the table's ts file
//
// ```sh
// pnpm cli:pg:schema <schema>.<table_name>
// ```

main()
  .then(() => {
    console.log('\nSeed script execution complete.')
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

  const tsFile = await findTsFileByIdentifier(tableTuple.data)
  const fn = await importFunctionFromFile(tsFile, 'seed')

  if (typeof fn !== 'function') {
    throw new Error(`Function seed not found in module ${tsFile}`)
  }

  const pool = await getDatabasePool(DB_URL)

  try {
    console.log(`Executing ${path.basename(tsFile)} ('seed')...`)
    const _result = await fn(pool)

    // console.log(`Result notice count: ${result.notices.length}`)
    console.log('Done.')
  } catch (error: unknown) {
    console.error('Error executing queries...')
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
