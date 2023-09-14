import type { DatabasePool, ListSqlToken } from 'slonik'
import * as argon2 from 'argon2'

import { zCreateUserDto, zUpdateUserDto, zUserDao, zUserDto } from '@rfx/common-data'
import type { UserDto, CreateUserDto, UpdateUserDto, IdUidDto, UserDao } from '@rfx/common-data'

import {
  sqlx,
  buildSqlColumnsList,
  stringifyKeyValueDto,
  buildCreateOneQueryStatement,
  buildDeleteOneQueryStatement,
  buildSelectOneQueryStatement,
  buildUpdateOneQueryStatement,
} from '@rfx/database-slonik'
import type { AbstractDtoRepository } from '../../../types/abstract-dto-repository.types'
import { userTableSqlToken } from './public.user'

export interface UserRepository extends AbstractDtoRepository<UserDto, CreateUserDto, UpdateUserDto> {
  /**
   * Find a user by `id` and/or `uid` or return `undefined` if not found.
   * @throws {DataIntegrityError} if multiple rows found
   */
  find: (idUidDto: IdUidDto) => Promise<UserDto | undefined>

  /**
   * Find a user by email or return `undefined` if not found.
   * @throws {DataIntegrityError} if multiple rows found
   */
  findByEmail: (email: string) => Promise<UserDto | undefined>

  /**
   * Find a user by email for server-side authentication purposes or return `undefined` if not found.
   * Returns a `UserDao` object that includes sensitive fields for authentication purposes including `password`.
   *
   * Take care not to expose the data returned by this method to clients.
   *
   * @throws {DataIntegrityError} if multiple rows found
   */
  findByEmailForAuth: (email: string) => Promise<UserDao | undefined>
}

export const userDtoSqlColumns: ListSqlToken = buildSqlColumnsList(zUserDto)
export const userDaoSqlColumns: ListSqlToken = buildSqlColumnsList(zUserDao)

/**
 * Repository factory method that provides CRUD methods for User entities.
 */
export const createUserRepository = (pool: DatabasePool): UserRepository => ({
  async create(data) {
    const query = buildCreateOneQueryStatement(userTableSqlToken, zCreateUserDto, zUserDto, data)
    const result = await pool.connect((connection) => connection.one(query))

    return result
  },

  async update(data) {
    const transformedData = {
      ...data,
      ...(data.password ? { password: await argon2.hash(data.password) } : undefined),
    }

    const query = buildUpdateOneQueryStatement(userTableSqlToken, zUpdateUserDto, zUserDto, transformedData)
    const result = await pool.connect((connection) => connection.one(query))

    return result
  },

  async find(idUidDto) {
    const query = buildSelectOneQueryStatement(userTableSqlToken, idUidDto, zUserDto)

    console.log(query.sql)
    const result = await pool.connect((connection) => connection.maybeOne(query))

    return result ?? undefined
  },

  async findByEmail(email: string) {
    const result = await pool.connect((connection) =>
      connection.maybeOne(sqlx.type(zUserDto)`
      SELECT ${userDtoSqlColumns} FROM ${userTableSqlToken} WHERE email = ${email};
    `),
    )

    return result ?? undefined
  },

  async findByEmailForAuth(email: string) {
    const query = sqlx.type(zUserDao)`
      SELECT ${userDaoSqlColumns} FROM ${userTableSqlToken} WHERE email = ${email};
    `

    const result = await pool.connect(async (connection) => {
      return connection.maybeOne(query)
    })

    return result ?? undefined
  },

  async delete(idUidDto) {
    const query = buildDeleteOneQueryStatement(userTableSqlToken, idUidDto)
    const result = await pool.connect((connection) => connection.query(query))

    if (!result) {
      throw new Error(`Delete query failed for user identified by: ${stringifyKeyValueDto(idUidDto)}`)
    }

    return result.rowCount === 1
  },

  async getMany() {
    const result = pool.connect((connection) =>
      connection.many(sqlx.type(zUserDto)`
      SELECT ${userDtoSqlColumns} FROM ${userTableSqlToken} ORDER BY "name" ASC;
    `),
    )

    return result
  },

  // @future add support for dynamic sorting, filtering, pagination...
  // async getManyDynamic() {
  //   const sortableColumns = ['name', 'email', 'role']
  //   const filterableColumns = ['name', 'email', 'role']
  //   const result = pool.many(sqlx.type(zUserDto)`
  //     SELECT ${userDtoSqlColumns} FROM ${userTableSqlToken} ...;
  //   `)
  //   return result
  // }
})
