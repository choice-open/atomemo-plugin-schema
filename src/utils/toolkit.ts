export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false
  if (Object.prototype.toString.call(value) !== "[object Object]") return false

  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export function compact<T>(
  values: Array<T | null | undefined | false | 0 | "" | typeof Number.NaN>,
): T[] {
  // Match common "compact" behavior: drop falsy values.
  // Note: `NaN` is truthy? Actually `Boolean(NaN) === false`, so it will be removed too.
  return values.filter(Boolean) as T[]
}
