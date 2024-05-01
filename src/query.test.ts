import assert from 'node:assert'
import { describe, it } from 'node:test'

import { Matcher, View } from '.'

interface Animal {
  type: string
  name: string
}

const animals: Animal[] = [
  { type: 'elephant', name: 'bobo' },
  { type: 'elephant', name: 'bobo2' },
  { type: 'snake', name: 'snebby' },
  { type: 'monkey', name: 'looloo' },
]

interface Hometown {
  country: string
  city: string
}

interface ComplexField {
  pet: Animal
  name: string
  age: number
  hometown: Hometown
}

const complex1 = {
  age: 21,
  hometown: {
    city: 'Houston',
    country: 'USA',
  },
  name: 'Scoop Bailey',
  pet: {
    name: 'Hootie',
    type: 'elephant',
  },
}

const complex2 = {
  age: 32,
  hometown: {
    city: 'Athens',
    country: 'Greece',
  },
  name: 'Thoros Soponosososos',
  pet: {
    name: 'BEEDOLE',
    type: 'beetle',
  },
}

const complex3 = {
  age: 37,
  hometown: {
    city: 'London',
    country: 'UK',
  },
  name: 'Coopa Uluru',
  pet: {
    name: 'greedle',
    type: 'beetle',
  },
}

const complex: ComplexField[] = [complex1, complex2, complex3]

describe('api', () => {
  it('runs a basic query', () => {
    const result = new View(animals)
      .get()
      .where('type', Matcher.not(Matcher.eq('elephant')))
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], { type: 'snake', name: 'snebby' })
    assert.deepEqual(result[1], { type: 'monkey', name: 'looloo' })
  })

  it('runs a basic AND query', () => {
    const result = new View(animals)
      .get()
      .where('type', Matcher.not(Matcher.eq('elephant')))
      .and()
      .where('name', Matcher.not(Matcher.eq('snebby')))
      .run()

    assert.strictEqual(result.length, 1)
    assert.deepEqual(result[0], { type: 'monkey', name: 'looloo' })
  })

  it('runs a basic OR query', () => {
    const result = new View(animals)
      .get()
      .where('type', Matcher.eq('elephant'))
      .or()
      .where('name', Matcher.eq('snebby'))
      .run()

    assert.strictEqual(result.length, 3)
    assert.deepEqual(result[0], { type: 'elephant', name: 'bobo' })
    assert.deepEqual(result[1], { type: 'elephant', name: 'bobo2' })
    assert.deepEqual(result[2], { type: 'snake', name: 'snebby' })
  })

  it('runs a basic compound query', () => {
    const result = new View(animals)
      .get()
      .where('type', Matcher.eq('elephant'))
      .and()
      .where('name', Matcher.not(Matcher.eq('bobo2')))
      .or()
      .where('name', Matcher.eq('snebby'))
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], { type: 'elephant', name: 'bobo' })
    assert.deepEqual(result[1], { type: 'snake', name: 'snebby' })
  })

  it('runs a compound query that distills into no results', () => {
    const result = new View(animals)
      .get()
      .where('type', Matcher.eq('elephant'))
      .and()
      .where('type', Matcher.eq('snake'))
      .run()

    assert.strictEqual(result.length, 0)
  })

  it('runs a complex compound query', () => {
    const result = new View(complex)
      .get()
      .where('age', Matcher.gt(33))
      .or()
      .where('age', Matcher.lt(22))
      .and()
      .where('hometown.city', Matcher.not(Matcher.eq('London')))
      .run()

    assert.strictEqual(result.length, 1)
    assert.deepEqual(result[0], complex1)
  })
})
