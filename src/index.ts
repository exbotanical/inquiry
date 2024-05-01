export class Queryable<T> {
  constructor(private readonly data: T) {}
  get() {
    return new Query<T>(this.data)
  }
}

type TType<T> = T extends Array<any> ? T[0] : T

type Predicate<T> = (el: TType<T>, field: KeyOf<T>) => boolean

export type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false

type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> &
            string}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never

export type Path<T> = keyof T extends string
  ? PathImpl<T, keyof T> | keyof T extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never

interface IQuery<T> {
  field: Path<TType<T>>
  cond: Predicate<T>
  and?: IQuery<T>
  or?: IQuery<T>
}

function getField<T extends Record<string, any>>(
  obj: T,
  fieldPath: Path<T>,
): any {
  const parts = fieldPath.split('.')
  let result = obj

  for (const part of parts) {
    if (!result || typeof result !== 'object') {
      return undefined
    }
    result = result[part]
  }

  return result
}

export class Matcher {
  static not(that: string) {
    return <T extends Record<PropertyKey, any>>(
      el: TType<T>,
      fieldPath: Path<TType<T>>,
    ) => {
      return getField(el, fieldPath) !== that
    }
  }

  static eq(that: string | number) {
    return <T extends Record<PropertyKey, any>>(
      el: TType<T>,
      fieldPath: Path<TType<T>>,
    ) => {
      return getField(el, fieldPath) === that
    }
  }

  static gt(that: string | number) {
    return <T extends Record<PropertyKey, any>>(
      el: TType<T>,
      fieldPath: Path<TType<T>>,
    ) => {
      return getField(el, fieldPath) > that
    }
  }

  static lt(that: string | number) {
    return <T extends Record<PropertyKey, any>>(
      el: TType<T>,
      fieldPath: Path<TType<T>>,
    ) => {
      return getField(el, fieldPath) < that
    }
  }
}

type KeyOf<T> = T extends Array<any> ? keyof T[0] : keyof T

type Conjunction = 'and' | 'or'

export class Query<T> {
  constructor(private readonly data: T) {}

  #conjunctionStack: Conjunction[] = []
  #queries: IQuery<T>[] = []

  where(field: Path<TType<T>>, pred: Predicate<T>) {
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

  #run(): TType<T>[] {
    return this.#queries.reduce<TType<T>[]>(
      (acc, query) => [...acc.filter(el => runQuery(query, el))],
      (Array.isArray(this.data) ? this.data : [this.data]) as TType<T>[],
    )
  }
}

function runQuery<T>(query: IQuery<T>, el: TType<T>): boolean {
  if (query.and) {
    return query.cond(el, query.field) && runQuery(query.and, el)
  }

  if (query.or) {
    return query.cond(el, query.field) || runQuery(query.or, el)
  }
  return query.cond(el, query.field)
}
