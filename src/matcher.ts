import { Path, Predicate, UnIndexed } from './types'
import { getField } from './utils'

export class Matcher {
  static not<T extends Record<PropertyKey, any>>(match: Predicate<T>) {
    return (el: UnIndexed<T>, fieldPath: Path<UnIndexed<T>>) =>
      !match(el, fieldPath)
  }

  static eq(to: number | string) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => getField(el, fieldPath) === to
  }

  static gt(to: number | string) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f > to : false
    }
  }

  static gte(to: number | string) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f >= to : false
    }
  }

  static lt(to: number | string) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f < to : false
    }
  }

  static lte(to: number | string) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f <= to : false
    }
  }

  // TODO: type-check - fieldPath must correlate to an array type
  // TODO: type-check - `to` must match the same type as el[fieldPath]
  static contains<
    T extends Record<PropertyKey, any>,
    R = UnIndexed<T>[keyof UnIndexed<T>],
  >(to: R extends Array<any> ? R[number] : never) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return Array.isArray(f) ? (f as Array<UnIndexed<T>>).includes(to) : false
    }
  }
}
