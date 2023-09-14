import { isRecord } from './record.type-guards'

// pnpm nx test common-toolbox

describe('commonToolbox type-guards', () => {
  describe('isRecord', () => {
    it('should allow objects aka records', () => {
      const test1 = { a: 1, b: 2 }
      const test2 = { a: 1, b: 2, c: 3 }
      const test3 = { a: 'hello', b: [2, 4], c: 'hello world', d: { e: 'asdf' } }
      const test4 = {}

      expect(isRecord(test1)).toEqual(true)
      expect(isRecord(test2)).toEqual(true)
      expect(isRecord(test3)).toEqual(true)
      expect(isRecord(test4)).toEqual(true)
    })

    it('should not allow arrays', () => {
      expect(isRecord([])).toEqual(false)
      expect(isRecord([{ hello: 42 }])).toEqual(false)
    })

    it('should not allow null or undefined', () => {
      expect(isRecord(null)).toEqual(false)
      expect(isRecord(undefined)).toEqual(false)
    })
  })
})
