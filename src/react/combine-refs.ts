import type { MutableRefObject, Ref } from "react"

export function combineRefs<T>(...refs: Array<Ref<T>>) {
  return function combinedRef(element: T | null) {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(element)
      } else if (ref !== null) {
        ;(ref as MutableRefObject<T | null>).current = element
      }
    }
  }
}
