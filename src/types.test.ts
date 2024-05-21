// TODO: negative test cases - currently, expect-type doesn't support
// not.toBeCallableWith without a ts-ignore comment, which means any
// test failure is also suppressed; thus it would be useless
import { describe, test } from 'node:test'

import { expectTypeOf } from 'expect-type'

import type { Path, ExtractTypeFromPath, UnIndexed, Predicate } from './types'
import { Matcher } from './matcher'
import { configs } from './query.test'
import { Query } from './query'

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
  describe('utility types', () => {
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
      expectTypeOf<UnIndexed<Obj[]>>().toMatchTypeOf<Obj>()
    })

    test('Predicate', () => {
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'a')
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'b')
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.r')
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.q')
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.w')
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.x')
      expectTypeOf<Predicate<Obj>>().toBeCallableWith({} as Obj, 'd.x.p')
    })
  })

  test('matchers', () => {
    expectTypeOf(Matcher.gt).toBeCallableWith('')
    expectTypeOf(Matcher.gt).toBeCallableWith(1)

    expectTypeOf(Matcher.gte).toBeCallableWith('')
    expectTypeOf(Matcher.gte).toBeCallableWith(1)

    expectTypeOf(Matcher.lt).toBeCallableWith('')
    expectTypeOf(Matcher.lt).toBeCallableWith(1)

    expectTypeOf(Matcher.lte).toBeCallableWith('')
    expectTypeOf(Matcher.lte).toBeCallableWith(1)

    expectTypeOf(Matcher.eq).toBeCallableWith('')
    expectTypeOf(Matcher.eq).toBeCallableWith(1)

    expectTypeOf(Matcher.contains).toBeCallableWith('')
    expectTypeOf(Matcher.contains).toBeCallableWith(1)
    expectTypeOf(Matcher.contains).toBeCallableWith({ a: 1 })
    expectTypeOf(Matcher.contains).toBeCallableWith([{ a: 1 }])
    expectTypeOf(Matcher.contains).toBeCallableWith(null)
    expectTypeOf(Matcher.contains).toBeCallableWith(undefined)
    expectTypeOf(Matcher.contains).toBeCallableWith(NaN)

    expectTypeOf(Matcher.filter).toBeCallableWith(_ => true)
    expectTypeOf(Matcher.filter<{ a: { a: number } }, 'a'>).toBeCallableWith(
      ({ a }) => true,
    )
    expectTypeOf(
      Matcher.filter<{ a: { b: string; c: { d: number } } }, 'a.c.d'>,
    ).toBeCallableWith((_: number) => true)
    expectTypeOf(Matcher.filter<{ a: number[] }, 'a'>).toBeCallableWith(
      (_: number[]) => true,
    )

    expectTypeOf(Matcher.gt('')).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.gt(1)).toBeCallableWith({ a: 1 }, 'a')

    expectTypeOf(Matcher.gte('')).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.gte(1)).toBeCallableWith({ a: 1 }, 'a')

    expectTypeOf(Matcher.lt('')).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.lt(1)).toBeCallableWith({ a: 1 }, 'a')

    expectTypeOf(Matcher.lte('')).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.lte(1)).toBeCallableWith({ a: 1 }, 'a')

    expectTypeOf(Matcher.eq('')).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.eq(1)).toBeCallableWith({ a: 1 }, 'a')

    expectTypeOf(Matcher.contains('')).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.contains(1)).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.contains({})).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.contains([])).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.contains(null)).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.contains(undefined)).toBeCallableWith({ a: 1 }, 'a')
    expectTypeOf(Matcher.contains(NaN)).toBeCallableWith({ a: 1 }, 'a')

    // expectTypeOf(Matcher.filter(_ => true)).toBeCallableWith({ a: 1 }, 'a')
    // expectTypeOf(
    //   Matcher.filter<{ a: { a: number } }, 'a'>(({ a }) => true),
    // ).toBeCallableWith({ a: { a: 1 } }, 'a')
    // expectTypeOf(
    //   Matcher.filter<{ a: { b: string; c: { d: number } } }, 'a.c.d'>(
    //     (_: number) => true,
    //   ),
    // ).toBeCallableWith({ a: { b: 'a', c: { d: 1 } } }, 'a.c.d')
    // expectTypeOf(
    //   Matcher.filter<{ a: number[] }, 'a'>((_: number[]) => true),
    // ).toBeCallableWith({ a: [1] }, 'a')
  })
})
