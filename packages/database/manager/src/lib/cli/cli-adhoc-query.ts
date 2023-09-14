import { getDatabasePool } from '@rfx/database-slonik'
import { createUserRepository } from '../entities/public/user/user.repository-factory'

/*
 * One-off scratch-pad utility to help devs write/test queries and repositories during development.
 *
 * Use this file as a template and modify or extend it to suit your needs.
 *
 * Execute via: `pnpm cli:pg:adhoc`
 *
 * The script defined in `package.json` will load the project root `.env` and expand environment
 * variables using dotenv-expand e.g. to support `DATABASE_URL` as a composite of other values.
 *
 * Nx tip: The package `@nx/devkit` exports `{workspaceRoot}` which resolves to the root of the Nx workspace.
 *         You can use this to build paths to `.env`, `.sql`, etc. files in the project.
 */

main()
  .then(() => console.log('\nDone.'))
  .catch(console.error)

const printResult = (input: unknown): void => console.log(JSON.stringify(input, null, 2))

async function main(): Promise<void> {
  const DB_URL = String(process.env['DB_URL'] ?? '')

  // example of getting the table identifier <schema>.<table> from cli arguments
  // const modelArg = String(process.argv[2])
  // const tableTuple = zTableIdentifier.safeParse(modelArg.split('.'))

  const pool = await getDatabasePool(DB_URL)
  const repository = createUserRepository(pool)

  try {
    console.log(`Get user...`)
    printResult(await repository.find({ id: 1 }))

    console.log(`Get users...`)
    printResult(await repository.getMany())

    console.log(`Update user...`)
    printResult(await repository.update({ uid: '1', name: 'Testy McTesterson' }))

    console.log(`Delete user...`)
    printResult(await repository.delete({ uid: '' }))

    console.log(`Update user...`)
    printResult(
      await repository.update({
        uid: '26167778-3747-4ee0-b42a-ce9e88180b7b',
        name: 'test',
        email: 'hello@hello.com',
      }),
    )
  } catch (error: unknown) {
    console.error(error)

    await pool.end()
    process.exit(1)
  } finally {
    await pool.end()
  }
}
