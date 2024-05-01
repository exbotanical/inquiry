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
}
