import { autorun } from "mobx"
import { observer } from "mobx-react-lite"
import { useEffect, useRef, useState } from "react"
import useMeasure from "react-use-measure"
import { Renderer } from "../canvas/renderer"
import { assert } from "../common/assert"
import { useWindowEvent } from "../dom/use-window-event"
import { Point } from "../math/point"
import type { EditorState } from "./editor-state"

export const EditorCanvas = observer(function EditorCanvas({
  editor,
}: {
  editor: EditorState
}) {
  const backgroundRef = useRef<HTMLCanvasElement>(null)
  const foregroundRef = useRef<HTMLCanvasElement>(null)
  const [containerRef, containerRect] = useMeasure()
  const [pointer, setPointer] = useState(new Point())

  const getFrameRelativePointerPosition = (event: {
    clientX: number
    clientY: number
  }) =>
    new Point(
      event.clientX - containerRect.left,
      event.clientY - containerRect.top,
    )

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

  useEffect(() => {
    return autorun(() => {
      const background = new Renderer(assert(backgroundRef.current))
      const foreground = new Renderer(assert(foregroundRef.current))

      background.clear()
      editor.renderSprites(background)

      foreground.clear()

      editor.renderFrameBackground(foreground)

      const { width, height } = editor.frame
      foreground.clipRect({ left: 0, top: 0, width, height }, () => {
        editor.renderSprites(foreground)
      })

      editor.selectedSprite?.renderSelection(foreground)
    })
  }, [editor])

  return (
    <div
      ref={containerRef}
      className="relative h-full"
      style={{ cursor: getCursor() }}
      // only capture pointerDown inside the frame
      onPointerDown={(event) => {
        editor.handlePointerDown(getFrameRelativePointerPosition(event))
      }}
    >
      <canvas
        ref={backgroundRef}
        width={containerRect.width}
        height={containerRect.height}
        className="absolute inset-0 brightness-50"
      />
      <canvas
        ref={foregroundRef}
        width={containerRect.width}
        height={containerRect.height}
        className="absolute inset-0"
      />
    </div>
  )
})
