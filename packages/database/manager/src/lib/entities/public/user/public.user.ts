import type { DatabasePool, IdentifierSqlToken, ListSqlToken } from 'slonik'
import { createFixture } from 'zod-fixture'
import * as argon2 from 'argon2'
import { faker } from '@faker-js/faker'

import { zCreateUserDto, zUserDao, zUserDto } from '@rfx/common-data'

import { sqlx, buildSqlColumnsList } from '@rfx/database-slonik'
import { createUserRepository } from './user.repository-factory'

export const userTableIdentifierTuple: [string, string] = ['public', 'user']
export const userTableSqlToken: IdentifierSqlToken = sqlx.identifier(userTableIdentifierTuple)

export const userFixture = createFixture(zCreateUserDto, { seed: 1 })
export const usersFixture = Array.from(Array(10), (_i, index) => createFixture(zCreateUserDto, { seed: index }))

export const userDtoSqlColumns: ListSqlToken = buildSqlColumnsList(zUserDto)
export const userDaoSqlColumns: ListSqlToken = buildSqlColumnsList(zUserDao)

const USERS_FIXTURE_DEV_SEED_PASSWORD = 'PassPass123' // use only in development

// @future use a transaction for seeding and/or do a builk insert and return a result such as a count
export async function seed(pool: DatabasePool): Promise<void> {
  const repository = createUserRepository(pool)

  const promises = usersFixture.map(async (fixture) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const user = await repository.create({
      ...fixture,
      name: faker.person.fullName({
        firstName,
        lastName,
      }),
      email: faker.internet
        .email({
          firstName,
          lastName,
        })
        .toLowerCase(),
      password: await argon2.hash(USERS_FIXTURE_DEV_SEED_PASSWORD), // use `fixture.password` for random passwords
      role: 'user',
    })

    return user
  })

  await Promise.all(promises)
  return
}

export async function drop(pool: DatabasePool): Promise<void> {
  const query = sqlx.typeAlias('void')`DROP TABLE IF EXISTS ${userTableSqlToken} CASCADE;`
  await pool.connect((connection) => connection.query(query))

  return
}
