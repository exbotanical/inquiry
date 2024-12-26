import assert from 'node:assert'
import { describe, it } from 'node:test'

import { View } from '../src'

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
  x?: string
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
  x: '',
}

const complex: ComplexField[] = [complex1, complex2, complex3]

interface LargeConfig {
  id: string
  name: string
  timestamp: number
  owner: {
    teamName: string
    email: string
  }
  configs: { id: string; type: string }[]
  numbers: number[]
  unit: number
}

const configs: LargeConfig[] = [
  {
    id: '123',
    name: 'config1',
    timestamp: Date.now(),
    owner: {
      email: 'a@a.com',
      teamName: 'a team',
    },
    configs: [
      {
        id: 'k8s',
        type: 'deployment',
      },
      {
        id: 'node',
        type: 'runtime',
      },
    ],
    numbers: [8, 13, 16, 21, 42],
    unit: 1333412290,
  },
  {
    id: '456',
    name: 'config2',
    timestamp: Date.now(),
    owner: {
      email: 'b@b.com',
      teamName: 'b team',
    },
    configs: [
      {
        id: 'k8s',
        type: 'deployment',
      },
      {
        id: 'ecs',
        type: 'container',
      },
      {
        id: 'lambda',
        type: 'srv',
      },
      {
        id: 'cdk',
        type: 'infra',
      },
      {
        id: 'smithy',
        type: 'contract',
      },
    ],
    numbers: [9, 13, 1],
    unit: 10092993011,
  },
  {
    id: '789',
    name: 'config3',
    timestamp: Date.now(),
    owner: {
      email: 'c@c.com',
      teamName: 'b team',
    },
    configs: [
      {
        id: 'node',
        type: 'runtime',
      },
    ],
    numbers: [36, 35, 36],
    unit: 4323412881,
  },
]

describe('fluent query api', () => {
  it('runs a basic query', () => {
    const result = new View(animals)
      .get()
      .where('type', { not: { eq: 'elephant' } })
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], { type: 'snake', name: 'snebby' })
    assert.deepEqual(result[1], { type: 'monkey', name: 'looloo' })
  })

  it('runs a basic AND query', () => {
    const result = new View(animals)
      .get()
      .where('type', { not: { eq: 'elephant' } })
      .and()
      .where('name', { not: { eq: 'snebby' } })
      .run()

    assert.strictEqual(result.length, 1)
    assert.deepEqual(result[0], { type: 'monkey', name: 'looloo' })
  })

  it('runs a basic OR query', () => {
    const result = new View(animals)
      .get()
      .where('type', { eq: 'elephant' })
      .or()
      .where('name', { eq: 'snebby' })
      .run()

    assert.strictEqual(result.length, 3)
    assert.deepEqual(result[0], { type: 'elephant', name: 'bobo' })
    assert.deepEqual(result[1], { type: 'elephant', name: 'bobo2' })
    assert.deepEqual(result[2], { type: 'snake', name: 'snebby' })
  })

  it('runs a basic compound query', () => {
    const result = new View(animals)
      .get()
      .where('type', { eq: 'elephant' })
      .and()
      .where('name', { not: { eq: 'bobo2' } })
      .or()
      .where('name', { eq: 'snebby' })
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], { type: 'elephant', name: 'bobo' })
    assert.deepEqual(result[1], { type: 'snake', name: 'snebby' })
  })

  it('runs a compound query that distills into no results', () => {
    const result = new View(animals)
      .get()
      .where('type', { eq: 'elephant' })
      .and()
      .where('type', { eq: 'snake' })
      .run()

    assert.strictEqual(result.length, 0)
  })

  it('runs a complex compound query', () => {
    const result = new View(complex)
      .get()
      .where('age', { gt: 33 })
      .or()
      .where('age', { lt: 22 })
      .and()
      .where('hometown.city', { not: { eq: 'London' } })
      .run()

    assert.strictEqual(result.length, 1)
    assert.deepEqual(result[0], complex1)
  })

  it('runs a complex compound query (again)', () => {
    const result = new View(configs)
      .get()
      .where('timestamp', { lt: Date.now() })
      .and()
      .where('configs', {
        contains: {
          id: 'node',
          type: 'runtime',
        },
      })
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], configs[0])
    assert.deepEqual(result[1], configs[2])
  })

  it('conjunctions are left-associative', () => {
    const view = new View([
      { x: 1, y: 2 },
      { x: 10, y: 2 },
      { x: 122, y: 2 },
      { x: 13, y: 22 },
    ])

    const r1 = view
      .get()
      .where('x', { gt: 10 })
      .and()
      .where('y', { gt: 10 })
      .or()
      .where('x', { eq: 1 })
      .run()

    const r2 = view
      .get()
      .where('x', { gt: 10 })
      .or()
      .where('x', { eq: 1 })
      .and()
      .where('y', { gt: 10 })
      .run()

    assert.equal(r1.length, 2)
    assert.equal(r1[0].x, 1)
    assert.equal(r1[1].x, 13)
    assert.equal(r2.length, 1)
    assert.equal(r2[0].x, 13)
  })

  it('runs a query using the filter escape hatch', () => {
    const result = new View(configs)
      .get()
      .where('timestamp', { lt: Date.now() })
      .and()
      .where('configs', {
        filter: configs => configs.some(config => config.id === 'node'),
      })
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], configs[0])
    assert.deepEqual(result[1], configs[2])
  })

  it('runs a query against scalar values using the filter escape hatch', () => {
    const result = new View(configs)
      .get()
      .where('numbers', {
        filter: numbers => numbers.includes(1) || numbers.includes(36),
      })
      .run()

    assert.strictEqual(result.length, 2)
    assert.deepEqual(result[0], configs[1])
    assert.deepEqual(result[1], configs[2])
  })

  it('empty clause', () => {
    const view = new View(complex)

    const r1 = view
      .get()
      .where('x', {
        empty: true,
      })
      .run()

    const r2 = view
      .get()
      .where('x', {
        empty: false,
      })
      .run()

    const r3 = view
      .get()
      .where('x', {
        not: {
          empty: false,
        },
      })
      .run()

    assert.equal(r1[0].name, 'Coopa Uluru')
    assert.equal(r1.length, 1)
    assert.equal(r2.length, 2)
    assert.equal(r3[0].name, 'Coopa Uluru')
    assert.equal(r3.length, 1)
  })

  it('length clause (min)', () => {
    const view = new View(complex)

    const r1 = view
      .get()
      .where('hometown.city', {
        len: {
          min: 7,
        },
      })
      .run()

    assert.equal(r1[0].hometown.city, 'Houston')
    assert.equal(r1.length, 1)
  })

  it('length clause (max)', () => {
    const view = new View(complex)

    const r1 = view
      .get()
      .where('hometown.city', {
        len: {
          max: 6,
        },
      })
      .run()

    assert.equal(r1[0].hometown.city, 'Athens')
    assert.equal(r1.length, 2)
  })

  it('length clause (minmax)', () => {
    const view = new View(complex)

    const r1 = view
      .get()
      .where('hometown.country', {
        len: {
          min: 0,
          max: 2,
        },
      })
      .run()

    // TODO: Mutators
    // view.set('x').where('hometown.country', {
    //   len: {
    //     min: 0,
    //     max: 2,
    //   },
    // })
    assert.equal(r1[0].hometown.country, 'UK')
    assert.equal(r1.length, 1)
  })
})
