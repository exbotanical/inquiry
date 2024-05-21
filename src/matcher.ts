import { isDeepStrictEqual } from 'util'

import { ExtractTypeFromPath, Path, PlainObject, Predicate } from './types'
import { getField } from './utils'

export class Matcher {
  static not<T extends PlainObject>(match: Predicate<T>) {
    return (el: T, fieldPath: Path<T>) => !match(el, fieldPath)
  }

  static eq(to: number | string) {
    return <T extends PlainObject>(el: T, fieldPath: Path<T>) =>
      getField(el, fieldPath) === to
  }

  static gt(to: number | string) {
    return <T extends PlainObject>(el: T, fieldPath: Path<T>) => {
      const f = getField(el, fieldPath)

      return f ? f > to : false
    }
  }

  static gte(to: number | string) {
    return <T extends PlainObject>(el: T, fieldPath: Path<T>) => {
      const f = getField(el, fieldPath)

      return f ? f >= to : false
    }
  }

  static lt(to: number | string) {
    return <T extends PlainObject>(el: T, fieldPath: Path<T>) => {
      const f = getField(el, fieldPath)

      return f ? f < to : false
    }
  }

  static lte(to: number | string) {
    return <T extends PlainObject>(el: T, fieldPath: Path<T>) => {
      const f = getField(el, fieldPath)

      return f ? f <= to : false
    }
  }

  static contains<T>(that: T) {
    return <T extends PlainObject>(el: T, fieldPath: Path<T>) => {
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

  static filter<T extends PlainObject, P extends Path<T>>(
    fn: (viewData: ExtractTypeFromPath<T, P>) => boolean,
  ) {
    return (el: T, fieldPath: P) => {
      const f = getField(el, fieldPath) as ExtractTypeFromPath<T, P>

      return fn(f)
    }
  }
}
