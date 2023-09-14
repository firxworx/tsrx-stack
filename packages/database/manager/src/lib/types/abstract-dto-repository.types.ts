import type { IdUidDto } from '@rfx/common-data'

/**
 * Generic interface for an abstract (reusable template) DTO repository that implments CRUD methods.
 *
 * This interface serves as the return value of a factory function that accepts a `DatabasePool` and
 * returns a repository object with methods for each CRUD operation.
 *
 * create/update/find/delete methods accept the `IdUidDto` interface where one or both of `id` and `uid`
 * must be defined to uniquely identify underlying database records.
 *
 * This interface can be extended to support additional functionality as required.
 *
 * The naming convention of _get_ vs. _find_ should be observed: in cases where no data is found `get*`
 * prefix functions will throw an error whereas `find` will return `undefined`.
 */
export interface AbstractDtoRepository<DTO, CreateDTO, UpdateDTO> {
  /**
   * @throws {DataIntegrityError} if multiple rows are returned
   * @throws {UniqueViolationError} if a unique constraint is violated
   */
  create: (cdto: CreateDTO) => Promise<DTO>

  /**
   * @throws {NotFoundError}
   * @throws {DataIntegrityError} if multiple rows are returned
   * @throws {InvalidInputError} if no fields are provided to update
   */
  update: (udto: IdUidDto & UpdateDTO) => Promise<DTO>

  /**
   * Find by `id` and/or `uid` or return `undefined` if not found.
   * @throws {DataIntegrityError} if multiple rows found
   */
  find: (idUidDto: IdUidDto) => Promise<DTO | undefined>

  /**
   * Returns a promise that resolves to `true` on success and `false` if no record found with `id`.
   */
  delete: (idUidDto: IdUidDto) => Promise<boolean>

  /**
   *
   * @throws {NotFoundError}
   */
  getMany: () => Promise<Readonly<DTO[]>>
}
