import assert from 'node:assert'
import { describe, it } from 'node:test'

import { getField } from '../src/utils'

describe('utils test', () => {
  describe('getField', () => {
    it('retrieves the top-level field', () => {
      const o = {
        x: 1,
        y: 2,
      }

      assert.strictEqual(getField(o, 'x'), 1)
    })

    it('retrieves the second-level field', () => {
      const o = {
        x: {
          a: 1,
          b: 2,
        },
        y: 3,
      }

      assert.strictEqual(getField(o, 'x.a'), 1)
    })

    it('retrieves the heavily nested field', () => {
      const o = {
        x: {
          a: {
            b: {
              e: { h: { i: { j: 1, k: 2001, l: 4 }, m: 99 }, o: 109 },
              f: '36',
              g: [1, 2],
            },
            c: 12,
          },
          d: 2,
        },
        y: 3,
      }

      assert.strictEqual(getField(o, 'x.a.b.e.h.i.k'), 2001)
    })

    it('resolves a null value to null', () => {
      const o = {
        a: 1,
        b: null,
      }

      assert.strictEqual(getField(o, 'b'), null)
    })

    it('resolves an undefined value to undefined', () => {
      const o = {
        a: 1,
        b: undefined,
      }

      assert.strictEqual(getField(o, 'b'), undefined)
    })

    it("doesn't fail when selecting a nested field behind a null nullable member", () => {
      interface O {
        a: number
        b: {
          c: number
          d: {
            e: number
          }
        } | null
      }

      const o: O = {
        a: 1,
        b: null,
      }

      assert.strictEqual(getField(o, 'b'), null)
      assert.strictEqual(getField(o, 'b.d'), undefined)
      assert.strictEqual(getField(o, 'b.d.e'), undefined)
    })
  })
})
