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

interface EmailClause<T = boolean> {
  email: T
}

interface EmptyClause<T = boolean> {
  empty: T
}

type LengthClause<T = string> = {
  len: AtLeastOne<{
    min: T
    max: T
  }>
}

type AtLeastOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? Pick<T, K> & Partial<Omit<T, K>>
  : never

interface FilterClause<T> {
  filter: (fn: T) => boolean
}

type BaseOpts<T> =
  | ContainsClause<T>
  | EqClause<T>
  | FilterClause<T>
  | GtClause<T>
  | GteClause<T>
  | LtClause<T>
  | LteClause<T>
  // | EmailClause<T extends string ? boolean : never>
  | EmptyClause<T extends string ? boolean : never>
  | LengthClause<T extends string ? number : never>

type Opts<T> = BaseOpts<T> | NotClause<T>

interface WhereSubset<T extends PlainObject[]> {
  where: Query<T>['where']
}

const MATCHER_KEYS = Object.entries(Object.getOwnPropertyDescriptors(Matcher))
  .filter(([_, value]) => typeof value.value === 'function' && value.writable)
  .map(([key]) => key)

export class Query<T extends PlainObject[]> {
  readonly #initialData: UnIndexed<T>[]
  readonly #conjunctionStack: Conjunction[] = []
  readonly #queries: QueryStatement<UnIndexed<T>>[] = []

  constructor(private readonly data: T) {
    this.#initialData = this.data as unknown as UnIndexed<T>[]
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

  #getPredicate<S extends string>(
    opts: Opts<ExtractTypeFromPath<UnIndexed<T>, S>>,
  ): Predicate<UnIndexed<T>> {
    // TODO: regex match
    for (const option of MATCHER_KEYS) {
      if (option in opts) {
        const arg =
          opts[option as keyof Opts<ExtractTypeFromPath<UnIndexed<T>, S>>]
        const fn = Matcher[option as keyof typeof Matcher] as Function
        return fn(arg)
      }
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
