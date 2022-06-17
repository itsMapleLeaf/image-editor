import type { ForwardedRef, ReactNode } from "react"
import { forwardRef } from "react"
import type { FrameState } from "./frame-state"

export function FrameShade({
  state,
  children,
}: {
  state: FrameState
  children: ReactNode
}) {
  return (
    <div
      className="relative bg-black/25 brightness-50 filter"
      style={{ width: state.width, height: state.height }}
    >
      {children}
    </div>
  )
}

// TODO: undo forwardRef on this and pass frameRef as regular prop
export const FrameHighlight = forwardRef(function FrameHighlight(
  { state, children }: { state: FrameState; children: ReactNode },
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className="relative overflow-clip"
      style={{ width: state.width, height: state.height }}
      ref={ref}
    >
      {children}
    </div>
  )
})
