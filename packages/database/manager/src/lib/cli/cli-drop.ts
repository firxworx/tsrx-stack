import * as path from 'path'

import { findTsFileByIdentifier, importFunctionFromFile } from './helpers/io-utils'
import { getDatabasePool, zTableIdentifier } from '@rfx/database-slonik'

// script dependencies may reference expanded environment variables which can be populated via `dotenv-expand`
// refer to script targets in `package.json`
//
// usage:
// - refer to the `cli:pg:drop` script target in `package.json`
// - this script will run the sql file corresponding to the provided model argument (path: `../schemas/*.sql`)
//
// example:
//
// ```sh
// pnpm cli:pg:drop public.user
// ```

main()
  .then(() => {
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
  const fn = await importFunctionFromFile(tsFile, 'drop')

  if (typeof fn !== 'function') {
    throw new Error(`Function drop not found in module ${tsFile}`)
  }

  const pool = await getDatabasePool(DB_URL)

  try {
    console.log(`Executing ${path.basename(tsFile)} ('drop')...`)
    await fn(pool)

    console.log('Done.')
  } catch (error: unknown) {
    console.error('Error executing queries...')
    console.error(error)
  } finally {
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
