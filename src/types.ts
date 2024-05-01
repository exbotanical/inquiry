export type Conjunction = 'and' | 'or'

export type UnIndexed<T> = T extends any[] ? T[number] : T

export type Predicate<T> = (
  el: UnIndexed<T>,
  field: Path<UnIndexed<T>>,
) => boolean

type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false

type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
    ?
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
        | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> &
            string}`
    : never
  : never

export type Path<T> = keyof T extends string
  ? PathImpl<T, keyof T> | keyof T extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never
