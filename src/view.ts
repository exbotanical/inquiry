import { Query } from './query'

import type { PlainObject } from './types'

export class View<T extends PlainObject[]> {
  constructor(private readonly data: T) {}

  get() {
    return new Query(this.data)
  }
}
