import { observer } from "mobx-react-lite"
import { useState } from "react"
import useMeasure from "react-use-measure"
import { useWindowEvent } from "../dom/use-window-event"
import { Point } from "../math/point"
import type { EditorState } from "./editor-state"

export const EditorViewport = observer(function EditorViewport({
  editor,
  children,
}: {
  editor: EditorState
  children: React.ReactNode
}) {
  const [frameRef, frameRect] = useMeasure()
  const [pointer, setPointer] = useState(new Point())

  const getFrameRelativePointerPosition = (event: {
    clientX: number
    clientY: number
  }) => new Point(event.clientX - frameRect.left, event.clientY - frameRect.top)

  const getCursor = () => {
    const result = editor.findSpriteWithIntent(pointer)
    if (result?.intent === "resizeTopLeft") return "nw-resize"
    if (result?.intent === "resizeTopRight") return "ne-resize"
    if (result?.intent === "resizeBottomLeft") return "sw-resize"
    if (result?.intent === "resizeBottomRight") return "se-resize"
    if (result?.intent === "resizeLeft" || result?.intent === "resizeRight")
      return "ew-resize"
    if (result?.intent === "resizeTop" || result?.intent === "resizeBottom")
      return "ns-resize"
    if (result?.intent === "move") return "move"
  }

  useWindowEvent("pointermove", (event) => {
    editor.handlePointerMove(new Point(event.movementX, event.movementY))
    setPointer(getFrameRelativePointerPosition(event))
  })

  useWindowEvent("pointerup", () => {
    editor.handlePointerUp()
  })

  return (
    <div
      ref={frameRef}
      className="relative h-full overflow-clip"
      style={{ cursor: getCursor() }}
      // only capture pointerDown inside the frame
      onPointerDown={(event) => {
        editor.handlePointerDown(getFrameRelativePointerPosition(event))
      }}
    >
      {children}
    </div>
  )
})
