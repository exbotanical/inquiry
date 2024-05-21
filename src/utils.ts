import type { ExtractTypeFromPath, Path, PlainObject } from './types'

export function getField<T extends PlainObject>(
  obj: T,
  fieldPath: Path<T>,
): ExtractTypeFromPath<T, Path<T>> | undefined {
  const parts = fieldPath.split('.')

  let result = obj

  for (const part of parts) {
    if (!result || typeof result !== 'object') {
      return undefined
    }
    result = result[part]
  }

  return result as ExtractTypeFromPath<T, Path<T>>
}
