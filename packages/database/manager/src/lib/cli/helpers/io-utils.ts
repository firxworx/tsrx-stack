import * as path from 'path'
import * as fs from 'fs/promises'
import fg from 'fast-glob'
import type { DatabasePool } from 'slonik'
import { SQL_ENTITY_SCHEMAS_DIR_PATH } from '../../../contants'

/**
 * Import a TypeScript function from the given `fileName` with the given `functionName` (default "main")
 * and return it.
 *
 * @throws Error if a function is not found in the module with the specified name
 */
export async function importFunctionFromFile<T extends (pool: DatabasePool) => Promise<void>>(
  filePath: string,
  functionName = 'main',
): Promise<(pool: DatabasePool) => Promise<void>> {
  const module = await import(filePath)
  const fn = module[functionName]

  if (typeof fn !== 'function') {
    throw new Error(`Function ${functionName} not found in module ${filePath}`)
  }

  return fn as T
}

/**
 * Use fast-glob to find a single file with the given `pattern` within the given `baseDirPath`.
 *
 * @returns resolved file path to the file or `undefined` if no file found
 * @throws Error if more than one matching file is found (should not happen if following convention)
 */
export async function findFilePattern(baseDirPath: string, pattern: string): Promise<string | undefined> {
  const filePathPattern = path.join(baseDirPath, '**', pattern)
  const paths = await fg(filePathPattern)

  if (paths.length === 1) {
    return path.resolve(paths[0] ?? '')
  }

  if (paths.length > 1) {
    throw new Error('More than one matching file found')
  }

  return undefined
}

export async function findSqlFile(fileName: string): Promise<string> {
  const result = await findFilePattern(SQL_ENTITY_SCHEMAS_DIR_PATH, `${fileName}.sql`)

  if (!result) {
    throw new Error(`Sql file not found: ${fileName}.sql`)
  }

  return result
}

export async function findTsFileByIdentifier(tableIdentifier: [string, string]): Promise<string> {
  const fileName = `${tableIdentifier[0]}.${tableIdentifier[1]}.ts`

  const result = await findFilePattern(SQL_ENTITY_SCHEMAS_DIR_PATH, fileName)

  if (!result) {
    throw new Error(`TypeScript file not found: ${fileName}.ts`)
  }

  return result
}

export async function findSqlFileByIdentifier(tableIdentifier: [string, string]): Promise<string> {
  const fileName = `${tableIdentifier[0]}.${tableIdentifier[1]}.sql`

  const result = await findFilePattern(SQL_ENTITY_SCHEMAS_DIR_PATH, fileName)

  if (!result) {
    throw new Error(`SQL file not found: ${fileName}.sql`)
  }

  return result
}

/**
 * Read an sql file (utf-8) with the given filename from disk and return its contents.
 */
export async function readSqlFile(filePath: string): Promise<string> {
  const resolvedFilePath = path.resolve(filePath)

  try {
    if (!filePath.endsWith('.sql')) {
      throw new Error('Model sql filename must have .sql extension')
    }

    return fs.readFile(resolvedFilePath, { encoding: 'utf-8' })
  } catch (error: unknown) {
    console.error(error)
    throw new Error(`Error reading sql file: ${resolvedFilePath}`)
  }
}

/**
 * Return the resolved (absolute) path to an sql file with the `schema.model.sql` naming convention
 * provided as a tuple: `[schema, model]`.
 */
export function resolveSqlFilePath(schemasDirPath: string, tableIdentifier: [string, string]): string {
  const fileName = `${tableIdentifier[0]}.${tableIdentifier[1]}.sql`
  return path.resolve(schemasDirPath, `${fileName}`)
}

/**
 * Return the resolved (absolute) path to a ts file with the `schema.model.ts` naming convention
 * provided as a tuple: `[schema, model]`.
 */
export function resolveTsFilePath(schemasDirPath: string, tableIdentifier: [string, string]): string {
  const fileName = `${tableIdentifier[0]}.${tableIdentifier[1]}.ts`
  return path.resolve(schemasDirPath, `${fileName}`)
}
