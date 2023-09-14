import * as path from 'path'
import { sql } from 'slonik'
import { raw } from 'slonik-sql-tag-raw'

import { getDatabasePool } from '@rfx/database-slonik'
import { readSqlFile } from './helpers/io-utils'
import { SQL_FUNCTIONS_DIR_PATH } from '../../contants'

// script runs `sql/functions.sql` script to create extensions + functions
// note script dependencies may reference expanded environment variables (these can be populated via `dotenv-expand`)
//
// usage:
// - refer to the `cli:pg:setup` script target in `package.json`
// - this script will run the sql file corresponding to the provided model argument (path: `../schemas/*.sql`)
//
// ```ts
// pnpm cli:pg:setup
// ```

main()
  .then(() => {
    console.log('Extensions/functions query complete.')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function main(): Promise<void> {
  const DB_URL = String(process.env['DB_URL'] ?? '')

  const TARGET_SQL_FILE = 'functions.sql'

  const pool = await getDatabasePool(DB_URL)
  const targetSql = await readSqlFile(path.resolve(SQL_FUNCTIONS_DIR_PATH, TARGET_SQL_FILE))

  try {
    console.log('Executing functions.sql...')
    const result = await pool.connect((connection) => connection.query(sql.unsafe`${raw(targetSql)}`))

    console.log(`Result notice count: ${result.notices.length}`)

    console.log('Done.')
  } catch (error: unknown) {
    console.error('Error executing extensions/functions queries')
    console.error(error)
  } finally {
    await pool.end()
  }
}
