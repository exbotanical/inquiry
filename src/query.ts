import type { Conjunction, Path, Predicate, UnIndexed } from './types'

interface QueryStatement<T> {
  field: Path<UnIndexed<T>>
  cond: Predicate<T>
  and?: QueryStatement<T>
  or?: QueryStatement<T>
}

export class Query<T> {
  readonly #isArrayData
  readonly #initialData

  constructor(private readonly data: T) {
    this.#isArrayData = Array.isArray(this.data)
    this.#initialData = (
      this.#isArrayData ? this.data : [this.data]
    ) as UnIndexed<T>[] // Technically, it's just a T but we need the distilled type for `runQuery`.
  }

  readonly #conjunctionStack: Conjunction[] = []
  readonly #queries: QueryStatement<T>[] = []

  where(field: Path<UnIndexed<T>>, pred: Predicate<T>) {
    const conjunction = this.#conjunctionStack.pop()

    if (conjunction) {
      const last = this.#queries[this.#queries.length - 1]
      const isAnd = conjunction === 'and'

      this.#queries[this.#queries.length - 1] = {
        field,
        cond: pred,
        ...(isAnd ? { and: last } : { or: last }),
      }
    } else {
      this.#queries.push({
        field,
        cond: pred,
      })
    }

    return {
      and: this.#and.bind(this),
      or: this.#or.bind(this),
      run: this.#run.bind(this),
    }
  }

  #and(): { where: Query<T>['where'] } {
    this.#conjunctionStack.push('and')

    return {
      where: this.where.bind(this),
    }
  }

  #or(): { where: Query<T>['where'] } {
    this.#conjunctionStack.push('or')

    return {
      where: this.where.bind(this),
    }
  }

  #run(): UnIndexed<T>[] {
    return this.#queries.reduce(
      (acc, query) => [...acc.filter(el => runQuery(query, el))],
      this.#initialData,
    )
  }
}

function runQuery<T>(query: QueryStatement<T>, el: UnIndexed<T>): boolean {
  if (query.and) {
    return query.cond(el, query.field) && runQuery(query.and, el)
  }

  if (query.or) {
    return query.cond(el, query.field) || runQuery(query.or, el)
  }
  return query.cond(el, query.field)
}
