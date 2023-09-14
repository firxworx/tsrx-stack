import { camelToSnake } from './string-casing'

// pnpm nx test slonik-toolbox -- --testFilePattern=string-utils.test.ts

describe('camelToSnake', () => {
  it('converts camelCase to lower snake_case', () => {
    const tests = [
      {
        test: 'camelCase',
        expected: 'camel_case',
      },
      {
        test: 'camelCaseExample',
        expected: 'camel_case_example',
      },
      {
        test: 'camelCaseMultiSegmentExample',
        expected: 'camel_case_multi_segment_example',
      },
    ]

    for (const { test, expected } of tests) {
      expect(camelToSnake(test)).toEqual(expected)
    }
  })
})
