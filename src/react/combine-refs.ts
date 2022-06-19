import type { MutableRefObject, RefCallback, RefObject } from "react"

export function combineRefs<T>(...refs: Array<RefCallback<T> | RefObject<T>>) {
  return function combinedRef(element: T | null) {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(element)
      } else {
        ;(ref as MutableRefObject<T | null>).current = element
      }
    }
  }
}
