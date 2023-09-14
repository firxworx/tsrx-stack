import * as path from 'path'
import { workspaceRoot } from '@nx/devkit'

export const SQL_ENTITY_SCHEMAS_DIR_PATH = path.join(workspaceRoot, 'packages/database/manager/src/lib/entities')
export const SQL_FUNCTIONS_DIR_PATH = path.join(workspaceRoot, 'packages/database/manager/sql')
