import { Matcher } from './matcher'

import type {
  Conjunction,
  ExtractTypeFromPath,
  Path,
  PlainObject,
  Predicate,
  UnIndexed,
} from './types'

interface QueryStatement<T> {
  field: Path<T>
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

interface FilterClause<T> {
  filter: (fn: T) => boolean
}

type BaseOpts<T> =
  | ContainsClause<T>
  | EqClause<T>
  | GtClause<T>
  | GteClause<T>
  | LtClause<T>
  | LteClause<T>
  | FilterClause<T>

type Opts<T> = BaseOpts<T> | NotClause<T>

type WhereSubset<T extends PlainObject[]> = { where: Query<T>['where'] }

export class Query<T extends PlainObject[]> {
  readonly #initialData: UnIndexed<T>[]
  readonly #conjunctionStack: Conjunction[] = []
  readonly #queries: QueryStatement<UnIndexed<T>>[] = []

  constructor(private readonly data: T) {
    this.#initialData = this.data as unknown as UnIndexed<T>[]
  }

  #getPredicate<S extends string>(
    opts: Opts<ExtractTypeFromPath<UnIndexed<T>, S>>,
  ): Predicate<UnIndexed<T>> {
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
    if ('filter' in opts) {
      // https://github.com/microsoft/TypeScript/issues/33133
      return Matcher.filter<any, any>(opts.filter)
    }

    throw Error('nomatch')
  }

  #and(): WhereSubset<T> {
    this.#conjunctionStack.push('and')

    return {
      where: this.where.bind(this),
    }
  }

  #or(): WhereSubset<T> {
    this.#conjunctionStack.push('or')

    return {
      where: this.where.bind(this),
    }
  }

  #run(): UnIndexed<T>[] {
    return this.#queries.reduce(
      (acc, query) => acc.filter(el => runQuery(query, el)),
      this.#initialData,
    )
  }

  where<P extends Path<UnIndexed<T>>>(
    field: P,
    opts: Opts<ExtractTypeFromPath<UnIndexed<T>, P>>,
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

function runQuery<T>(query: QueryStatement<T>, el: T): boolean {
  if (query.and) {
    return query.cond(el, query.field) && runQuery(query.and, el)
  }

  if (query.or) {
    return query.cond(el, query.field) || runQuery(query.or, el)
  }
  return query.cond(el, query.field)
}
