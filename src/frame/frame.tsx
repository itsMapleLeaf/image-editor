import type { ForwardedRef, ReactNode, Ref } from "react"
import { forwardRef } from "react"
import type { FrameState } from "./frame-state"

export function Frame({
  state,
  frameRef,
  children,
}: {
  state: FrameState
  frameRef: Ref<HTMLDivElement>
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full overflow-auto p-4">
      <div className="absolute inset-0 flex">
        <div className="m-auto">
          <FrameShade state={state}>{children}</FrameShade>
        </div>
      </div>
      <div className="absolute inset-0 flex">
        <div className="m-auto">
          <FrameHighlight state={state} ref={frameRef}>
            {children}
          </FrameHighlight>
        </div>
      </div>
    </div>
  )
}

function FrameShade({
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
const FrameHighlight = forwardRef(function FrameHighlight(
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
