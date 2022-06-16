import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

// eslint-disable-next-line mobx/missing-observer
export function Portal({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLElement>()

  useEffect(() => {
    const container = document.createElement("react-portal")
    document.body.append(container)
    setContainer(container)
    return () => container.remove()
  }, [])

  return container ? createPortal(children, container) : <></>
}
