export type PlainObject = Record<PropertyKey, any>
export type Conjunction = 'and' | 'or'
export type UnIndexed<T> = T extends any[] ? T[number] : T
export type Predicate<T> = (el: T, field: Path<T>) => boolean

export type Path<T> = T extends any[]
  ? never
  : T extends object
    ? {
        [K in keyof T & (number | string)]: K extends string
          ? `${K}.${Path<T[K]>}` | `${K}`
          : never
      }[keyof T & (number | string)]
    : never

export type ExtractTypeFromPath<
  T,
  P extends string,
> = P extends `${infer Segment}.${infer Rest}`
  ? Segment extends keyof T
    ? ExtractTypeFromPath<T[Segment], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never
