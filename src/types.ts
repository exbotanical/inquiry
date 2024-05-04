export type Conjunction = 'and' | 'or'

export type UnIndexed<T> = T extends Array<any> ? T[number] : T

export type Predicate<T> = (
  el: UnIndexed<T>,
  field: Path<UnIndexed<T>>,
) => boolean

export type Path<T> =
  T extends Array<any>
    ? never
    : T extends object
      ? {
          [K in keyof T & (string | number)]: K extends string
            ? `${K}` | `${K}.${Path<T[K]>}`
            : never
        }[keyof T & (string | number)]
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
