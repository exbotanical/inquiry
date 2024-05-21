import { isDeepStrictEqual } from 'util'

import { Path, PlainObject, Predicate, UnIndexed } from './types'
import { getField } from './utils'

export class Matcher {
  static not<T extends PlainObject>(match: Predicate<T>) {
    return (el: UnIndexed<T>, fieldPath: Path<UnIndexed<T>>) =>
      !match(el, fieldPath)
  }

  static eq(to: number | string) {
    return <T extends PlainObject>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => getField(el, fieldPath) === to
  }

  static gt(to: number | string) {
    return <T extends PlainObject>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f > to : false
    }
  }

  static gte(to: number | string) {
    return <T extends PlainObject>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f >= to : false
    }
  }

  static lt(to: number | string) {
    return <T extends PlainObject>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f < to : false
    }
  }

  static lte(to: number | string) {
    return <T extends PlainObject>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      return f ? f <= to : false
    }
  }

  static contains<T>(that: T) {
    return <T extends PlainObject>(
      el: UnIndexed<T>,
      fieldPath: Path<UnIndexed<T>>,
    ) => {
      const f = getField(el, fieldPath)

      if (typeof f === 'string') {
        return f.includes(that)
      }

      if (Array.isArray(f)) {
        return (f as T[]).some(ff => isDeepStrictEqual(ff, that))
      }

      return false
    }
  }

  static filter<T extends PlainObject>(
    fn: (
      viewData: UnIndexed<T> | UnIndexed<T>[keyof UnIndexed<T>] | undefined,
    ) => boolean,
  ) {
    return (el: UnIndexed<T>, fieldPath: Path<UnIndexed<T>>) => {
      const f = getField(el, fieldPath)

      return fn(f)
    }
  }
}
