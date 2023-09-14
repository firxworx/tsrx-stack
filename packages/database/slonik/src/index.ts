// schemas are intentionally not exported: they are used internally by cli, respositories, and services

// external callers should only interface with either:
// - repositories created via repository factory methods
// - services created via service factory methods (as applicable) or directly (as applicable)

// the factory methods are a functional approach similar to how to class constructors are used

export * from './lib/client/config'
export * from './lib/client/slonik-pool'
export * from './lib/client/slonik-sql'

export * from './lib/helpers/table-operations/drop'
export * from './lib/helpers/table-operations/drop'

export * from './lib/interceptors/slonik-query-logging-interceptor'
export * from './lib/interceptors/slonik-result-parser-interceptor'

export * from './lib/query-building/query-helpers'
export * from './lib/query-building/query-ordering'
export * from './lib/query-building/query-values'
export * from './lib/query-building/query-builders'

export * from './lib/type-guards/slonik.type-guards'

export * from './lib/type-parsers/type-parser-presets'
export * from './lib/type-parsers/type-parsers'

export * from './lib/types/z-query-utils.types'

export * from './lib/zod-schemas/z-slonik'
