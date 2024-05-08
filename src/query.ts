import { Matcher } from './matcher'

import type {
  Conjunction,
  ExtractTypeFromPath,
  Path,
  Predicate,
  UnIndexed,
} from './types'

interface QueryStatement<T> {
  field: Path<UnIndexed<T>>
  cond: Predicate<T>
  and?: QueryStatement<T>
  or?: QueryStatement<T>
}

interface EqClause<T> {
  eq: T
}

interface ContainsClause<T> {
  contains: UnIndexed<T>
}

interface GtClause<T> {
  gt: T
}

interface GteClause<T> {
  gte: T
}

interface LtClause<T> {
  lt: T
}

interface LteClause<T> {
  lte: T
}

interface NotClause<T> {
  not: BaseOpts<T>
}

interface MatchClause<T> {
  match: (fn: T) => boolean
}

type BaseOpts<T> =
  | ContainsClause<T>
  | EqClause<T>
  | GtClause<T>
  | GteClause<T>
  | LtClause<T>
  | LteClause<T>
  | MatchClause<T>

type Opts<T> = BaseOpts<T> | NotClause<T>

export class Query<T extends Record<any, any> | Record<any, any>[]> {
  readonly #isArrayData // TODO: test non-array or remove

  readonly #initialData

  readonly #conjunctionStack: Conjunction[] = []

  readonly #queries: QueryStatement<T>[] = []

  constructor(private readonly data: T) {
    this.#isArrayData = Array.isArray(this.data)
    this.#initialData = (
      this.#isArrayData ? this.data : [this.data]
    ) as UnIndexed<T>[] // Technically, it's just a T but we need the distilled type for `runQuery`.
  }

  #getPredicate<S extends string>(
    opts: Opts<ExtractTypeFromPath<UnIndexed<typeof this.data>, S>>,
  ): Predicate<T> {
    if ('eq' in opts) {
      return Matcher.eq(opts.eq)
    }
    if ('contains' in opts) {
      return Matcher.contains(opts.contains)
    }
    if ('gt' in opts) {
      return Matcher.gt(opts.gt)
    }
    if ('gte' in opts) {
      return Matcher.gte(opts.gte)
    }
    if ('lt' in opts) {
      return Matcher.lt(opts.lt)
    }
    if ('lte' in opts) {
      return Matcher.gte(opts.lte)
    }
    if ('match' in opts) {
      return Matcher.match(opts.match)
    }

    throw Error('nomatch')
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

  where<T extends Path<UnIndexed<typeof this.data>>>(
    field: T,
    opts: Opts<ExtractTypeFromPath<UnIndexed<typeof this.data>, T>>,
  ) {
    const conjunction = this.#conjunctionStack.pop()

    const cond =
      'not' in opts
        ? Matcher.not(this.#getPredicate(opts.not))
        : this.#getPredicate(opts)

    if (conjunction) {
      const last = this.#queries[this.#queries.length - 1]
      const isAnd = conjunction === 'and'

      this.#queries[this.#queries.length - 1] = {
        field,
        cond,
        ...(isAnd ? { and: last } : { or: last }),
      }
    } else {
      this.#queries.push({
        field,
        cond,
      })
    }

    return {
      and: this.#and.bind(this),
      or: this.#or.bind(this),
      run: this.#run.bind(this),
    }
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
