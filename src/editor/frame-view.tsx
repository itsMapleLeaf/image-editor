import clsx from "clsx"
import type { ForwardedRef, ReactNode, Ref } from "react"
import { forwardRef } from "react"
import type { FrameShape } from "./frame-shape"

export function FrameView({
  shape,
  frameRef,
  children,
}: {
  shape: FrameShape
  frameRef: Ref<HTMLDivElement>
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full overflow-auto p-4">
      <div className="absolute inset-0 flex">
        <div className="m-auto">
          <FrameShade shape={shape}>{children}</FrameShade>
        </div>
      </div>
      <div className="absolute inset-0 flex">
        <div className="m-auto">
          <FrameHighlight shape={shape} ref={frameRef}>
            {children}
          </FrameHighlight>
        </div>
      </div>
    </div>
  )
}

function FrameShade({
  shape,
  children,
}: {
  shape: FrameShape
  children: ReactNode
}) {
  return (
    <div
      className={clsx(
        "relative bg-black/25 brightness-50 filter",
        shape.name === "Circle" && "rounded-full",
      )}
      style={{ width: 100, height: 100 }}
    >
      {children}
    </div>
  )
}

const FrameHighlight = forwardRef(function FrameHighlight(
  { shape, children }: { shape: FrameShape; children: ReactNode },
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={clsx(
        "relative overflow-clip",
        shape.name === "Circle" && "rounded-full",
      )}
      style={{ width: 100, height: 100 }}
      ref={ref}
    >
      {children}
    </div>
  )
})
