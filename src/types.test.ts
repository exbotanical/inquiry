import { expectTypeOf } from 'expect-type'
import type { Path, ExtractTypeFromPath, UnIndexed, Predicate } from './types'
import { describe, test } from 'node:test'

interface Obj {
  a: string
  b: number
  d: {
    r: number
    q: string
    w: [
      {
        n: number
      },
    ]
    x: {
      p: string
    }
  }
}

// node test is a no-op here - just aesthetic
describe('type tests', () => {
  test('Path', () => {
    expectTypeOf<'a'>().toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'b'>().toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'c'>().not.toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'d.r'>().toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'d.q'>().toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'d.w'>().toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'d.w.n'>().not.toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'d.x'>().toMatchTypeOf<Path<Obj>>()
    expectTypeOf<'d.x.p'>().toMatchTypeOf<Path<Obj>>()
  })

  test('ExtractTypeFromPath', () => {
    expectTypeOf<ExtractTypeFromPath<Obj, 'a'>>().toBeString()
    expectTypeOf<ExtractTypeFromPath<Obj, 'b'>>().toBeNumber()
    expectTypeOf<ExtractTypeFromPath<Obj, 'c'>>().toBeNever()
    expectTypeOf<ExtractTypeFromPath<Obj, 'd.r'>>().toBeNumber()
    expectTypeOf<ExtractTypeFromPath<Obj, 'd.q'>>().toBeString()
    expectTypeOf<ExtractTypeFromPath<Obj, 'd.w'>>().toMatchTypeOf<
      Obj['d']['w']
    >()
    expectTypeOf<ExtractTypeFromPath<Obj, 'd.w.n'>>().toBeNever()
    expectTypeOf<ExtractTypeFromPath<Obj, 'd.x'>>().toMatchTypeOf<
      Obj['d']['x']
    >()
    expectTypeOf<ExtractTypeFromPath<Obj, 'd.x.p'>>().toBeString()
  })

  test('UnIndexed', () => {
    expectTypeOf<UnIndexed<Obj>>().toMatchTypeOf<Obj>()
    expectTypeOf<UnIndexed<Array<Obj>>>().toMatchTypeOf<Obj>()
  })

  test('Predicate', () => {
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'a')
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'b')
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'd.r')
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'd.q')
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'd.w')
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'd.x')
    expectTypeOf<Predicate<Obj[]>>().toBeCallableWith({} as Obj, 'd.x.p')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'a')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'b')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.r')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.q')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.w')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.x')
    expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.x.p')

    // TODO: negative test cases - currently, expect-type doesn't support not.toBeCallableWith without a ts-ignore comment,
    // which means any test failure is also suppressed; thus it would be useless
  })
})
