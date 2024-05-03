export type Conjunction = 'and' | 'or'

export type UnIndexed<T> = T extends any[] ? T[number] : T

export type Predicate<T> = (
  el: UnIndexed<T>,
  field: Path<UnIndexed<T>>,
) => boolean

export type Path<T> =
  T extends Array<infer U>
    ? `${Path<U>}`
    : T extends object
      ? {
          [K in keyof T & (string | number)]: K extends string
            ? `${K}` | `${K}.${Path<T[K]>}`
            : never
        }[keyof T & (string | number)]
      : never

export type FieldTypeAtPath<
  T,
  Path extends string,
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? FieldTypeAtPath<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never

type IsArray<T> = T extends any[] ? true : false

export type FieldAndArrayCheck<T, Path extends string> = {
  fieldType: FieldTypeAtPath<T, Path>
  isArray: IsArray<FieldTypeAtPath<T, Path>>
}
