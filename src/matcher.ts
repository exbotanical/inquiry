import { isDeepStrictEqual } from 'util'
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
  static contains<T>(that: T) {
    return <T extends Record<PropertyKey, any>>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)
      if (typeof f === 'string') {
        return f.includes(that)
      }

      if (Array.isArray(f)) {
        return (f as Array<T>).some(ff => isDeepStrictEqual(ff, that))
      }

      return false
    }
  }
}
