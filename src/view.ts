import { Query } from './query'

export class View<T> {
  constructor(private readonly data: T) {}

  get() {
    return new Query<T>(this.data)
  }
}
