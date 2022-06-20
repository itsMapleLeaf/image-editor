import type { RefObject } from "react"
import { useEffect } from "react"

export function useHtmlElementEvent<Event extends keyof HTMLElementEventMap>(
  elementRef:
    | HTMLElement
    | RefObject<HTMLElement | undefined>
    | null
    | undefined,
  event: Event,
  handler: (event: HTMLElementEventMap[Event]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    const element =
      elementRef && "current" in elementRef ? elementRef.current : elementRef

    if (!element) return

    element.addEventListener(event, handler, options)
    return () => {
      element.removeEventListener(event, handler, options)
    }
  })
}
