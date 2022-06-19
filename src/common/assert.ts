type Falsy = false | 0 | "" | null | undefined
export function assert<T>(value: T | Falsy, message?: string): T {
  if (!value) {
    throw new Error(message ?? "Assertion failed")
  }
  return value
}
