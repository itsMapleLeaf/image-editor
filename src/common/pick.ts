export function pick<T, K extends keyof T>(subject: T, keys: K[]) {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = subject[key]
  }
  return result
}
