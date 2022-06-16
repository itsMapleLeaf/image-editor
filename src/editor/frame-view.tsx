import clsx from "clsx"
import { observer } from "mobx-react-lite"
import type { ForwardedRef, ReactNode, Ref } from "react"
import { forwardRef } from "react"
import type { EditorStore } from "./editor-store"

export const FrameView = observer(function FrameView({
  store,
  children,
  frameRef,
}: {
  store: EditorStore
  children: React.ReactNode
  frameRef: Ref<HTMLDivElement>
}) {
  return (
    <div className="relative flex h-full overflow-auto p-4">
      <div className="absolute inset-0 flex">
        <div className="m-auto">
          <FrameShade store={store}>{children}</FrameShade>
        </div>
      </div>
      <div className="absolute inset-0 flex">
        <div className="m-auto">
          <FrameHighlight store={store} ref={frameRef}>
            {children}
          </FrameHighlight>
        </div>
      </div>
    </div>
  )
})

const FrameShade = observer(function FrameShade({
  store,
  children,
}: {
  store: EditorStore
  children: ReactNode
}) {
  return (
    <div
      className={clsx(
        "relative bg-black/25 brightness-50 filter",
        store.frameShape.name === "Circle" && "rounded-full",
      )}
      style={{ width: 100, height: 100 }}
    >
      {children}
    </div>
  )
})

const FrameHighlight = observer(
  // eslint-disable-next-line mobx/missing-observer, mobx/no-anonymous-observer
  forwardRef(function FrameHighlight(
    { store, children }: { store: EditorStore; children: ReactNode },
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    return (
      <div
        className={clsx(
          "relative overflow-clip",
          store.frameShape.name === "Circle" && "rounded-full",
        )}
        style={{ width: 100, height: 100 }}
        ref={ref}
      >
        {children}
      </div>
    )
  }),
)
