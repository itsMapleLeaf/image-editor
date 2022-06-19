import { useEffect, useRef } from "react"

export function useAnimationLoop(callback: () => void) {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    let running = true

    void (async () => {
      while (running) {
        callbackRef.current()
        await animationFrame()
      }
    })()

    return () => {
      running = false
    }
  }, [])
}

const animationFrame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve))
