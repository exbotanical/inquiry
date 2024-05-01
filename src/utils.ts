import { Path } from './types'

export function getField<T extends Record<string, any>>(
  obj: T,
  fieldPath: Path<T>,
): T | T[keyof T] | undefined {
  const parts = fieldPath.split('.')

  let result = obj

  for (const part of parts) {
    if (!result || typeof result !== 'object') {
      return undefined
    }
    result = result[part]
  }

  return result
}
