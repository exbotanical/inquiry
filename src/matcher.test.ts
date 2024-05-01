import { describe, it } from 'node:test'
import { Matcher } from './matcher'
import assert from 'node:assert'

describe('matcher functions', () => {
  describe('eq', () => {
    it('matches string equality', () => {
      const fn = Matcher.eq('somestring')
      const ret = fn({ p: 'somestring' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches string equality (negative)', () => {
      const fn = Matcher.eq('somestring')
      const ret = fn({ p: 'x' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches number equality', () => {
      const fn = Matcher.eq(12)
      const ret = fn({ p: 12 }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches number equality (negative)', () => {
      const fn = Matcher.eq(12)
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string equality', () => {
      const fn = Matcher.not(Matcher.eq('somestring'))
      const ret = fn({ p: 'somestring' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string equality (negative)', () => {
      const fn = Matcher.not(Matcher.eq('somestring'))
      const ret = fn({ p: 'x' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches negated number equality', () => {
      const fn = Matcher.not(Matcher.eq(12))
      const ret = fn({ p: 12 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated number equality (negative)', () => {
      const fn = Matcher.not(Matcher.eq(12))
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, true)
    })
  })

  describe('gt', () => {
    it('matches string greater-than comparison', () => {
      const fn = Matcher.gt('abc')
      const ret = fn({ p: 'abd' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches string greater-than comparison (negative)', () => {
      const fn = Matcher.gt('abc')
      const ret = fn({ p: 'abc' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches number greater-than comparison', () => {
      const fn = Matcher.gt(12)
      const ret = fn({ p: 13 }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches number greater-than comparison (negative)', () => {
      const fn = Matcher.gt(12)
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string greater-than comparison', () => {
      const fn = Matcher.not(Matcher.gt('abc'))
      const ret = fn({ p: 'abd' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string greater-than comparison (negative)', () => {
      const fn = Matcher.not(Matcher.gt('abc'))
      const ret = fn({ p: 'abb' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches negated number greater-than comparison', () => {
      const fn = Matcher.not(Matcher.gt(12))
      const ret = fn({ p: 13 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated number greater-than comparison (negative)', () => {
      const fn = Matcher.not(Matcher.gt(12))
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, true)
    })
  })

  describe('lt', () => {
    it('matches string less-than comparison', () => {
      const fn = Matcher.lt('abc')
      const ret = fn({ p: 'abb' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches string less-than comparison (negative)', () => {
      const fn = Matcher.lt('abc')
      const ret = fn({ p: 'abc' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches number less-than comparison', () => {
      const fn = Matcher.lt(12)
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches number less-than comparison (negative)', () => {
      const fn = Matcher.lt(12)
      const ret = fn({ p: 12 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string less-than comparison', () => {
      const fn = Matcher.not(Matcher.lt('abc'))
      const ret = fn({ p: 'abb' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string less-than comparison (negative)', () => {
      const fn = Matcher.not(Matcher.lt('abc'))
      const ret = fn({ p: 'abd' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches negated number less-than comparison', () => {
      const fn = Matcher.not(Matcher.lt(12))
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated number less-than comparison (negative)', () => {
      const fn = Matcher.not(Matcher.lt(12))
      const ret = fn({ p: 13 }, 'p')

      assert.strictEqual(ret, true)
    })
  })

  describe('gte', () => {
    it('matches string greater-than-or-equal comparison', () => {
      const fn = Matcher.gte('abc')
      const ret = fn({ p: 'abc' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches string greater-than-or-equal comparison (negative)', () => {
      const fn = Matcher.gte('abc')
      const ret = fn({ p: 'abb' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches number greater-than-or-equal comparison', () => {
      const fn = Matcher.gte(12)
      const ret = fn({ p: 12 }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches number greater-than-or-equal comparison (negative)', () => {
      const fn = Matcher.gte(12)
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string greater-than-or-equal comparison', () => {
      const fn = Matcher.not(Matcher.gte('abc'))
      const ret = fn({ p: 'abc' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string greater-than-or-equal comparison (negative)', () => {
      const fn = Matcher.not(Matcher.gte('abc'))
      const ret = fn({ p: 'abb' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches negated number greater-than-or-equal comparison', () => {
      const fn = Matcher.not(Matcher.gte(12))
      const ret = fn({ p: 13 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated number greater-than-or-equal comparison (negative)', () => {
      const fn = Matcher.not(Matcher.gte(12))
      const ret = fn({ p: 11 }, 'p')

      assert.strictEqual(ret, true)
    })
  })

  describe('lte', () => {
    it('matches string less-than-or-equal comparison', () => {
      const fn = Matcher.lte('abc')
      const ret = fn({ p: 'abc' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches string less-than-or-equal comparison (negative)', () => {
      const fn = Matcher.lte('abc')
      const ret = fn({ p: 'abd' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches number less-than-or-equal comparison', () => {
      const fn = Matcher.lte(12)
      const ret = fn({ p: 12 }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches number less-than-or-equal comparison (negative)', () => {
      const fn = Matcher.lte(12)
      const ret = fn({ p: 13 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string less-than-or-equal comparison', () => {
      const fn = Matcher.not(Matcher.lte('abc'))
      const ret = fn({ p: 'abc' }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated string less-than-or-equal comparison (negative)', () => {
      const fn = Matcher.not(Matcher.lte('abc'))
      const ret = fn({ p: 'abd' }, 'p')

      assert.strictEqual(ret, true)
    })

    it('matches negated number less-than-or-equal comparison', () => {
      const fn = Matcher.not(Matcher.lte(12))
      const ret = fn({ p: 12 }, 'p')

      assert.strictEqual(ret, false)
    })

    it('matches negated number less-than-or-equal comparison (negative)', () => {
      const fn = Matcher.not(Matcher.lte(12))
      const ret = fn({ p: 13 }, 'p')

      assert.strictEqual(ret, true)
    })
  })
})