import type { Post } from './posts.contract'
import { faker } from '@faker-js/faker'

const MOCK_TAGS = Array.from({ length: 10 }, () => faker.lorem.word()).map((word, index) => `${word}${index}`)

const randomSlice = <T>(input: T[]): T[] => {
  const sliceEnd = Math.floor(Math.random() * (input.length + 1))
  return faker.helpers.shuffle(input).slice(0, sliceEnd)
}

export const mockPostFixtureFactory = (partial?: Partial<Post>): Post => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence({ min: 3, max: 5 }),
  content: faker.lorem.paragraph({ min: 1, max: 5 }),
  description: faker.lorem.sentence({ min: 5, max: 15 }),
  published: true,
  tags: randomSlice(MOCK_TAGS), // ['tag1', 'tag2'],
  ...partial,
})

type OwnedPost = Post & { ownerId: string }

export const mockOwnedResource = (_resource: 'post', partial: Partial<OwnedPost>): OwnedPost => {
  const { ownerId, ...restPost } = partial
  return {
    // id: 'mock-id',
    // ownerId: 'mock-owner-id',
    // title: faker.lorem.sentence({ min: 3, max: 5 }),
    // content: `Content`,
    // description: `Description`,
    // published: true,
    // tags: ['tag1', 'tag2'],
    ownerId: ownerId ?? faker.string.uuid(),
    ...mockPostFixtureFactory(restPost),
    ...partial,
  }
}
